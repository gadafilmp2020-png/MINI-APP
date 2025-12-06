import React, { useState, useEffect } from 'react';
import { View, UserState, ReferralTier } from './types';
import TapZone from './components/TapZone';
import UpgradeShop from './components/UpgradeShop';
import ReferralSystem from './components/ReferralSystem';
import AiOracle from './components/AiOracle';
import { LayoutDashboard, ShoppingBag, Users, Brain } from 'lucide-react';

// Initial Mock Data
const INITIAL_STATE: UserState = {
  balance: 0,
  energy: 1000,
  maxEnergy: 1000,
  multitapLevel: 1,
  energyLimitLevel: 1,
  rechargeRateLevel: 1
};

const MOCK_REFERRALS: ReferralTier[] = [
  { level: 1, percentage: 10, count: 12, earnings: 4500 },
  { level: 2, percentage: 5, count: 45, earnings: 2100 },
  { level: 3, percentage: 1, count: 128, earnings: 850 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.GAME);
  // Persist state to local storage to survive refreshes
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('starClickerState');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('starClickerState', JSON.stringify(userState));
  }, [userState]);

  // Energy Recharge Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setUserState((prev) => {
        if (prev.energy >= prev.maxEnergy) return prev;
        return {
          ...prev,
          energy: Math.min(prev.maxEnergy, prev.energy + prev.rechargeRateLevel)
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    setUserState((prev) => {
      const cost = prev.multitapLevel; // Energy cost scales with tap power (design choice)
      if (prev.energy < cost) return prev;
      return {
        ...prev,
        balance: prev.balance + prev.multitapLevel,
        energy: prev.energy - cost
      };
    });
  };

  const buyUpgrade = (type: 'MULTITAP' | 'ENERGY_LIMIT' | 'RECHARGE_SPEED', cost: number) => {
    setUserState((prev) => {
      if (prev.balance < cost) return prev;
      const newState = { ...prev, balance: prev.balance - cost };
      
      switch (type) {
        case 'MULTITAP':
          newState.multitapLevel += 1;
          break;
        case 'ENERGY_LIMIT':
          newState.energyLimitLevel += 1;
          newState.maxEnergy += 500;
          break;
        case 'RECHARGE_SPEED':
          newState.rechargeRateLevel += 1;
          break;
      }
      return newState;
    });
  };

  const deductCost = (amount: number) => {
    setUserState(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount)
    }));
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans overflow-hidden flex flex-col">
      {/* Top Bar for status (Battery/Wifi would be OS level, so we just do App UI) */}
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden pb-20">
        {currentView === View.GAME && (
          <TapZone userState={userState} handleTap={handleTap} />
        )}
        {currentView === View.UPGRADES && (
          <UpgradeShop userState={userState} buyUpgrade={buyUpgrade} />
        )}
        {currentView === View.REFERRALS && (
          <ReferralSystem referrals={MOCK_REFERRALS} />
        )}
        {currentView === View.ORACLE && (
          <AiOracle userState={userState} deductCost={deductCost} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 h-20 px-6 flex justify-between items-center z-50 max-w-md mx-auto w-full">
        <NavButton 
          active={currentView === View.REFERRALS} 
          onClick={() => setCurrentView(View.REFERRALS)}
          icon={<Users size={24} />}
          label="Friends"
        />
        <NavButton 
          active={currentView === View.GAME} 
          onClick={() => setCurrentView(View.GAME)}
          icon={<LayoutDashboard size={24} />}
          label="Tap"
          main
        />
        <NavButton 
          active={currentView === View.UPGRADES} 
          onClick={() => setCurrentView(View.UPGRADES)}
          icon={<ShoppingBag size={24} />}
          label="Boost"
        />
        <NavButton 
          active={currentView === View.ORACLE} 
          onClick={() => setCurrentView(View.ORACLE)}
          icon={<Brain size={24} />}
          label="Oracle"
        />
      </nav>
    </div>
  );
};

// Helper Component for Nav
const NavButton: React.FC<{
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  main?: boolean;
}> = ({ active, onClick, icon, label, main }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center transition-all duration-200 ${
      active ? 'text-yellow-400 scale-110' : 'text-gray-500 hover:text-gray-300'
    } ${main ? '-mt-8' : ''}`}
  >
    <div className={`${main ? 'bg-blue-600 p-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] border-4 border-slate-900' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold mt-1 ${main ? 'mt-2' : ''}`}>{label}</span>
  </button>
);

export default App;
