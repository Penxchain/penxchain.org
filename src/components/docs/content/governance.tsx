import React from 'react';
import { Vote, Users, MessageSquare, FileText } from 'lucide-react';

export const Governance = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-xl font-light leading-relaxed text-blue-100/90">
      <p>
        <span className="font-bold text-white">PENXDAO</span> is the decentralized governing body of the PENXCHAIN ecosystem. 
        It allows <span className="text-blue-400 font-medium">$PENX holders</span> to propose and vote on changes 
        that shape the future of the network.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl bg-[#0A0D1F] border border-white/10">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Vote className="text-green-400" />
          What You Can Vote On
        </h3>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="flex gap-2">
            <span className="text-green-500">•</span>
            Protocol upgrades and smart contract changes.
          </li>
          <li className="flex gap-2">
            <span className="text-green-500">•</span>
            Marketplace fee structures and treasury allocation.
          </li>
          <li className="flex gap-2">
            <span className="text-green-500">•</span>
            Ecosystem grants for developers and merchants.
          </li>
        </ul>
      </div>

      <div className="p-6 rounded-2xl bg-[#0A0D1F] border border-white/10">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Users className="text-blue-400" />
          DAO Structure
        </h3>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="flex gap-2">
            <span className="text-blue-500">•</span>
            <strong>1 PENX = 1 Vote</strong> (Standard governance).
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500">•</span>
            <strong>Quadratic Voting</strong> experimentation for grant funding.
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500">•</span>
            <strong>Privacy Voting</strong>: Leveraging ZKPs to vote without revealing your exact holdings publicly.
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl">
      <h3 className="text-lg font-bold text-white mb-2">Why It Matters</h3>
      <p className="text-gray-300">
        Commerce platforms like Amazon or Shopify are dictatorships; they change rules arbitrarily. 
        PENXCHAIN is a democracy. Merchants and users who build value in the ecosystem inherently 
        gain a voice in how it is run.
      </p>
    </div>
  </div>
);
