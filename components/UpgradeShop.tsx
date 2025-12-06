import React from 'react';
import { UserState, UpgradeItem } from '../types';
import { MousePointer2, Battery, Zap, Lock } from 'lucide-react';

interface UpgradeShopProps {
  userState: UserState;
  buyUpgrade: (type: UpgradeItem['type'], cost: number) => void;
}

const UpgradeShop: React.FC<UpgradeShopProps> = ({ userState, buyUpgrade }) => {
  
  const calculateCost = (baseCost: number, level: number) => {
    return Math.floor(baseCost * Math.pow(1.5, level - 1));
  };

  const upgrades: UpgradeItem[] = [
    {
      id: '1',
      name: 'Multitap',
      description: 'Increase coins per tap',
      baseCost: 100,
      level: userState.multitapLevel,
      type: 'MULTITAP',
      icon: 'mouse'
    },
    {
      id: '2',
      name: 'Energy Limit',
      description: 'Increase maximum energy',
      baseCost: 200,
      level: userState.energyLimitLevel,
      type: 'ENERGY_LIMIT',
      icon: 'battery'
    },
    {
      id: '3',
      name: 'Recharge Speed',
      description: 'Regenerate energy faster',
      baseCost: 500,
      level: userState.rechargeRateLevel,
      type: 'RECHARGE_SPEED',
      icon: 'zap'
    }
  ];

  return (
    <div className="p-4 w-full max-w-md mx-auto h-full overflow-y-auto pb-24">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">System Upgrades</h2>
      
      <div className="space-y-4">
        {upgrades.map((item) => {
          const currentCost = calculateCost(item.baseCost, item.level);
          const canAfford = userState.balance >= currentCost;

          return (
            <div key={item.id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-700 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-400">
                  {item.icon === 'mouse' && <MousePointer2 />}
                  {item.icon === 'battery' && <Battery />}
                  {item.icon === 'zap' && <Zap />}
                </div>
                <div>
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-gray-400">{item.description}</p>
                  <p className="text-xs text-blue-400 mt-1">Lvl {item.level}</p>
                </div>
              </div>

              <button
                onClick={() => canAfford && buyUpgrade(item.type, currentCost)}
                disabled={!canAfford}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  canAfford 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' 
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canAfford ? (
                  <div className="flex flex-col items-center">
                    <span>Buy</span>
                    <span className="text-[10px] opacity-80">{currentCost.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Lock className="w-3 h-3 mb-1" />
                    <span className="text-[10px]">{currentCost.toLocaleString()}</span>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-dashed border-slate-600">
        <h3 className="text-center text-gray-400 text-sm font-semibold">More coming soon...</h3>
      </div>
    </div>
  );
};

export default UpgradeShop;
