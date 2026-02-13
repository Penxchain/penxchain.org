import React from 'react';
import { Wallet, ShoppingBag, CreditCard, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import Link from 'next/link';

export const EcosystemOverview = () => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300 leading-relaxed text-lg">
    <p>
      The PENXCHAIN ecosystem is not just a blockchain; it is a full-stack commercial infrastructure. 
      It creates a closed-loop economy where value can be generated, stored, and spent without ever 
      leaving a secure, private environment.
    </p>

    <div className="grid gap-6 md:grid-cols-3">
      <Link href="/docs/native-wallet" className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
        <Wallet className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-white font-bold mb-2">Native Wallet</h3>
        <p className="text-sm text-gray-400">The gateway. Non-custodial, multichain support (Base + Aleo), and biometric security.</p>
      </Link>

      <Link href="/docs/marketplace" className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
        <ShoppingBag className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
        <h3 className="text-white font-bold mb-2">Marketplace</h3>
        <p className="text-sm text-gray-400">The economy. A decentralized bazaar for physical and digital goods with private settlement.</p>
      </Link>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-75">
        <CreditCard className="w-8 h-8 text-green-400 mb-4" />
        <h3 className="text-white font-bold mb-2">PENXPAY (Soon)</h3>
        <p className="text-sm text-gray-400">The bridge. Merchant tools for accepting crypto with fiat settlement options.</p>
      </div>
    </div>
  </div>
);

export const NativeWallet = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-gray-300 text-lg leading-relaxed space-y-6">
      <p>
        The <span className="text-white font-bold">PENXCHAIN Wallet</span> is built for the 99% of people who want to use crypto, 
        not just trade it. It abstracts away the complexity of "Gas fees" and "Chain IDs" behind a unified, beautiful interface.
      </p>

      <div className="grid md:grid-cols-2 gap-8 my-8">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Fingerprint size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Biometric Security</h4>
              <p className="text-gray-400 text-sm">
                Your keys are encrypted on-device using FaceID/TouchID enclaves. No more memorizing 24 words for daily access.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Privacy Mode</h4>
              <p className="text-gray-400 text-sm">
                Toggle "Privacy Mode" to route transaction through Aleo's zero-knowledge layer, hiding your balance and recipient.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-6 flex flex-col justify-center items-center text-center">
            <h4 className="text-white font-bold mb-2">Multichain by Design</h4>
            <p className="text-gray-500 text-sm mb-4">
                Seamlessly managing assets across Base (L2 speed) and Aleo (Privacy).
            </p>
            <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold border border-blue-600/30">BASE</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">ALEO</span>
            </div>
        </div>
      </div>
    </div>
  </div>
);

export const Marketplace = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300 leading-relaxed text-lg">
      <p>
        The <strong>PENX Marketplace</strong> is a decentralized platform where users can buy and sell goods 
        using $PENX. Unlike traditional marketplaces that harvest your purchase history for ads, 
        PENX Marketplace utilizes ZKPs to ensure that <span className="text-white">what you buy is your business only.</span>
      </p>
  
      <div className="bg-[#0A0D1F] border-l-4 border-green-500 p-6 rounded-r-xl">
        <h4 className="text-white font-bold mb-2">Key Features</h4>
        <ul className="space-y-2 text-sm text-gray-400">
            <li>• <strong>Private Listings</strong>: Sellers can choose to reveal details only to verified buyers.</li>
            <li>• <strong>Escrow Smart Contracts</strong>: Funds are held safely until delivery is confirmed.</li>
            <li>• <strong>Reputation System</strong>: Zero-knowledge reputation allows trust without doxxing identities.</li>
        </ul>
      </div>
    </div>
  );
