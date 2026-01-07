
"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import ShareButtons from "@/components/ShareButtons";

// Optimized animation variants
const fadeInSlideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
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

// Safe localStorage access helper
const getStorageValue = (key: string, defaultValue: string): string => {
  if (typeof window === "undefined") return defaultValue;
  return window.localStorage.getItem(key) ?? defaultValue;
};

export default function WhyPenxchainContent() {
  const postId = "why-penxchain-exists";
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
    <main className="min-h-screen bg-linear-to-br from-[#0a0e27] to-[#1a1f3a] text-white/90 py-12 md:py-20 px-4 overflow-hidden relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.6; transform: translateX(-50%) scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 1.2s ease-in-out;
        }
      `,
        }}
      />

      {/* Animated background effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-gradient-radial from-[#0ce50c]/8 to-transparent pointer-events-none animate-pulse-slow" />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto mb-12 flex justify-between items-center relative z-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2.5 text-white/60 no-underline font-medium px-3.5 py-2 rounded-lg transition-all duration-250 relative border border-transparent hover:text-[#c94a4a] hover:bg-[#c94a4a]/8 hover:backdrop-blur-md hover:border-[#c94a4a]/25 hover:-translate-x-1"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="transition-transform duration-250"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <ShareButtons
          title="Why PENXCHAIN Exists: Fixing What's Broken in Blockchain"
          slug="why-penxchain-exists"
        />
      </nav>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline:
              "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
            image: "https://penxchain.org/blog-images/why-penxchain-exists.jpg",
            author: { "@type": "Person", name: "Emmanuel Oluwafemi" },
            publisher: {
              "@type": "Organization",
              name: "PENXCHAIN",
              logo: {
                "@type": "ImageObject",
                url: "https://penxchain.org/logo.png",
              },
            },
            datePublished: "2024-11-28",
          }),
        }}
      />

      <article className="relative z-10">
        {/* HERO SECTION */}
        <motion.section
          className="max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInSlideUp}
        >
          <div className="space-y-6">
            <motion.div variants={fadeInSlideUp}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0ce50c]/10 border border-[#0ce50c]/30 rounded-full text-[#0ce50c] text-sm font-semibold mb-8 backdrop-blur-md">
                💡 Purpose & Vision
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-black mb-6 bg-linear-to-r from-white via-white to-[#0ce50c] bg-clip-text text-transparent leading-tight"
              variants={fadeInSlideUp}
            >
              Why PENXCHAIN Exists
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/75 leading-relaxed"
              variants={fadeInSlideUp}
            >
              Blockchain promised{" "}
              <strong className="text-white/95">freedom</strong>,{" "}
              <strong className="text-white/95">transparency</strong>, and{" "}
              <strong className="text-white/95">global access</strong>.
            </motion.p>

            <motion.p
              className="text-lg md:text-xl text-white/75 leading-relaxed"
              variants={fadeInSlideUp}
            >
              But for most people, the experience today is{" "}
              <strong className="text-white/95">fragmented</strong>,{" "}
              <strong className="text-white/95">exposed</strong>, and{" "}
              <strong className="text-white/95">difficult to use</strong>.
            </motion.p>

            <motion.p
              className="text-lg md:text-xl text-white/95 font-semibold"
              variants={fadeInSlideUp}
            >
              PENXCHAIN exists to fix that.
            </motion.p>
          </div>
        </motion.section>

        {/* PROBLEM #1 */}
        <motion.section
          className="max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInSlideUp}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white/95 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#0ce50c] after:to-transparent after:rounded-full">
            Problem #1: Fragmented User Experiences
          </h2>

          <div className="space-y-5 text-base md:text-lg text-white/70 leading-relaxed">
            <p>
              Users are forced to juggle multiple apps: wallets, bridges,
              marketplaces, payment tools. Each with different rules, risks, and
              learning curves.
            </p>

            <p className="text-white/95 font-semibold">
              This complexity blocks real adoption.
            </p>

            <p>
              Merchants face the same issue. Selling online often means relying
              on multiple platforms, paying high fees, and losing control over
              customer data.
            </p>

            <p>
              There is no unified, user-first commerce infrastructure that just
              works.
            </p>
          </div>

          <div className="mt-8 p-6 md:p-8 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm">
            <p className="text-base md:text-lg font-medium text-white/85 m-0">
              <strong className="text-white/95">The result?</strong> Users give
              up. Merchants stick with traditional payment processors. And
              blockchain remains trapped in its own bubble.
            </p>
          </div>
        </motion.section>

        {/* PROBLEM #2 WITH IMAGE */}
        <motion.section
          className="max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 text-white/95 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#0ce50c] after:to-transparent after:rounded-full"
            variants={fadeInSlideUp}
          >
            Problem #2: Lack of Privacy by Default
          </motion.h2>

          <motion.div
            className="space-y-5 text-base md:text-lg text-white/70 leading-relaxed mb-10"
            variants={fadeInSlideUp}
          >
            <p>
              Most blockchains expose wallet activity, transaction history,
              spending patterns, and business data to the public.
            </p>

            <p className="text-white/95 font-semibold">
              This level of transparency is not sustainable for everyday users
              or real commerce.
            </p>

            <p>
              Privacy should not be a premium feature or an optional add-on. It
              should be built into the system from the start.
            </p>

            <p className="text-white/95 font-semibold">
              PENXCHAIN was designed with privacy as the foundation, not an
              afterthought.
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-600 hover:scale-105"
            variants={scaleIn}
            role="button"
            tabIndex={0}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              const el = e.currentTarget;
              el.classList.add("animate-bounce-subtle");
              setTimeout(
                () => el.classList.remove("animate-bounce-subtle"),
                1200
              );
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                const el = e.currentTarget;
                el.classList.add("animate-bounce-subtle");
                setTimeout(
                  () => el.classList.remove("animate-bounce-subtle"),
                  1200
                );
              }
            }}
          >
            <Image
              src="/blog-images/why-penxchain-exists.jpg"
              alt="Why PENXCHAIN exists - fixing blockchain problems"
              width={800}
              height={533}
              priority
              className="w-full h-auto"
            />
          </motion.div>

          <motion.div
            className="p-6 md:p-8 bg-linear-to-br from-[#0ce50c]/8 to-[#0ce50c]/3 border-l-4 border-[#0ce50c] rounded-2xl backdrop-blur-sm"
            variants={fadeInSlideUp}
          >
            <p className="text-base md:text-lg text-white/85 leading-relaxed m-0">
              When your financial activity is public, you become a target.
              Surveillance, profiling, and exploitation are not hypothetical
              risks. They are the reality of transparent blockchains today.
            </p>
          </motion.div>
        </motion.section>

        {/* PROBLEM #3 */}
        <motion.section
          className="max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 text-white/95 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#0ce50c] after:to-transparent after:rounded-full"
            variants={fadeInSlideUp}
          >
            Problem #3: Emerging Markets Are Underserved
          </motion.h2>

          <motion.div
            className="space-y-5 text-base md:text-lg text-white/70 leading-relaxed mb-8"
            variants={fadeInSlideUp}
          >
            <p className="text-white/95 font-semibold">Especially Africa.</p>

            <p>
              Millions of users and merchants face systemic challenges that
              blockchain could solve, but most projects ignore them entirely:
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-6 mb-8"
            variants={staggerContainer}
          >
            {[
              {
                title: "Limited Access",
                desc: "Many people lack access to reliable banking and financial tools",
              },
              {
                title: "High Costs",
                desc: "Remittances and cross-border payments drain wealth through excessive fees",
              },
              {
                title: "Platform Dependency",
                desc: "Small businesses rely on extractive platforms that control their data and profits",
              },
              {
                title: "Weak Protection",
                desc: "Data protection is often minimal, leaving users and merchants vulnerable",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="p-6 bg-white/2 border border-white/5 rounded-2xl transition-all duration-400 hover:bg-white/4 hover:border-[#0ce50c]/30 hover:-translate-y-1 hover:shadow-xl"
                variants={fadeInSlideUp}
              >
                <h3 className="text-lg font-bold text-[#0ce50c] mb-3 mt-0">
                  {item.title}
                </h3>
                <p className="text-white/65 leading-relaxed m-0">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="space-y-5 text-base md:text-lg text-white/70 leading-relaxed"
            variants={fadeInSlideUp}
          >
            <p>
              Yet these markets are{" "}
              <strong className="text-white/95">mobile-first</strong>,{" "}
              <strong className="text-white/95">digital-native</strong>, and{" "}
              <strong className="text-white/95">ready to scale</strong>.
            </p>

            <p className="text-white/95 font-semibold">
              PENXCHAIN sees Africa not as an afterthought, but as a starting
              point.
            </p>

            <p>
              By building private, accessible, and low-friction commerce
              infrastructure, the ecosystem supports real economic activity, not
              just speculation.
            </p>
          </motion.div>
        </motion.section>

        {/* THE SOLUTION */}
        <motion.section
          className="max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInSlideUp}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white/95 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#0ce50c] after:to-transparent after:rounded-full">
            The PENXCHAIN Solution
          </h2>

          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-10">
            By combining a privacy-aware wallet with fully private e-commerce
            and payments infrastructure, PENXCHAIN creates a unified experience
            for users and merchants.
          </p>

          <div className="p-8 md:p-10 bg-linear-to-br from-[#0ce50c]/10 via-[#0052ff]/10 to-[#0ce50c]/5 border border-[#0ce50c]/30 rounded-3xl backdrop-blur-md space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white/95 mb-3 mt-0">
                No Fragmentation
              </h3>
              <p className="text-base md:text-lg text-white/75 leading-relaxed">
                One wallet. One marketplace. One seamless system. No need to
                juggle multiple apps or learn different interfaces.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white/95 mb-3">
                No Data Exposure
              </h3>
              <p className="text-base md:text-lg text-white/75 leading-relaxed">
                Privacy is default. Your transactions, balances, and activity
                remain confidential. Only you control who sees what.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white/95 mb-3">
                No Unnecessary Intermediaries
              </h3>
              <p className="text-base md:text-lg text-white/75 leading-relaxed mb-0">
                Direct peer-to-peer commerce. Lower fees. Faster settlements.
                Real ownership.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-5 text-base md:text-lg text-white/70 leading-relaxed">
            <p className="text-white/95 font-semibold">
              PENXCHAIN exists to return control where it belongs:
            </p>

            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="text-[#0ce50c] text-xl">→</span>
                <strong className="text-white/90">Users own their data</strong>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#0ce50c] text-xl">→</span>
                <strong className="text-white/90">
                  Merchants own their business
                </strong>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#0ce50c] text-xl">→</span>
                <strong className="text-white/90">
                  Communities build their own economies
                </strong>
              </li>
            </ul>

            <p>All without sacrificing usability or liquidity.</p>
          </div>
        </motion.section>

        {/* WHAT MAKES THIS DIFFERENT */}
        <motion.section
          className="max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInSlideUp}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white/95 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-linear-to-r after:from-[#0ce50c] after:to-transparent after:rounded-full">
            What Makes This Different?
          </h2>

          <div className="space-y-5 text-base md:text-lg text-white/70 leading-relaxed">
            <p>
              Many projects talk about privacy. Few actually build it as the
              foundation.
            </p>

            <p>
              Many projects talk about emerging markets. Most ignore them after
              the marketing campaign ends.
            </p>

            <p>
              Many projects talk about user experience. But they still make
              people use five different apps to do one simple thing.
            </p>

            <p className="text-white/95 font-semibold">
              PENXCHAIN is different because it is deliberate:
            </p>

            <ul className="space-y-4 list-none pl-0 mt-6">
              <li className="flex items-start gap-3 text-white/75">
                <span className="text-[#0ce50c] text-xl shrink-0">✓</span>
                <span>
                  Privacy is not optional. It is built into every transaction,
                  every payment, every interaction.
                </span>
              </li>
              <li className="flex items-start gap-3 text-white/75">
                <span className="text-[#0ce50c] text-xl shrink-0">✓</span>
                <span>
                  Emerging markets are not an afterthought. They are the testing
                  ground for real-world usability.
                </span>
              </li>
              <li className="flex items-start gap-3 text-white/75">
                <span className="text-[#0ce50c] text-xl shrink-0">✓</span>
                <span>
                  Simplicity is not sacrificed for features. The system works
                  for people who just want to pay for something or sell
                  something without needing a computer science degree.
                </span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* IN SHORT */}
        <motion.section
          className="max-w-5xl mx-auto mb-20 p-8 md:p-12 bg-[#0ce50c]/5 border-2 border-[#0ce50c]/20 rounded-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInSlideUp}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white/95 mb-10 mt-0 leading-tight">
            In Short, PENXCHAIN Exists Because the Next Phase of Blockchain Must
            Be:
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              {
                title: "Usable",
                desc: "Simple enough for anyone to use without friction",
              },
              {
                title: "Private",
                desc: "Protecting users by default, not as an afterthought",
              },
              {
                title: "Inclusive",
                desc: "Built for everyone, especially underserved communities",
              },
              {
                title: "Commerce-Ready",
                desc: "Designed for real transactions, not just speculation",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="text-xl md:text-2xl font-bold text-[#0ce50c] mb-3">
                  {item.title}
                </h3>
                <p className="text-white/75 leading-relaxed m-0">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* FINAL MESSAGE */}
        <motion.section
          className="max-w-4xl mx-auto mb-16 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInSlideUp}
        >
          <p className="text-lg md:text-2xl text-white/85 leading-relaxed">
            That is the foundation of a truly global, privacy-powered digital
            economy.
          </p>

          <p className="text-lg md:text-2xl font-semibold text-white/95 leading-relaxed">
            PENXCHAIN exists because someone had to build it. And we are.
          </p>
        </motion.section>

        {/* --- INTERACTIVE LIKE BUTTON --- */}
        <div className="flex justify-center mb-16">
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
