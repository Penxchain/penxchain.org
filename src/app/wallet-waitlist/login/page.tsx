"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ChevronRight, Shield, Fingerprint, Globe } from 'lucide-react';
import { FaXTwitter, FaGoogle } from 'react-icons/fa6';
import { login } from '../lib/waitlist-auth';
import AnimatedBackground from '../components/AnimatedBackground';
import Scene3D from '../components/Scene3D';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import ReCaptchaWrapper from '../components/ReCaptchaWrapper';

function LoginContent() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUnderReview, setIsUnderReview] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsUnderReview(false);
    setLoading(true);

    // Execute reCAPTCHA
    let recaptchaToken: string | undefined = undefined;
    if (executeRecaptcha) {
      try {
        recaptchaToken = await executeRecaptcha('login');
      } catch (err) {
        console.error('[RECAPTCHA] execution failed:', err);
      }
    }

    const result = await login(identifier, password, recaptchaToken);

    if (result.success) {
      router.push('/wallet-waitlist/dashboard');
    } else {
      if (result.isUnderReview) {
        setIsUnderReview(true);
      }
      setError(result.error || 'Identity initialization failed');
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'twitter' | 'google') => {
    // Placeholder for social login
    console.log(`Social login with ${provider}`);
    setError(`${provider} bridge unavailable. System locked.`);
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
              <span className="text-[#2547D0] font-mono text-[10px] tracking-widest uppercase">Access Control</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Welcome <br /> Back.</h1>
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

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
              
              {/* Email Field */}
              {/* Identifier Field (Email or Username) */}
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1">Identity ID / Email / Username</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#2547D0] transition-colors" />
                  <input
                    id="identifier"
                    name="identifier"
                    autoComplete="username"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="ProUser123 or email@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm transition-all focus:outline-none focus:border-[#2547D0]/50 placeholder:text-gray-700 font-mono"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label htmlFor="password" className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1">Security Key</label>
                   <button type="button" className="text-[10px] font-mono text-[#2547D0]/70 hover:text-[#2547D0] transition-colors">FORGOT_KEY?</button>
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#2547D0] transition-colors" />
                  <input
                    id="password"
                    name="password"
                    autoComplete="current-password"
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

              {/* Error / Under Review Box */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start gap-3 p-4 border rounded-xl text-xs ${
                      isUnderReview
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {isUnderReview ? (
                      <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
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
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Resume Session</span>
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
                  <button onClick={() => handleSocialLogin('twitter')} className="flex items-center justify-center gap-3 py-3 bg-white/[0.03] border border-white/5 hover:border-white/20 rounded-xl transition-all">
                    <FaXTwitter className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase">X (Twitter)</span>
                  </button>
                  <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 py-3 bg-white/[0.03] border border-white/5 hover:border-white/20 rounded-xl transition-all">
                    <FaGoogle className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase">GOOGLE</span>
                  </button>
               </div>
            </div>

            <div className="mt-8 text-center">
               <Link href="/wallet-waitlist/signup" className="text-xs text-gray-500 hover:text-[#2547D0] transition-colors">
                  New to the network? <span className="font-bold text-white ml-1">INITIALIZE_ID</span>
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

export default function LoginPage() {
  return (
    <ReCaptchaWrapper>
      <LoginContent />
    </ReCaptchaWrapper>
  );
}
