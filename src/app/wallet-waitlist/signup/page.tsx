"use client";

import React, { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
  Shield,
  Fingerprint,
  Globe,
} from "lucide-react";
import {
  FaGift,
  FaXTwitter,
  FaGoogle,
  FaCheck,
  FaXmark,
} from "react-icons/fa6";
import { signup, validateReferralCode } from "../lib/waitlist-auth";
import AnimatedBackground from "../components/AnimatedBackground";
import Scene3D from "../components/Scene3D";
import LegalProtocolsModal from "../components/LegalProtocolsModal";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ReCaptchaWrapper from "../components/ReCaptchaWrapper";

const MAX_USERNAME_LENGTH = 20;

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState(referralCode || "");
  const [referralStatus, setReferralStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    referrer: string;
    points: number;
  } | null>(null);

  // Debounced referral check - only validate when PNX-XXXXXX pattern is complete
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      // Check for complete PNX-XXXXXX pattern (10 chars)
      const isValidPattern = /^PNX-[A-Z0-9]{6}$/i.test(referral);

      if (!referral || referral.length === 0) {
        setReferralStatus("idle");
        return;
      }

      // If pattern doesn't match, show invalid only when >= 10 chars (fully typed but wrong)
      if (!isValidPattern) {
        if (referral.length >= 10) {
          setReferralStatus("invalid");
        } else {
          setReferralStatus("idle"); // Still typing
        }
        return;
      }

      // Valid pattern - check against database
      setReferralStatus("checking");
      const isValid = await validateReferralCode(referral.toUpperCase());
      setReferralStatus(isValid ? "valid" : "invalid");
    }, 300); // Faster debounce since we only hit DB on valid pattern

    return () => clearTimeout(timer);
  }, [referral]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreedToTerms) {
      setError("Acknowledge the protocol terms to proceed");
      return;
    }
    if (password.length < 6) {
      setError("Security key must be at least 6 characters");
      return;
    }

    setLoading(true);

    // Execute reCAPTCHA
    let recaptchaToken: string | undefined = undefined;
    if (executeRecaptcha) {
      try {
        recaptchaToken = await executeRecaptcha("signup");
      } catch (err) {
        console.error("[RECAPTCHA] execution failed:", err);
      }
    }

    const result = await signup(
      username,
      email,
      password,
      referral || undefined,
      recaptchaToken,
    );

    if (result.success && result.user) {
      // Prefer explicit referral metadata from server
      const wasReferred = (result as any).wasReferred ?? false;
      const rewardsApplied = (result as any).rewardsApplied ?? null;

      if (wasReferred || result.user.referredBy) {
        setCelebrationData({
          referrer: result.user.referredBy?.username || "your referrer",
          points: rewardsApplied?.newUser ?? 75,
        });
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/wallet-waitlist/dashboard");
        }, 3000);
      } else {
        router.push("/wallet-waitlist/dashboard");
      }
    } else {
      setError(result.error || "Identity initialization failed");
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
              <span className="text-[#2547D0] font-mono text-[10px] tracking-widest uppercase">
                Identity Genesis
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Initialize <br /> Access.
            </h1>
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
                  animate={{ height: "auto", opacity: 1 }}
                  className="mb-8 overflow-hidden"
                >
                  <div className="bg-[#2547D0]/10 border border-[#2547D0]/30 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#2547D0]/20 rounded-lg">
                        <FaGift className="w-4 h-4 text-[#2547D0]" />
                      </div>
                      <div>
                        <p className="text-[#2547D0] text-xs font-bold uppercase tracking-wider">
                          Protocol Bonus
                        </p>
                        <p className="text-white/60 text-[10px]">
                          +75 PXP Points Applied
                        </p>
                      </div>
                    </div>
                    <div className="font-mono text-[10px] text-[#2547D0]">
                      [ {referralCode} ]
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Username Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="username"
                    className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1"
                  >
                    Identity ID
                  </label>
                  <span className="text-[10px] font-mono text-gray-700">
                    {username.length}/{MAX_USERNAME_LENGTH}
                  </span>
                </div>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#2547D0] transition-colors" />
                  <input
                    id="username"
                    name="username"
                    autoComplete="username"
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
                <label
                  htmlFor="email"
                  className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1"
                >
                  Email Address
                </label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#2547D0] transition-colors" />
                  <input
                    id="email"
                    name="email"
                    autoComplete="email"
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
                <label
                  htmlFor="password"
                  className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1"
                >
                  Password
                </label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-[#2547D0] transition-colors" />
                  <input
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
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
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Referral Field (Manual) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="referral"
                    className="text-[10px] font-mono uppercase text-gray-500 tracking-widest ml-1"
                  >
                    Referral Code (Optional)
                  </label>
                  <AnimatePresence>
                    {referralStatus === "invalid" && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-red-500 font-bold uppercase tracking-wider"
                      >
                        Invalid Code
                      </motion.span>
                    )}
                    {referralStatus === "valid" && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-green-500 font-bold uppercase tracking-wider"
                      >
                        Code Applied
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative group/input">
                  <FaGift
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${referralStatus === "valid" ? "text-green-500" : referralStatus === "invalid" ? "text-red-500" : "text-gray-600 group-focus-within/input:text-[#2547D0]"}`}
                  />
                  <input
                    id="referral"
                    name="referral"
                    type="text"
                    value={referral}
                    onChange={(e) => {
                      setReferral(e.target.value.toUpperCase());
                      if (e.target.value === "") setReferralStatus("idle");
                    }}
                    placeholder="PNX-XXXXXX"
                    className={`w-full pl-12 pr-10 py-4 bg-white/[0.03] border rounded-xl text-sm transition-all focus:outline-none placeholder:text-gray-700 uppercase font-mono ${
                      referralStatus === "invalid"
                        ? "border-red-500/50 focus:border-red-500"
                        : referralStatus === "valid"
                          ? "border-green-500/50 focus:border-green-500"
                          : "border-white/5 focus:border-[#2547D0]/50"
                    }`}
                  />
                  {/* Status Indicator Icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {referralStatus === "checking" && (
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    )}
                    {referralStatus === "valid" && (
                      <FaCheck className="w-3 h-3 text-green-500" />
                    )}
                    {referralStatus === "invalid" && (
                      <FaXmark
                        className="w-3 h-3 text-red-500 cursor-pointer"
                        onClick={() => {
                          setReferral("");
                          setReferralStatus("idle");
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Custom Web3-style Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group/check">
                <div className="relative mt-1">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 border border-white/20 rounded bg-white/5 peer-checked:bg-[#2547D0] peer-checked:border-[#2547D0] transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-white text-[10px]">
                    ✓
                  </div>
                </div>
                <span className="text-[11px] text-gray-500 group-hover/check:text-gray-300 transition-colors leading-snug">
                  I authorize the initialization of this identity and 
                  agree to the
                  <button
                    type="button"
                    onClick={() => setIsLegalModalOpen(true)}
                    className="text-white hover:text-[#2547D0] transition-colors px-1 underline underline-offset-4 cursor-pointer"
                  >
                    Legal Protocols
                  </button>
                  .
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

              {/* Friendly CTAs for common conflict errors */}
              {error && (
                <div className="mt-3">
                  {error.includes("Email") && (
                    <div className="flex gap-3">
                      <Link
                        href="/wallet-waitlist/login"
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all text-xs rounded-md"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/wallet-waitlist/forgot"
                        className="px-4 py-2 bg-transparent border border-white/10 text-xs rounded-md hover:bg-white/5"
                      >
                        Forgot password
                      </Link>
                    </div>
                  )}
                  {error.includes("Username") && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setUsername("")}
                        className="px-4 py-2 bg-white/5 border border-white/10 text-xs rounded-md"
                      >
                        Choose another username
                      </button>
                    </div>
                  )}
                  {error.includes("Wallet") && (
                    <div className="flex gap-3">
                      <Link
                        href="/wallet-waitlist/login"
                        className="px-4 py-2 bg-white/5 border border-white/10 text-xs rounded-md"
                      >
                        Resolve linked wallet
                      </Link>
                    </div>
                  )}
                  {/* Device ID Conflict Handling */}
                  {(error.includes("device") || error.includes("previous account")) && (
                    <div className="flex gap-3">
                      <Link
                        href="/wallet-waitlist/login"
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all text-xs rounded-md"
                      >
                        Log in to existing account
                      </Link>
                      <Link
                        href="/wallet-waitlist/forgot"
                        className="px-4 py-2 bg-transparent border border-white/10 text-xs rounded-md hover:bg-white/5"
                      >
                        Forgot password
                      </Link>
                    </div>
                  )}
                </div>
              )}

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
              <p className="text-[10px] font-mono text-center text-gray-600 tracking-widest uppercase">
                External Identity Bridges
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => alert("Bridge Active Soon")}
                  className="flex items-center justify-center gap-3 py-3 bg-white/[0.03] border border-white/5 hover:border-white/20 rounded-xl transition-all"
                >
                  <FaXTwitter className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase">
                    X (Twitter)
                  </span>
                </button>
                <button
                  onClick={() => alert("Bridge Active Soon")}
                  className="flex items-center justify-center gap-3 py-3 bg-white/[0.03] border border-white/5 hover:border-white/20 rounded-xl transition-all"
                >
                  <FaGoogle className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase">
                    GOOGLE
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/wallet-waitlist/login"
                className="text-xs text-gray-500 hover:text-[#2547D0] transition-colors"
              >
                Already registered?{" "}
                <span className="font-bold text-white ml-1">
                  RESUME_SESSION
                </span>
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

      {/* Celebration Overlay */}
      <AnimatePresence>
        {celebrationData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="text-center p-12 max-w-lg"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="w-24 h-24 bg-[#2547D0] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(37,71,208,0.5)]"
              >
                <FaGift className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">
                Genesis Bonus <br />
                <span className="text-[#2547D0]">Unlocked</span>
              </h2>

              <p className="text-white/60 mb-8 font-mono text-sm leading-relaxed">
                You were invited by{" "}
                <span className="text-white font-bold">
                  {celebrationData.referrer}
                </span>
                . <br />
                As a priority recruit, you've earned{" "}
                <span className="text-[#2547D0] font-bold">
                  +{celebrationData.points} PXP
                </span>{" "}
                for initializing your node.
              </p>

              <div className="flex flex-col items-center gap-4">
                <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-[#2547D0]"
                  />
                </div>
                <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase animate-pulse">
                  Redirecting to Command Center in 5s...
                </span>
              </div>
            </motion.div>

            {/* Particle Effects (Subtle Background) */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    y: [null, Math.random() * -100],
                    opacity: [0, 0.5, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  className="absolute w-1 h-1 bg-[#2547D0] rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LegalProtocolsModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
      />
    </div>
  );
}

export default function SignupPage() {
  return (
    <ReCaptchaWrapper>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <SignupContent />
      </Suspense>
    </ReCaptchaWrapper>
  );
}
