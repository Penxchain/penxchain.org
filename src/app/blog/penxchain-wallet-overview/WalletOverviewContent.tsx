/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ShareButtons from "@/components/ShareButtons";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

// --- TYPES ---
interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

// --- HELPER ---
const getStorageValue = (key: string, defaultValue: string) => {
  if (typeof window === "undefined") return defaultValue;
  return localStorage.getItem(key) || defaultValue;
};

// --- SUB-COMPONENTS ---

// NOTE: Phone Mockup stays GREEN per instructions
const WalletPhoneMockup = () => {
  return (
    <div className="relative mx-auto w-75 h-150 bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden ring-1 ring-white/10 z-10 transform transition-transform duration-500 hover:rotate-1 hover:scale-[1.02]">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20 flex items-center justify-center gap-2">
        <div className="w-12 h-1.5 bg-gray-700 rounded-full opacity-50" />
      </div>

      {/* Screen Reflection */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none z-20 rounded-[2.5rem]" />

      {/* Screen Content - GREEN THEME PRESERVED */}
      <div className="w-full h-full bg-[#0a0f1e] text-white pt-10 px-6 pb-6 flex flex-col relative overflow-hidden">
        {/* Background blobs inside phone */}
        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#0ce50c]/10 blur-3xl rounded-full" />

        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#0ce50c] to-emerald-600 flex items-center justify-center font-bold text-xs text-black">
              DM
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Welcome back,</p>
              <p className="text-xs font-bold">Dev Marvelee</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-5 rounded-2xl mb-6 relative overflow-hidden">
          <p className="text-xs text-gray-400 mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold text-white mb-4">$100,500.00</h2>
          <div className="flex gap-2">
            <div className="h-1 w-12 bg-[#0ce50c] rounded-full" />
            <div className="h-1 w-6 bg-gray-600 rounded-full" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { icon: "↑", label: "Send" },
            { icon: "↓", label: "Receive" },
            { icon: "↔", label: "Swap" },
            { icon: "⋮", label: "More" },
          ].map((action, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg group-hover:bg-[#0ce50c] group-hover:text-black transition-colors duration-300">
                {action.icon}
              </div>
              <span className="text-[10px] text-gray-400">{action.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Activity List */}
        <div className="flex-1 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold">Recent Activity</h3>
            <span className="text-[10px] text-[#0ce50c]">See All</span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 rounded-xl bg-white/2 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs">
                    ETH
                  </div>
                  <div>
                    <p className="text-xs font-bold">Ethereum</p>
                    <p className="text-[10px] text-gray-500">Received</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#0ce50c]">+ 2.5 ETH</p>
                  <p className="text-[10px] text-gray-500">$4,250.00</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is PENXCHAIN Wallet truly private?",
      a: "Yes. Using Zero-Knowledge Proofs, your balances and transaction history remain hidden. Only you can see your full financial activity.",
    },
    {
      q: "Who controls my funds?",
      a: "You do. PENXCHAIN Wallet is self-custodial, meaning you hold your private keys. No one can freeze, seize, or access your funds.",
    },
    {
      q: "Can I use it for everyday payments?",
      a: "Absolutely. The wallet is designed for fast, practical transactions while maintaining privacy. Perfect for daily commerce.",
    },
    {
      q: "What blockchains are supported?",
      a: "Currently native PENXCHAIN assets, with bridges to Ethereum and Solana coming in Q3 2026.",
    },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-white/10 rounded-xl bg-white/2 overflow-hidden group"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center p-5 text-left hover:bg-white/2 transition-colors"
          >
            <span className="font-semibold text-white/90 group-hover:text-blue-400 transition-colors">
              {faq.q}
            </span>
            <span
              className={`text-blue-500 transform transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 text-white/60 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default function PenxchainWalletPage() {
  const postId = "penxchain-wallet-overview";
  const [mounted, setMounted] = useState(false);

  // --- STATE MANAGEMENT (Mastered Pattern) ---

  // 1. Initialize State (Lazy load from localStorage)
  const [isLiked, setIsLiked] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? getStorageValue(`blog_liked_${postId}`, "false") === "true"
      : false
  );

  const [likeCount, setLikeCount] = useState<number>(() =>
    typeof window !== "undefined"
      ? parseInt(getStorageValue(`blog_likes_${postId}`, "0"), 10)
      : 0
  );

  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  // 2. Handle Mounting (Prevents Hydration Mismatch)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // --- ANIMATION LOGIC ---
  const createHearts = useCallback(() => {
    const newHearts: Heart[] = [];
    const count = Math.floor(Math.random() * 3) + 3; // Generates 3 to 5 hearts

    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: heartIdCounter + i,
        x: Math.random() * 100 - 50, // Center spread
        size: Math.random() * 10 + 20, // 20px to 30px
        duration: Math.random() * 0.5 + 1.5, // 1.5s to 2.0s
        delay: i * 0.1,
        rotation: (Math.random() - 0.5) * 60, // -30deg to +30deg
        drift: (Math.random() - 0.5) * 30, // Horizontal drift
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);
    setHeartIdCounter((prev) => prev + count);

    // Self-cleanup
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.find((nh) => nh.id === h.id))
      );
    }, 2500);
  }, [heartIdCounter]);

  // --- INTERACTION LOGIC ---
  const handleLike = useCallback(() => {
    const newLikedState = !isLiked;
    const newCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);

    setIsLiked(newLikedState);
    setLikeCount(newCount);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        `blog_liked_${postId}`,
        String(newLikedState)
      );
      window.localStorage.setItem(`blog_likes_${postId}`, String(newCount));
    }

    if (newLikedState) {
      createHearts();
    }
  }, [isLiked, likeCount, postId, createHearts]);

  return (
    <main className="min-h-screen bg-[#020410] text-slate-200 selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      {/* --- BLUE BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-100 h-100 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      {/* --- STICKY NAV --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020410]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* BACK BUTTON: PREMIUM RED */}
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-red-400 transition-colors"
          >
            <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/70 group-hover:text-red-500 group-hover:-translate-x-0.5 transition-transform"
              >
                <path d="M19 12H5m7 7-7-7 7-7" />
              </svg>
            </div>
            <span>Back to Blog</span>
          </Link>

          <ShareButtons
            title="PENXCHAIN Wallet: Privacy-First Self-Custodial Wallet"
            slug="penxchain-wallet"
          />
        </div>
      </nav>

      {/* --- JSON-LD --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "PENXCHAIN Wallet: Privacy-First Self-Custodial Wallet",
            description:
              "The PENXCHAIN Wallet is a privacy-first, self-custodial wallet built for secure everyday payments using Zero-Knowledge Proofs.",
            author: { "@type": "Organization", name: "PENXCHAIN" },
            publisher: { "@type": "Organization", name: "PENXCHAIN" },
          }),
        }}
      />

      <article className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* --- HERO SPLIT SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="order-2 lg:order-1"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Product Spotlight
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight"
            >
              Privacy in Your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                Pocket.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 mb-8 leading-relaxed max-w-lg"
            >
              The PENXCHAIN Wallet uses Zero-Knowledge Proofs to let you
              transact, swap, and trade without exposing your balances. Complete
              control, zero compromise.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 w-full sm:w-auto hover:border-blue-500/30 transition-colors">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="text-sm font-bold text-white">
                    Self-Custodial
                  </div>
                  <div className="text-xs text-white/50">
                    Your Keys, Your Crypto
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 w-full sm:w-auto hover:border-blue-500/30 transition-colors">
                <span className="text-2xl">👁️</span>
                <div>
                  <div className="text-sm font-bold text-white">
                    Zero-Knowledge
                  </div>
                  <div className="text-xs text-white/50">100% Private Data</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Content (Phone) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleUp}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative elements behind phone - BLUE GLOW */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-87.5 h-87.5 bg-blue-600 rounded-full blur-[120px] opacity-20" />
              {/* Internal Phone components remain GREEN */}
              <WalletPhoneMockup />
            </div>
          </motion.div>
        </div>

        {/* --- FEATURES GRID --- */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-24"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-white mb-12 text-center"
          >
            Built for the <span className="text-blue-500">Privacy Economy</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "💸",
                title: "Private Payments",
                desc: "Send crypto like cash. No public history.",
              },
              {
                icon: "🔄",
                title: "Native Swaps",
                desc: "Swap assets instantly without tracking.",
              },
              {
                icon: "🛍️",
                title: "Commerce Ready",
                desc: "Connects to PENXCHAIN Marketplace.",
              },
              {
                icon: "⚡",
                title: "Instant Finality",
                desc: "Transactions settle in seconds, not minutes.",
              },
              {
                icon: "🔐",
                title: "Proof of Ownership",
                desc: "Verify assets without revealing amounts.",
              },
              {
                icon: "🌐",
                title: "Global Access",
                desc: "No borders, no banks, no permission needed.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-blue-500/30 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* --- CONTENT & FAQ --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Content */}
          <div className="lg:col-span-7 prose prose-invert prose-lg max-w-none">
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Why Privacy Matters
              </h3>
              <p className="text-white/70">
                Most crypto wallets expose every transaction you make. Anyone
                can see how much you have, where you spend it, and who you
                interact with. This isn't just inconvenient, it's dangerous.
              </p>
              {/* Blue accented quote box */}
              <div className="my-8 p-6 bg-linear-to-r from-blue-500/10 to-transparent border-l-4 border-blue-500 rounded-r-xl">
                <p className="text-white font-medium italic m-0">
                  "Financial privacy is a fundamental right. You wouldn't share
                  your bank login with strangers, so why broadcast your crypto
                  history?"
                </p>
              </div>
              <p className="text-white/70">
                With PENXCHAIN Wallet, your financial activity is your business.
                Zero-Knowledge Proofs ensure that while the blockchain verifies
                the math, it never sees your data.
              </p>
            </motion.section>
          </div>

          {/* FAQ Sidebar */}
          <div className="lg:col-span-5">
            <motion.div
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[#0a0f1e]/50 p-6 rounded-3xl border border-white/5 backdrop-blur-md sticky top-24"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Common Questions
              </h3>
              <FaqAccordion />

              {/* Related Links */}
              <div className="mt-8">
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
                  Explore Now
                </h4>
                <div className="space-y-4">
                  <Link
                    href="/blog/penxchain-wallet-features"
                    className="block p-4 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 transition-colors"
                  >
                    <div className="text-blue-400 text-xs font-bold mb-1">
                      PRODUCT
                    </div>
                    <div className="text-white font-medium">
                      PENXCHAIN Wallet Features
                    </div>
                  </Link>
                  <Link
                    href="/blog/zkp-penxchain"
                    className="block p-4 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 transition-colors"
                  >
                    <div className="text-blue-400 text-xs font-bold mb-1">
                      TECH
                    </div>
                    <div className="text-white font-medium">
                      Zero-Knowledge Proofs
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- INTERACTIVE LIKE BUTTON --- */}
        <div className="mt-24 flex justify-center">
          <div className="relative group">
            {/* Active state glow is Red, inactive is faint blue */}
            <div
              className={`absolute inset-0 blur-3xl rounded-full transition-opacity duration-500 ${
                isLiked ? "bg-red-600 opacity-30" : "bg-blue-500 opacity-0"
              }`}
            />

            <button
              onClick={handleLike}
              className={`relative z-10 flex items-center gap-3 px-10 py-4 rounded-full border transition-all duration-300 transform active:scale-95 ${
                isLiked
                  ? "bg-red-500/10 border-red-500 text-red-500" // Liked State: RED
                  : "bg-white/5 border-white/10 text-white/60 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400" // Unliked: Neutral -> Blue Hover
              }`}
            >
              <span className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isLiked ? "scale-110" : ""
                  }`}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
              <span className="font-medium text-lg">
                {mounted && likeCount > 0 ? likeCount : "Like"}
              </span>
            </button>

            {/* Floating Hearts - RED */}
            <AnimatePresence>
              {hearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{
                    opacity: 1,
                    y: 0,
                    x: heart.x,
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: 0,
                    y: -150,
                    x: heart.x + heart.drift,
                    scale: 1,
                    rotate: heart.rotation,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: heart.duration,
                    delay: heart.delay,
                    ease: [0.25, 0.46, 0.45, 0.94], // Mastered Ease Curve
                  }}
                  className="absolute top-0 left-1/2 pointer-events-none z-50 text-red-500"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ width: heart.size, height: heart.size }}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </article>
    </main>
  );
}
