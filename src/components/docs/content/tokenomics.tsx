import React from 'react';
import { PieChart, Zap, Repeat, TrendingUp } from 'lucide-react';

export const TokenOverview = () => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300 leading-relaxed text-lg">
    <p>
      <span className="text-white font-bold">$PENX</span> is the native utility token of the ecosystem. 
      It is an ERC-20 token on Base (for liquidity) with a privacy-wrapped counterpart on Aleo (pPENX).
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Token Symbol</div>
        <div className="text-xl font-bold text-white">$PENX</div>
      </div>
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Supply</div>
        <div className="text-xl font-bold text-white">1,000,000,000</div>
      </div>
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Network</div>
        <div className="text-xl font-bold text-white">Base / Aleo</div>
      </div>
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Type</div>
        <div className="text-xl font-bold text-white">Utility / Gov</div>
      </div>
    </div>

    <div className="bg-[#0A0D1F] border border-white/10 p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Distribution Philosophy</h3>
      <p className="text-sm text-gray-400">
        The tokenomics are designed to incentivize long-term builders and liquidity providers, not just speculators. 
        A significant portion of the supply is reserved for <span className="text-white">Ecosystem Rewards</span> (merchants and users) 
        and <span className="text-white">Liquidity Mining</span>.
      </p>
    </div>
  </div>
);

export const TokenUtility = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-green-900/10 border border-green-500/20">
          <Zap className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-white font-bold mb-2">Staking & Security</h3>
          <p className="text-sm text-gray-400">
            Stake PENX to secure the network and earn yield. Stakers signal long-term commitment and are rewarded from protocol fees.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-blue-900/10 border border-blue-500/20">
          <Repeat className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-white font-bold mb-2">Medium of Exchange</h3>
          <p className="text-sm text-gray-400">
            The primary currency for the PENX Marketplace. Using PENX typically incurs lower fees than using other assets.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-purple-900/10 border border-purple-500/20">
          <PieChart className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-white font-bold mb-2">Governance</h3>
          <p className="text-sm text-gray-400">
            Holders steer the direction of the "State". From fee parameters to feature prioritization in the wallet.
          </p>
        </div>
      </div>
    </div>
  );

export const EconomicFlywheel = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300 leading-relaxed text-lg">
      <div className="flex items-center gap-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-500/20">
        <TrendingUp className="w-12 h-12 text-orange-400 shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-white mb-1">The Growth Loop</h3>
          <p className="text-sm text-gray-400">
            More Merchants → More Products → More Users → Higher Volume → More Fees → Higher Staking Yield → More Token Demand.
          </p>
        </div>
      </div>
  
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white font-space">Revenue Model</h3>
        <ul className="space-y-4">
            <li className="flex gap-3">
                <span className="text-green-500 font-bold">1.</span>
                <span>
                    <strong className="text-white">Marketplace Fees:</strong> A small percentage (1-2%) of every sale goes to the DAO Treasury.
                </span>
            </li>
            <li className="flex gap-3">
                <span className="text-green-500 font-bold">2.</span>
                <span>
                    <strong className="text-white">Swipe Fees:</strong> PENXPAY charges merchants a competitive rate (lower than Visa/Mastercard) for processing crypto payments.
                </span>
            </li>
            <li className="flex gap-3">
                <span className="text-green-500 font-bold">3.</span>
                <span>
                    <strong className="text-white">Premium Services:</strong> Advanced analytics and privacy tools for power users are paid in PENX.
                </span>
            </li>
        </ul>
        <p className="text-sm text-gray-500 italic mt-4">
            * Protocol revenue is used to buy back and burn PENX (deflationary) or distributed to stakers, depending on DAO governance.
        </p>
      </div>
    </div>
  );
