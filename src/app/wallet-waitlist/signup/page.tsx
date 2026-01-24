"use client";

import React, { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, Eye, EyeOff, AlertCircle, 
  ChevronRight, Shield, Fingerprint, Globe 
} from 'lucide-react';
import { FaGift, FaXTwitter, FaGoogle } from 'react-icons/fa6';
import { signup } from '../lib/waitlist-auth';
import AnimatedBackground from '../components/AnimatedBackground';
import Scene3D from '../components/Scene3D';

const MAX_USERNAME_LENGTH = 20;

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState(referralCode || '');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreedToTerms) { setError('Acknowledge the protocol terms to proceed'); return; }
    if (password.length < 6) { setError('Security key must be at least 6 characters'); return; }
    
    setLoading(true);
    // Mimic blockchain latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = signup(username, email, password, referral || undefined);

    if (result.success) {
        router.push('/wallet-waitlist/dashboard');
    } else {
      setError(result.error || 'Identity initialization failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020202] text-white flex items-center justify-center p-6 selection:bg-[#2547D0]">
      {/* 1. LAYER: THE CORE ENGINE (Background) */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground opacity={0.2} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,71,208,0.1),transparent_70%)]" />
      </div>

      {/* 2. LAYER: HUD ELEMENTS (The "Premium" Details) */}
      <div className="fixed top-10 left-10 z-50 hidden lg:block font-mono text-[10px] text-gray-500 tracking-[0.3em]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#2547D0]" />
          <span>ESTABLISHING SECURE UPLINK...</span>
        </div>
      </div>

      {/* 3. LAYER: MAIN TERMINAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px]"
      >
        {/* Header Section */}
        <div className="mb-8 pl-2">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[1px] w-8 bg-[#2547D0]" />
              <span className="text-[#2547D0] font-mono text-[10px] tracking-widest uppercase">Identity Genesis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Initialize <br /> Access.</h1>
          </motion.div>
        </div>

        <Scene3D />
        {/* The Card */}
        <div className="relative group">
          {/* Animated Border Glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[#2547D0]/40 to-transparent rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-[#080808]/80 backdrop-blur-3xl rounded-2xl p-8 md:p-10 border border-white/5 shadow-2xl overflow-hidden">
            
            {/* Subtle Inner Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20" />

            {/* Referral Badge - Web3 Style */}
            <AnimatePresence>
              {referralCode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mb-8 overflow-hidden"
                >
                  <div className="bg-[#2547D0]/10 border border-[#2547D0]/30 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#2547D0]/20 rounded-lg">
                        <FaGift className="w-4 h-4 text-[#2547D0]" />
                      </div>
                      <div>
                        <p className="text-[#2547D0] text-xs font-bold uppercase tracking-wider">Protocol Bonus</p>
                        <p className="text-white/60 text-[10px]">+50 PXP Points Applied</p>
                      </div>
                    </div>
                    <div className="font-mono text-[10px] text-[#2547D0]">[ {referralCode} ]</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              {/* Username Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1">Identity ID</label>
                   <span className="text-[10px] font-mono text-gray-700">{username.length}/{MAX_USERNAME_LENGTH}</span>
                </div>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#2547D0] transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    maxLength={MAX_USERNAME_LENGTH}
                    placeholder="CHOOSE_USERNAME"
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 group-hover/input:border-white/10 focus:border-[#2547D0]/50 rounded-xl text-sm transition-all focus:outline-none placeholder:text-gray-700"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1">Email Address</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#2547D0] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm transition-all focus:outline-none focus:border-[#2547D0]/50 placeholder:text-gray-700"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#2547D0] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm transition-all focus:outline-none focus:border-[#2547D0]/50 placeholder:text-gray-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Custom Web3-style Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group/check">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 border border-white/20 rounded bg-white/5 peer-checked:bg-[#2547D0] peer-checked:border-[#2547D0] transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-white text-[10px]">✓</div>
                </div>
                <span className="text-[11px] text-gray-500 group-hover/check:text-gray-300 transition-colors leading-snug">
                  I authorize the initialization of this identity and agree to the 
                  <span className="text-white hover:text-[#2547D0] transition-colors px-1 underline underline-offset-4">Legal Protocols</span>.
                </span>
              </label>

              {/* Error Box */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

             

              {/* Submit Button - The "Hot" Interaction */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>Syncing Hash...</span>
                    </>
                  ) : (
                    <>
                      <span>Create an account</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-[#2547D0] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
               <p className="text-[10px] font-mono text-center text-gray-600 tracking-widest uppercase">External Identity Bridges</p>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => alert('Bridge Active Soon')} className="flex items-center justify-center gap-3 py-3 bg-white/[0.03] border border-white/5 hover:border-white/20 rounded-xl transition-all">
                    <FaXTwitter className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase">X (Twitter)</span>
                  </button>
                  <button onClick={() => alert('Bridge Active Soon')} className="flex items-center justify-center gap-3 py-3 bg-white/[0.03] border border-white/5 hover:border-white/20 rounded-xl transition-all">
                    <FaGoogle className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase">GOOGLE</span>
                  </button>
               </div>
            </div>

            <div className="mt-8 text-center">
               <Link href="/wallet-waitlist/login" className="text-xs text-gray-500 hover:text-[#2547D0] transition-colors">
                  Already registered? <span className="font-bold text-white ml-1">RESUME_SESSION</span>
               </Link>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex justify-between px-2 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <Scene3D />
           <div className="flex gap-4 items-center">
             <Shield className="w-3 h-3" />
             <Fingerprint className="w-3 h-3" />
             <Globe className="w-3 h-3" />
           </div>
           <span className="text-[9px] font-mono">SECURED BY ALEO ZK-PROOF</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}