import React, { useState } from 'react';
import { getOracleWisdom } from '../services/geminiService';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { UserState } from '../types';

interface AiOracleProps {
  userState: UserState;
  deductCost: (amount: number) => void;
}

const COST_PER_ASK = 500;

const AiOracle: React.FC<AiOracleProps> = ({ userState, deductCost }) => {
  const [wisdom, setWisdom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askOracle = async () => {
    if (userState.balance < COST_PER_ASK) return;
    
    deductCost(COST_PER_ASK);
    setLoading(true);
    setWisdom(null);
    
    const result = await getOracleWisdom(userState.balance);
    setWisdom(result);
    setLoading(false);
  };

  return (
    <div className="p-6 w-full max-w-md mx-auto h-full flex flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <div className="inline-block p-4 rounded-full bg-purple-900/30 border border-purple-500/50 mb-4 animate-pulse">
           <Brain className="w-16 h-16 text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          The Star Oracle
        </h2>
        <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">
          Consult the AI for guidance on your journey.
          <br />Cost: <span className="text-yellow-400">{COST_PER_ASK} Coins</span>
        </p>
      </div>

      <div className="w-full min-h-[150px] flex items-center justify-center bg-slate-800/50 rounded-2xl border border-purple-500/30 p-6 relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="text-xs text-purple-300 tracking-widest uppercase">Consulting the Stars...</span>
          </div>
        ) : wisdom ? (
          <div className="text-center relative z-10">
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -left-2 opacity-50" />
            <p className="text-lg font-medium text-white italic">"{wisdom}"</p>
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -bottom-2 -right-2 opacity-50" />
          </div>
        ) : (
          <p className="text-gray-600 text-sm">The Oracle awaits your query.</p>
        )}
      </div>

      <button
        onClick={askOracle}
        disabled={loading || userState.balance < COST_PER_ASK}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
          userState.balance >= COST_PER_ASK && !loading
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
            : 'bg-slate-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? 'Communing...' : 'Ask the Oracle'}
      </button>

      <div className="text-xs text-gray-500 text-center">
        Powered by Gemini 2.5 Flash
      </div>
    </div>
  );
};

export default AiOracle;
