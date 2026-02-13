import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Globe, Zap } from 'lucide-react';

export const ExecutiveSummary = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Hero Paragraph */}
    <div className="text-xl md:text-2xl font-light leading-relaxed text-blue-100/90">
      <p>
        <span className="font-bold text-white">PENXCHAIN</span> is the first privacy-centric ecosystem designed to bring 
        <span className="text-blue-400"> confidential commerce</span> to the public blockchain.
      </p>
    </div>

    <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
      <p>
        We are building a unified digital economy where users can transact, trade, and build wealth without 
        exposing their entire financial history to the world. The ecosystem combines three core pillars:
      </p>

      {/* Pillars Grid */}
      <div className="grid md:grid-cols-3 gap-6 my-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
          <Shield className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Private by Default</h3>
          <p className="text-sm text-gray-400">
            Utilizing Zero-Knowledge Proofs (ZKPs) to secure transaction data while remaining auditable.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors">
          <Globe className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Commerce First</h3>
          <p className="text-sm text-gray-400">
            A native marketplace and payment layer (PENXPAY) built for real-world merchant adoption.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
          <Zap className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Hybrid Speed</h3>
          <p className="text-sm text-gray-400">
            Anchored on Base for speed and liquidity, bridging to Aleo for absolute privacy when needed.
          </p>
        </div>
      </div>

      <p>
        The <span className="text-white font-medium">PENX token</span> is the economic engine of this system. It facilitates governance, 
        secures the network through staking, and serves as the primary medium of exchange within the marketplace.
      </p>
    </div>

    {/* CTA */}
    <div className="flex items-center gap-4 pt-4">
      <Link href="/docs/story-and-vision" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
        Read our Vision <ArrowRight size={16} />
      </Link>
    </div>
  </div>
);

export const StoryAndVision = () => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300 leading-relaxed text-lg">
    <div className="border-l-4 border-blue-500 pl-6 py-2">
      <h3 className="text-2xl font-bold text-white font-space italic">
        "Privacy is necessary for an open society in the electronic age."
      </h3>
      <p className="text-sm text-gray-500 mt-2">— Eric Hughes, A Cypherpunk's Manifesto (1993)</p>
    </div>

    <p>
      Every era of the internet has been shaped by a single question: <span className="text-white">who controls value and information?</span>
    </p>
    
    <p>
      For decades, the answer has been centralized platforms. These giants capture user data, control relationships, 
      and extract value from every transaction. Merchants pay for visibility, users exchange privacy for convenience, 
      and communities are stripped of their sovereignty.
    </p>

    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-2 font-space">The Broken State of Crypto Commerce</h3>
      <p>
        Even within crypto, the promise of "freedom" is often hollow. Most blockchains are radically transparent:
        everyone can see your balance, your transaction history, and your counterparties. This is 
        <span className="text-red-400 font-medium"> surveillance dressed as transparency</span>.
      </p>
      <p>
        No business wants their competitors to see their supplier payments. No individual wants the world 
        to know their net worth every time they buy a coffee. Useable privacy is missing.
      </p>
    </div>

    <div className="bg-[#0A0D1F] p-8 rounded-2xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">The PENXCHAIN Solution</h3>
      <p className="mb-6">
        We didn't just build another chain. We built a specific set of tools to solve this paradox:
      </p>
      <ul className="space-y-4">
        <li className="flex gap-3">
          <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span>
            <strong className="text-white">Sovereignty:</strong> You own your keys, your data, and your identity.
          </span>
        </li>
        <li className="flex gap-3">
          <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span>
            <strong className="text-white">Utility:</strong> A real marketplace for buying and selling goods, not just speculating on tokens.
          </span>
        </li>
        <li className="flex gap-3">
          <div className="mt-1.5 w-2 h-2 rounded-full bg-purple-500 shrink-0" />
          <span>
            <strong className="text-white">Privacy:</strong> Transaction details are obfuscated by default when using our privacy tools.
          </span>
        </li>
      </ul>
    </div>

    <p>
      Our vision is simple: A global, private economy where anyone, anywhere can transact freely 
      without fear of surveillance or censorship.
    </p>
  </div>
);
