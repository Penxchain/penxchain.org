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

const staggerGrid: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const pulseGlow: Variants = {
  hidden: { boxShadow: "0 0 0px rgba(0, 82, 255, 0)" },
  visible: {
    boxShadow: "0 0 20px rgba(0, 82, 255, 0.3)",
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

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
const getStorageValue = (key: string, defaultValue: string): string => {
  if (typeof window === "undefined") return defaultValue;
  return window.localStorage.getItem(key) ?? defaultValue;
};

export default function EcosystemTeaserPage() {
  const postId = "ecosystem-overview-coming-soon";
  const [mounted, setMounted] = useState(false);

  // --- MASTERED STATE MANAGEMENT ---

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

  // Handle Mounting (Prevents Hydration Mismatch)
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
    <main className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-600/30 selection:text-white overflow-hidden relative">
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      {/* --- GLASS HEADER --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/70 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* BACK BUTTON: PREMIUM RED */}
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

          <ShareButtons
            title="PENXCHAIN Ecosystem Overview Coming Soon"
            slug="ecosystem-overview-coming-soon"
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
            headline:
              "PENXCHAIN Ecosystem Overview Coming Soon: The Future of Privacy-Powered Commerce",
            description: "Stay tuned for PENXCHAIN's full ecosystem overview.",
            image: "https://penxchain.org/blog-images/ecosystem-teaser.jpg",
            author: { "@type": "Person", name: "PENXCHAIN Team" },
            publisher: {
              "@type": "Organization",
              name: "PENXCHAIN",
              logo: {
                "@type": "ImageObject",
                url: "https://penxchain.org/img/logo.png",
              },
            },
            datePublished: "2024-12-20",
            dateModified: "2024-12-20",
          }),
        }}
      />

      <article className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* --- HERO SECTION --- */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <motion.div
            variants={pulseGlow}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Coming Soon
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
            The Full Ecosystem <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 via-blue-400 to-indigo-500">
              Overview is Almost Here.
            </span>
          </h1>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
              We're revealing everything.
            </p>
            <p className="text-lg text-white/60 leading-relaxed">
              In the coming days, we will release the blueprint for private,
              scalable commerce. This is the deep dive into how we're building
              what many considered impossible.
            </p>
          </div>
        </motion.header>

        {/* --- CINEMATIC IMAGE --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-21/9 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20 mb-24 group"
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent z-10 opacity-40" />
          <Image
            src="/blog-images/ecosystem-teaser.jpg"
            alt="PENXCHAIN Ecosystem Teaser"
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            priority
          />
        </motion.div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT: Main Text */}
          <div className="lg:col-span-8">
            {/* What to Expect */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                What to Expect
              </h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                This overview will help users, communities, and brands
                understand why we chose the hybrid possibilities of Base and
                Aleo—and how this architecture enables capabilities that
                single-chain solutions cannot deliver.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Product Architecture",
                    desc: "How Wallet, Pay, and Marketplace unify into one system.",
                  },
                  {
                    title: "Hybrid Infrastructure",
                    desc: "Connecting Aleo's privacy with Base's liquidity.",
                  },
                  {
                    title: "Privacy Technology",
                    desc: "Deep dive into ZK proofs protecting merchant data.",
                  },
                  {
                    title: "Token Economics",
                    desc: "The role of $PENX, distribution, and value capture.",
                  },
                  {
                    title: "Market Positioning",
                    desc: "Why we capture the market others cannot serve.",
                  },
                  {
                    title: "Roadmap & Vision",
                    desc: "The strategic path to scaling globally.",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-blue-500/30 transition-colors"
                  >
                    <h3 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Why Hybrid */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Hybrid Was Necessary
              </h2>
              <div className="prose prose-invert prose-lg text-white/70">
                <p>
                  Many teams have attempted to build privacy-first commerce.
                  Most failed because they chose a single chain and forced it to
                  do everything—sacrificing either privacy, liquidity,
                  usability, or scalability.
                </p>
                <p>
                  PENXCHAIN recognized early that no single blockchain could
                  deliver everything. The hybrid model solves this:{" "}
                  <strong className="text-white">Aleo</strong> for privacy,{" "}
                  <strong className="text-white">Base</strong> for liquidity.
                  Together, they enable what neither can achieve alone.
                </p>
              </div>
            </motion.section>

            {/* Giants */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Building on Giants
              </h2>
              <div className="p-8 rounded-3xl bg-linear-to-br from-blue-900/20 to-transparent border border-blue-500/20">
                <p className="text-white/80 mb-6">
                  <strong className="text-blue-400">
                    Thank you to Jesse Pollak and the Base team
                  </strong>{" "}
                  for building a Layer 2 that prioritizes real-world adoption.
                </p>
                <p className="text-white/80 m-0">
                  <strong className="text-blue-400">
                    Thank you to Howard Wu and the Aleo team
                  </strong>{" "}
                  for pioneering zero-knowledge technology that makes privacy
                  practical at scale.
                </p>
              </div>
            </motion.section>
          </div>

          {/* RIGHT: Sidebar / CTA */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              variants={staggerGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="sticky top-24"
            >
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Be the First
                </h3>
                <p className="text-white/50 text-sm mb-6">
                  The overview drops soon. Don't miss the notification.
                </p>

                <div className="space-y-3">
                  <a
                    href="https://twitter.com/PENXCHAIN_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors text-sm"
                  >
                    Follow on Twitter
                  </a>
                  <a
                    href="https://t.me/Officialpenxchain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors text-sm"
                  >
                    Join Telegram
                  </a>
                </div>
              </div>

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
                    <div className="text-white font-medium">
                      PENXCHAIN Wallet
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
            {/* LIKE BUTTON GLOW - RED */}
            <div
              className={`absolute inset-0 bg-red-600 blur-3xl rounded-full transition-opacity duration-500 ${
                isLiked ? "opacity-30" : "opacity-0"
              }`}
            />

            <button
              onClick={handleLike}
              className={`relative z-10 flex items-center gap-3 px-10 py-4 rounded-full border transition-all duration-300 transform active:scale-95 ${
                isLiked
                  ? "bg-red-500/10 border-red-500 text-red-500"
                  : "bg-white/5 border-white/10 text-white/60 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
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
                    ease: [0.25, 0.46, 0.45, 0.94], // Use the "mastered" ease curve
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
