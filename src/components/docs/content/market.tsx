import React from 'react';
import { TrendingUp, Lock, AlertTriangle, Users } from 'lucide-react';

export const MarketLandscape = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-xl font-light leading-relaxed text-gray-300">
      <p>
        The intersection of privacy and digital commerce represents one of the largest 
        untapped opportunities in the blockchain space. As of 2025, the global retail cryptocurrency 
        market is valued at over <span className="text-white font-bold">$539 Million</span>, 
        projected to double by 2030. Yet, a critical barrier remains: 
        <span className="text-blue-400 font-medium"> The Privacy Paradox</span>.
      </p>
    </div>

    {/* The Problem Grid */}
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white font-space">The State of Crypto Commerce</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#0A0D1F] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertTriangle size={20} />
            </div>
            <h4 className="font-bold text-white">Public Surveillance</h4>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            On Ethereum or Solana, every purchase is a public broadcast. A merchant receiving payment 
            can see a customer's entire neet worth. A competitor can track a business's supplier payments. 
            This "radical transparency" is incompatible with real-world business needs.
          </p>
        </div>

        <div className="bg-[#0A0D1F] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
              <Lock size={20} />
            </div>
            <h4 className="font-bold text-white">Metadata Leakage</h4>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Even with "pseudonymous" wallets, metadata analysis can link addresses to real-world identities 
            with frightening accuracy. Once linked, a user's financial history becomes permanently exploitable.
          </p>
        </div>
      </div>
    </div>

    {/* Market Opportunity */}
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white font-space">The Opportunity Gap</h3>
      <p className="text-gray-300 leading-relaxed text-lg">
        There is a massive vacuum for a solution that offers <span className="text-white font-medium">cash-like privacy</span> with <span className="text-white font-medium">digital convenience</span>. 
        Existing privacy coins (like Monero) lack the smart contract capabilities needed for modern commerce (DeFi, NFTs, automated escrow).
      </p>
      
      <div className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl">
        <h4 className="text-lg font-bold text-white mb-2">The PENXCHAIN Advantage</h4>
        <p className="text-blue-100/80">
          PENXCHAIN fills this gap by building on <span className="text-white">Aleo</span> — introducing the first 
          suite of privacy-preserving commerce tools that remain fully compliant and programmable. 
          We are capturing the market of users who value sovereignty but demand usability.
        </p>
      </div>
    </div>

    {/* Statistics */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
      <div>
        <div className="text-3xl font-bold text-white mb-1">14.8%</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">CAGR Growth</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white mb-1">48%</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">Merchant Adoption</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white mb-1">Low</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">Current Privacy</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white mb-1">High</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">Demand</div>
      </div>
    </div>
  </div>
);
