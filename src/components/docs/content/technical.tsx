import React from 'react';
import { Layers, Shield, Database, Lock, Map, CheckCircle, Circle } from 'lucide-react';

export const TechnologyArchitecture = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-xl font-light leading-relaxed text-gray-300">
      <p>
        The PENXCHAIN architecture is a <span className="text-white font-bold">Hybrid Privacy Model</span>. 
        We recognize that not every transaction needs privacy, but critical commerce data does. 
        To achieve this, we bridge two powerful ecosystems: <span className="text-blue-400">Base</span> and <span className="text-white">Aleo</span>.
      </p>
    </div>

    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-white font-space">The Stack</h3>
      
      {/* Stack Diagram substitute */}
      <div className="grid gap-4">
        <div className="bg-[#0A0D1F] p-6 rounded-2xl border border-blue-500/30 relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Layers size={100} />
          </div>
          <h4 className="text-blue-400 font-bold mb-2">Layer 2: Liquidity & Speed (Base)</h4>
          <p className="text-gray-400 text-sm max-w-2xl">
            The public facing ledger. All ERC-20 PENX tokens live here by default. This layer handles 
            high-frequency trading, exchange listings, and simplified governance voting. It inherits 
            security from Ethereum but offers low fees and 1-second block times.
          </p>
        </div>

        <div className="flex justify-center">
            <div className="h-8 w-0.5 bg-gradient-to-b from-blue-500/30 to-purple-500/30"></div>
        </div>

        <div className="bg-[#0A0D1F] p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-10">
            <Lock size={100} />
          </div>
          <h4 className="text-purple-400 font-bold mb-2">Privacy Layer (Aleo)</h4>
          <p className="text-gray-400 text-sm max-w-2xl">
            The zero-knowledge execution environment. When you "shield" PENX, it moves here. 
            The marketplace smart contracts reside on this layer, ensuring that purchase details, 
            prices, and identities are cryptographically hidden from the public eye.
          </p>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6 pt-6">
      <div className="col-span-2">
        <h3 className="text-2xl font-bold text-white font-space mb-4">Zero-Knowledge Proofs (ZKPs)</h3>
        <p className="text-gray-300 leading-relaxed">
          At the core of our privacy is <strong>zk-SNARK</strong> technology. This allows a user to prove they have 
          enough funds to buy an item without revealing their total balance. It allows a merchant to prove 
          they shipped an item without revealing their warehouse location. It is trust through mathematics, not intermediaries.
        </p>
      </div>
    </div>
  </div>
);

const RoadmapItem = ({ phase, title, items, status }: { phase: string, title: string, items: string[], status: 'done' | 'current' | 'upcoming' }) => {
    const isDone = status === 'done';
    const isCurrent = status === 'current';
    
    return (
        <div className={`relative pl-8 pb-8 border-l ${isDone ? 'border-blue-500' : isCurrent ? 'border-blue-500' : 'border-white/10'} last:border-0`}>
            <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
                isDone ? 'bg-[#020410] border-blue-500' : 
                isCurrent ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
                'bg-[#0A0D1F] border-white/20'
            }`} />
            
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isCurrent ? 'text-blue-400' : 'text-gray-500'}`}>
                {phase}
            </div>
            <h4 className={`text-lg font-bold text-white mb-3 ${isDone ? 'opacity-80' : ''}`}>
                {title}
            </h4>
            
            <ul className="space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                        {isDone ? <CheckCircle size={14} className="mt-1 text-blue-500 shrink-0" /> : <Circle size={10} className="mt-1.5 opacity-50 shrink-0" />}
                        <span className={isDone ? 'line-through opacity-60' : ''}>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export const Roadmap = () => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-gray-300 leading-relaxed">
      <p>
        The path to building a private digital economy is iterative. We are currently in the 
        <span className="text-white font-bold"> Foundation Phase</span>, laying the tracks for secure commerce.
      </p>
    </div>

    <div className="mt-8">
        <RoadmapItem 
            phase="Phase 1 (Q1 2026)" 
            title="Foundation & Core Functionality" 
            status="current"
            items={[
                "Global Wallet MVP Release (iOS/Android)",
                "Base <-> Aleo Asset Bridge Integration",
                "Private Marketplace Smart Contract Logic (Alpha)",
                "Community Building & Ambassador Program"
            ]}
        />
        <RoadmapItem 
            phase="Phase 2 (Q2 2026)" 
            title="Marketplace Launch" 
            status="upcoming"
            items={[
                "Private Marketplace Beta on Aleo Mainnet",
                "Encrypted Messaging for Buyers/Sellers",
                "PENXPAY Development (Merchant API)",
                "Strategic Retail Partnerships"
            ]}
        />
        <RoadmapItem 
            phase="Phase 3 (Q3 2026)" 
            title="Expansion & Governance" 
            status="upcoming"
            items={[
                "PENXPAY Beta Launch for Merchants",
                "PENXDAO Governance Activation",
                "Staking Dashboard V2",
                "Cross-border Fiat Ramps"
            ]}
        />
         <RoadmapItem 
            phase="Phase 4 (Q4 2026+)" 
            title="Ecosystem Scaling" 
            status="upcoming"
            items={[
                "Global Merchant Onboarding Campaign",
                "Developer SDK Release",
                "Decentralized Identity (DID) Integration",
                "mobile Point-of-Sale (mPOS) Integration"
            ]}
        />
    </div>
  </div>
);
