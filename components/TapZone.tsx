import React, { useState, useRef, useEffect } from 'react';
import { UserState } from '../types';
import { Zap, Coins } from 'lucide-react';

interface TapZoneProps {
  userState: UserState;
  handleTap: () => void;
}

interface FloatText {
  id: number;
  x: number;
  y: number;
  value: number;
}

const TapZone: React.FC<TapZoneProps> = ({ userState, handleTap }) => {
  const [clicks, setClicks] = useState<FloatText[]>([]);
  const tapRef = useRef<HTMLDivElement>(null);

  // Clean up floating text animations
  useEffect(() => {
    const timer = setInterval(() => {
      setClicks((prev) => prev.filter((c) => Date.now() - c.id < 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onUserTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (userState.energy < userState.multitapLevel) return;

    // Handle touch or mouse coordinates
    let clientX, clientY;
    if ('touches' in e) {
      // Use the first touch point
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = tapRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const newClick: FloatText = {
        id: Date.now(),
        x,
        y,
        value: userState.multitapLevel
      };
      
      setClicks(prev => [...prev, newClick]);
      handleTap();

      // Simple visual feedback on the button
      const btn = e.currentTarget;
      btn.classList.remove('tap-anim');
      void btn.offsetWidth; // trigger reflow
      btn.classList.add('tap-anim');
    }
  };

  const energyPercentage = (userState.energy / userState.maxEnergy) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-8 px-4">
      {/* Score Header */}
      <div className="flex flex-col items-center">
        <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Total Balance</p>
        <div className="flex items-center space-x-2">
          <Coins className="w-10 h-10 text-yellow-400" />
          <h1 className="text-5xl font-black text-white">{userState.balance.toLocaleString()}</h1>
        </div>
      </div>

      {/* Main Interactive Button */}
      <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
        <div 
          ref={tapRef}
          onClick={onUserTap} // Fallback for desktop
          onTouchStart={onUserTap} // Primary for mobile to avoid 300ms delay
          className="relative w-64 h-64 rounded-full bg-gradient-to-b from-blue-600 to-blue-900 border-4 border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.5)] active:scale-95 transition-transform duration-100 cursor-pointer flex items-center justify-center overflow-hidden group select-none"
        >
          {/* Inner details for visual appeal */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
          <div className="w-48 h-48 rounded-full bg-blue-800/50 flex items-center justify-center border border-blue-500/30">
             <img src="https://picsum.photos/200/200?random=1" alt="Planet" className="w-32 h-32 rounded-full opacity-80 pointer-events-none" />
          </div>

          {/* Floating Text Renderer */}
          {clicks.map((click) => (
             <div
               key={click.id}
               className="floating-text"
               style={{ left: click.x, top: click.y }}
             >
               +{click.value}
             </div>
          ))}
        </div>
      </div>

      {/* Energy Bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm font-bold mb-1">
          <div className="flex items-center text-yellow-400">
            <Zap className="w-4 h-4 mr-1 fill-current" />
            <span>{Math.floor(userState.energy)} / {userState.maxEnergy}</span>
          </div>
          <span className="text-gray-500">Recharge: +{userState.rechargeRateLevel}/s</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-700 overflow-hidden">
          <div 
            className="bg-yellow-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${energyPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TapZone;
