/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
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

export default function PenxTokenUtilityContent() {
  const postId = "penx-token-utility";
  const postTitle = "$PENX Token Utility: The Economic Backbone of PENXCHAIN";
  const postSlug = "penx-token-utility";

  const [mounted, setMounted] = useState(false);

  // --- STATE MANAGEMENT (Strict Hydration Fix) ---
  // 1. Initialize to FALSE/0 to match Server Side Rendering
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  // 2. Sync with LocalStorage ONLY after mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedLiked =
      getStorageValue(`blog_liked_${postId}`, "false") === "true";
    const savedCount = parseInt(
      getStorageValue(`blog_likes_${postId}`, "0"),
      10
    );

    if (savedLiked) setIsLiked(true);
    if (savedCount > 0) setLikeCount(savedCount);
  }, [postId]);

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
    <main className="min-h-screen bg-[#020617] text-slate-200 selection:bg-[#0ce50c]/30 selection:text-white overflow-hidden relative">
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-200 h-200 bg-[#0ce50c]/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      </div>

      {/* --- STICKY NAV --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-red-400 transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all duration-300">
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

          <ShareButtons title={postTitle} slug={postSlug} />
        </div>
      </nav>

      {/* --- JSON-LD --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "$PENX Token Utility: The Economic Backbone of PENXCHAIN",
            image: "https://penxchain.org/blog-images/penx-token-utility.jpg",
            author: { "@type": "Person", name: "Emmanuel Oluwafemi" },
            publisher: {
              "@type": "Organization",
              name: "PENXCHAIN",
              logo: {
                "@type": "ImageObject",
                url: "https://penxchain.org/logo.png",
              },
            },
            datePublished: "2024-12-16",
          }),
        }}
      />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* --- HERO SECTION --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
            $PENX Token Utility
          </h1>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
              What role does $PENX play in the ecosystem?
            </p>
            <p className="text-lg text-white/60 leading-relaxed">
              $PENX is the <strong>economic backbone of PENXCHAIN</strong>,
              designed to power privacy-first commerce, governance, and
              incentives.
            </p>
          </div>

          <div className="mt-8 p-6 bg-white/5 border-l-4 border-[#0ce50c] rounded-r-xl text-white/80 text-left md:text-center shadow-lg backdrop-blur-sm">
            $PENX is not just a token. It's how users participate, merchants
            grow, and governance stays community-driven.
          </div>
        </motion.section>

        {/* --- FEATURED IMAGE --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#0ce50c]/5 mb-20 group"
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent z-10 opacity-40" />
          <Image
            src="/blog-images/penx-token-utility.jpg"
            alt="$PENX Token Utility"
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            priority
          />
        </motion.div>

        {/* --- CORE UTILITIES --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
          >
            Core Utilities of $PENX
          </motion.h2>

          <div className="space-y-8">
            {/* STAKING CARD (Green) */}
            <motion.div
              variants={fadeInUp}
              className="p-8 md:p-10 rounded-2xl bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/30 backdrop-blur-sm transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                  🔒
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-green-400">
                  Staking
                </h3>
              </div>
              <p className="text-lg text-white/80 mb-6">
                $PENX holders can stake their tokens to participate in securing
                the network and earning rewards.
              </p>
              <div className="bg-[#020617]/40 rounded-xl p-6 border border-white/5">
                <p className="font-semibold text-white mb-4">
                  Staking Benefits:
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500">✓</span>{" "}
                    <span>
                      <strong>Earn protocol rewards</strong> – Get rewarded for
                      supporting the ecosystem
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500">✓</span>{" "}
                    <span>
                      <strong>Support network security</strong> – Help maintain
                      a robust infrastructure
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500">✓</span>{" "}
                    <span>
                      <strong>Align long-term incentives</strong> – Benefit from
                      ecosystem growth
                    </span>
                  </li>
                </ul>
              </div>
              <p className="mt-6 text-white/60 italic">
                Staking encourages <strong>commitment, not speculation</strong>.
              </p>
            </motion.div>

            {/* GOVERNANCE CARD (Blue) */}
            <motion.div
              variants={fadeInUp}
              className="p-8 md:p-10 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 backdrop-blur-sm transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                  🗳️
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-blue-400">
                  Governance (PENXDAO)
                </h3>
              </div>
              <p className="text-lg text-white/80 mb-6">
                $PENX gives holders <strong>direct influence</strong> over the
                ecosystem's future direction.
              </p>
              <div className="bg-[#020617]/40 rounded-xl p-6 border border-white/5">
                <p className="font-semibold text-white mb-4">
                  Token holders can vote on:
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500">✓</span>{" "}
                    <span>
                      <strong>Protocol upgrades</strong> – Shape technical
                      improvements
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500">✓</span>{" "}
                    <span>
                      <strong>Marketplace rules</strong> – Define commerce
                      standards
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500">✓</span>{" "}
                    <span>
                      <strong>Treasury allocation</strong> – Decide how funds
                      are used
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500">✓</span>{" "}
                    <span>
                      <strong>Ecosystem grants</strong> – Support community
                      initiatives
                    </span>
                  </li>
                </ul>
              </div>
              <p className="mt-6 text-white/60 italic">
                Governance can be public or{" "}
                <strong>privacy-preserving using zero-knowledge proofs</strong>.
              </p>
            </motion.div>

            {/* FEES CARD (Orange) */}
            <motion.div
              variants={fadeInUp}
              className="p-8 md:p-10 rounded-2xl bg-linear-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 backdrop-blur-sm transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl">
                  💳
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-orange-400">
                  Fees & Payments
                </h3>
              </div>
              <p className="text-lg text-white/80 mb-6">
                $PENX is the primary payment method across PENXCHAIN services.
              </p>
              <div className="bg-[#020617]/40 rounded-xl p-6 border border-white/5">
                <p className="font-semibold text-white mb-4">
                  $PENX is used for:
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500">✓</span>{" "}
                    <span>
                      <strong>Wallet services</strong> – Access advanced
                      features
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500">✓</span>{" "}
                    <span>
                      <strong>Marketplace transactions</strong> – Buy and sell
                      with lower fees
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500">✓</span>{" "}
                    <span>
                      <strong>PENXPAY settlement fees</strong> – Fast, private
                      payments
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-orange-300 text-sm font-semibold m-0">
                  💡 Pro Tip: Using $PENX unlocks{" "}
                  <strong>lower fees across the entire ecosystem</strong>.
                </p>
              </div>
            </motion.div>

            {/* LIQUIDITY CARD (Indigo) */}
            <motion.div
              variants={fadeInUp}
              className="p-8 md:p-10 rounded-2xl bg-linear-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/30 backdrop-blur-sm transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl">
                  💧
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-indigo-400">
                  Liquidity & LP Rewards
                </h3>
              </div>
              <p className="text-lg text-white/80 mb-6">
                Liquidity providers earn rewards by supporting healthy markets
                for $PENX.
              </p>
              <div className="bg-[#020617]/40 rounded-xl p-6 border border-white/5">
                <p className="font-semibold text-white mb-4">This ensures:</p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-500">✓</span>{" "}
                    <span>
                      <strong>Deep liquidity</strong> – Easy to buy and sell
                      without slippage
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-500">✓</span>{" "}
                    <span>
                      <strong>Price stability</strong> – Reduced volatility for
                      everyday use
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-500">✓</span>{" "}
                    <span>
                      <strong>Smooth trading experience</strong> – Fast
                      execution at fair prices
                    </span>
                  </li>
                </ul>
              </div>
              <p className="mt-6 text-white/60 italic">
                Liquidity providers are the backbone of a healthy token economy.
              </p>
            </motion.div>

            {/* MARKETPLACE CARD (Pink) */}
            <motion.div
              variants={fadeInUp}
              className="p-8 md:p-10 rounded-2xl bg-linear-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/30 backdrop-blur-sm transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center text-2xl">
                  🏪
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-pink-400">
                  Marketplace & Merchant Perks
                </h3>
              </div>
              <p className="text-lg text-white/80 mb-6">
                Holding or using $PENX unlocks exclusive benefits for merchants
                and active users.
              </p>
              <div className="bg-[#020617]/40 rounded-xl p-6 border border-white/5">
                <p className="font-semibold text-white mb-4">
                  Benefits include:
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-pink-500">✓</span>{" "}
                    <span>
                      <strong>Reduced merchant fees</strong> – Keep more of your
                      revenue
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-500">✓</span>{" "}
                    <span>
                      <strong>Access to premium tools</strong> – Advanced
                      analytics and features
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-500">✓</span>{" "}
                    <span>
                      <strong>Subscription discounts</strong> – Lower costs for
                      recurring services
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-500">✓</span>{" "}
                    <span>
                      <strong>Priority features</strong> – Early access to new
                      releases
                    </span>
                  </li>
                </ul>
              </div>
              <p className="mt-6 text-white/60 italic">
                For merchants building on PENXCHAIN, $PENX is the key to{" "}
                <strong>lower costs and better tools</strong>.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* --- PRIVATE COMMERCE SECTION --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Private Commerce with pPENX
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-10">
            Inside <strong>Aleo</strong>, the wrapped version{" "}
            <strong>pPENX</strong> enables fully private commerce.
          </p>

          <div className="p-8 rounded-2xl bg-[#0ce50c]/5 border border-[#0ce50c]/20 text-left max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-[#0ce50c] mb-4">
              What is pPENX?
            </h3>
            <p className="text-white/80 mb-4">
              pPENX is a privacy-wrapped version of $PENX that operates on the
              Aleo blockchain using zero-knowledge proofs.
            </p>
            <p className="text-white/80 mb-4">
              When you use pPENX, your transactions are completely confidential.
              Nobody can see:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ce50c]"></span>{" "}
                How much you paid
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ce50c]"></span>{" "}
                Who you paid
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ce50c]"></span>{" "}
                What you bought
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ce50c]"></span>{" "}
                Your wallet balance
              </li>
            </ul>
            <p className="mt-6 text-white/90 font-medium">
              This makes pPENX ideal for{" "}
              <strong>private marketplace purchases</strong>,{" "}
              <strong>confidential payments</strong>, and{" "}
              <strong>business transactions</strong> that require discretion.
            </p>
          </div>
        </motion.section>

        {/* --- SUMMARY GRID --- */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="p-8 md:p-12 rounded-3xl bg-linear-to-br from-white/5 to-transparent border border-white/10 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            $PENX: More Than Just a Token
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            $PENX is not just a speculative asset. It is the economic engine
            that powers the entire PENXCHAIN ecosystem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
              <p className="font-bold text-white mb-2">🙋 For Users</p>
              <p className="text-sm text-white/60">
                Participate in governance and earn rewards
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
              <p className="font-bold text-white mb-2">🏪 For Merchants</p>
              <p className="text-sm text-white/60">
                Grow businesses with lower fees and better tools
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
              <p className="font-bold text-white mb-2">🤝 For the Community</p>
              <p className="text-sm text-white/60">
                Keep governance decentralized and community-driven
              </p>
            </div>
          </div>

          <p className="mt-10 font-bold text-white text-lg">
            It's how the ecosystem stays{" "}
            <span className="text-[#0ce50c]">sustainable</span>,{" "}
            <span className="text-blue-400">user-focused</span>, and{" "}
            <span className="text-purple-400">privacy-first</span>.
          </p>
        </motion.section>
        {/* Related Links */}
        <div className="mt-8">
          <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
            Explore Now
          </h4>
          <div className="space-y-4">
            <Link
              href="/blog/penxchain-wallet-overview"
              className="block p-4 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 transition-colors"
            >
              <div className="text-blue-400 text-xs font-bold mb-1">
                PRODUCT
              </div>
              <div className="text-white font-medium">PENXCHAIN Wallet</div>
            </Link>
            <Link
              href="/blog/zkp-penxchain"
              className="block p-4 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 transition-colors"
            >
              <div className="text-blue-400 text-xs font-bold mb-1">TECH</div>
              <div className="text-white font-medium">
                Zero-Knowledge Proofs
              </div>
            </Link>
          </div>
        </div>
        {/* --- LIKE BUTTON --- */}
        <div className="mt-24 flex justify-center">
          <div className="relative group">
            {/* LIKE BUTTON GLOW - GREEN */}
            <div
              className={`absolute inset-0 bg-[#0ce50c] blur-3xl rounded-full transition-opacity duration-500 ${
                isLiked ? "opacity-30" : "opacity-0"
              }`}
            />

            <button
              onClick={handleLike}
              className={`relative z-10 flex items-center gap-3 px-10 py-4 rounded-full border transition-all duration-300 transform active:scale-95 ${
                isLiked
                  ? "bg-[#0ce50c]/10 border-[#0ce50c] text-[#0ce50c]"
                  : "bg-white/5 border-white/10 text-white/60 hover:border-[#0ce50c]/30 hover:bg-[#0ce50c]/10 hover:text-white"
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

            {/* Floating Hearts - GREEN */}
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
                    ease: [0.25, 0.46, 0.45, 0.94], // Use the "mastered" ease curve
                  }}
                  className="absolute top-0 left-1/2 pointer-events-none z-50 text-[#0ce50c]"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(12, 229, 12, 0.3))",
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
