import React, { useState } from 'react';
import { ReferralTier } from '../types';
import { Users, Copy, Share2, TrendingUp, Gift, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ReferralSystemProps {
  referrals: ReferralTier[];
}

const REFERRAL_BONUS = 2500;

const ReferralSystem: React.FC<ReferralSystemProps> = ({ referrals }) => {
  const [copied, setCopied] = useState(false);

  const commissionEarnings = referrals.reduce((acc, curr) => acc + curr.earnings, 0);
  const totalReferrals = referrals.reduce((acc, curr) => acc + curr.count, 0);
  
  // Calculate bonus earnings based on total referral count
  const bonusEarnings = totalReferrals * REFERRAL_BONUS;
  
  // Total displayed earnings is commission + bonuses
  const totalEarnings = commissionEarnings + bonusEarnings;

  const copyLink = () => {
    // In a real TMA, this would use Telegram's utils
    navigator.clipboard.writeText("https://t.me/StarClickerBot?start=ref123")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto h-full overflow-y-auto pb-24">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Referral Network</h2>
        <p className="text-gray-400 text-sm">Build your empire and earn commissions.</p>
      </div>

      {/* Bonus Info Card */}
      <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 p-4 rounded-xl border border-blue-500/30 mb-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-20"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-blue-600/80 p-3 rounded-xl shadow-lg shadow-blue-900/50">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Onboarding Bonus</h3>
            <p className="text-xs text-gray-300 mt-1">
              Get <span className="text-yellow-400 font-bold">+{REFERRAL_BONUS.toLocaleString()}</span> for every invite
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-2 mb-2 text-gray-400 text-xs uppercase font-bold">
            <Users className="w-4 h-4" />
            <span>Network Size</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalReferrals}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-2 mb-2 text-gray-400 text-xs uppercase font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Total Earnings</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{totalEarnings.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500 mt-1">Includes {bonusEarnings.toLocaleString()} from bonuses</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 h-48">
          <h3 className="text-xs text-gray-400 font-bold mb-2 uppercase">Commission Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={referrals}>
              <XAxis dataKey="level" tickFormatter={(val) => `Lvl ${val}`} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
              />
              <Bar dataKey="earnings" fill="#fbbf24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
      </div>

      {/* Tiers List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase">Commission Tiers</h3>
        {referrals.map((tier) => (
          <div key={tier.level} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center font-bold text-blue-400 text-sm">
                {tier.level}
              </div>
              <div>
                <div className="text-white font-semibold">Level {tier.level}</div>
                <div className="text-xs text-blue-400">{tier.percentage}% Commission</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{tier.count} Users</div>
              <div className="text-xs text-yellow-400">+{tier.earnings.toLocaleString()} comms</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-4 flex justify-center space-x-4 max-w-md mx-auto">
        <button 
          onClick={copyLink}
          disabled={copied}
          className={`relative flex-1 font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all duration-300 ${
            copied 
              ? 'bg-green-600 text-white shadow-green-600/30 scale-95 ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:scale-[1.02]'
          }`}
        >
          <div className="relative w-5 h-5">
             <div className={`absolute inset-0 transition-all duration-300 ${copied ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
                <Copy className="w-5 h-5" />
             </div>
             <div className={`absolute inset-0 transition-all duration-300 ${copied ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}`}>
                <Check className="w-5 h-5" />
             </div>
          </div>
          <span className="min-w-[4.5rem] text-center">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
        <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors">
          <Share2 className="w-5 h-5" />
          <span>Invite</span>
        </button>
      </div>
    </div>
  );
};

export default ReferralSystem;