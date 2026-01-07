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

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5 },
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

// --- HELPER FOR SAFE STORAGE ACCESS ---
const getStorageValue = (key: string, defaultValue: string) => {
  if (typeof window === "undefined") return defaultValue;
  return localStorage.getItem(key) || defaultValue;
};

export default function ZeroKnowledgeProofsPage() {
  const postId = "zkp-penxchain";
  const [mounted, setMounted] = useState(false);

  // --- STATE MANAGEMENT (Strict Hydration Fix) ---
  // CRITICAL: We must initialize as FALSE to match the Server.
  // We cannot check localStorage in the initializer or it breaks hydration.
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  // --- HYDRATION & LOGIC ---
  useEffect(() => {
    // This runs ONLY on the client, after the first render.
    // This is safe to read localStorage now.
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
    const count = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: heartIdCounter + i,
        x: Math.random() * 100 - 50,
        size: Math.random() * 10 + 20,
        duration: Math.random() * 0.5 + 1.5,
        delay: i * 0.1,
        rotation: (Math.random() - 0.5) * 60,
        drift: (Math.random() - 0.5) * 30,
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);
    setHeartIdCounter((prev) => prev + count);

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
    <main className="min-h-screen bg-[#050505] text-slate-200 selection:bg-[#0ce50c]/30 selection:text-white">
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0ce50c]/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* --- STICKY GLASS HEADER --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover:border-[#e50c0c]/50 group-hover:bg-[#0ce50c]/10 transition-all duration-300">
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
                className="text-white/70 group-hover:text-[#e50c0c] group-hover:-translate-x-0.5 transition-transform"
              >
                <path d="M19 12H5m7 7-7-7 7-7" />
              </svg>
            </div>
            <span>Back to Blog</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs uppercase tracking-widest text-white/30 font-semibold">
              Share Article
            </span>
            <ShareButtons
              title="Zero-Knowledge Proofs: The Future of Privacy"
              slug="zkp-penxchain"
            />
          </div>
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
              "Zero-Knowledge Proofs Explained: Privacy Technology in Blockchain",
            description:
              "A comprehensive guide to understanding Zero-Knowledge Proofs (ZKPs).",
            image: "https://penxchain.org/blog-images/zkp-in-penxchain.jpg",
            author: { "@type": "Person", name: "Emmanuel Oluwafemi" },
            publisher: {
              "@type": "Organization",
              name: "PENXCHAIN",
              logo: {
                "@type": "ImageObject",
                url: "https://penxchain.org/img/logo.png",
              },
            },
            datePublished: "2024-11-20",
            dateModified: "2024-11-20",
          }),
        }}
      />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* --- HERO SECTION --- */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
            Zero-Knowledge <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-white/50">
              Proofs Explained
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            How to prove the truth without revealing the secret. The technology
            powering the next generation of privacy-first commerce.
          </p>
        </motion.header>

        {/* --- FEATURED IMAGE --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-[#0ce50c]/5 mb-20 group"
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent z-10 opacity-60" />
          <Image
            src="/blog-images/zkp-in-penxchain.jpg"
            alt="Zero-Knowledge Proofs Visualization"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </motion.div>

        {/* --- MAIN CONTENT --- */}
        <div className="prose prose-lg prose-invert max-w-none">
          {/* INTRO */}
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90">
              <span className="text-[#0ce50c] font-semibold">
                Zero-Knowledge Proofs (ZKPs)
              </span>{" "}
              are one of the most important breakthroughs in modern
              cryptography. They allow a user to prove something is true without
              revealing the underlying data.
            </p>
            <div className="my-8 p-6 md:p-8 rounded-2xl bg-white/3 border border-white/10 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#0ce50c]" />
              <h3 className="text-white font-bold text-lg mb-2 mt-0">
                In Simple Terms
              </h3>
              <p className="text-white/70 m-0">
                It's like proving you are old enough to enter a venue without
                handing over your ID card that shows your name, address, and
                exact birth date. You prove the <em>attribute</em> (Age 18+)
                without revealing the <em>data</em>.
              </p>
            </div>
          </motion.section>

          {/* HOW IT WORKS */}
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-[#0ce50c]">01.</span> How It Works
            </h2>
            <p className="text-white/70">
              Traditionally, blockchain transactions expose everything: wallet
              balances, transaction amounts, and sender/receiver details. ZKPs
              solve this by separating <strong>verification</strong> from{" "}
              <strong>exposure</strong>.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8 not-prose">
              <div className="p-6 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5">
                <h4 className="text-[#0ce50c] font-bold text-lg mb-2">
                  The Proof
                </h4>
                <p className="text-sm text-white/60">
                  A cryptographic receipt that demonstrates a statement is
                  valid. It contains no sensitive data, only the mathematical
                  certainty of truth.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5">
                <h4 className="text-blue-400 font-bold text-lg mb-2">
                  The Verifier
                </h4>
                <p className="text-sm text-white/60">
                  An automated system that checks the proof. It confirms
                  validity instantly without ever seeing the user's private
                  secrets.
                </p>
              </div>
            </div>
          </motion.section>

          {/* WHY IT MATTERS (GRID LAYOUT) */}
          <motion.section
            variants={staggerGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-[#0ce50c]">02.</span> Why It Matters
            </h2>
            <p className="text-white/70 mb-8">
              Public blockchains are transparent by design. While this builds
              trust, it kills privacy. Here is why the old model fails for real
              commerce:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
              {[
                {
                  title: "Front-running",
                  desc: "Bad actors exploiting your transaction data before it confirms.",
                },
                {
                  title: "Surveillance",
                  desc: "Competitors analyzing your sales volume and supplier relationships.",
                },
                {
                  title: "Data Leaks",
                  desc: "Every purchase becoming a permanent public record.",
                },
                {
                  title: "Safety Risks",
                  desc: "Exposing your net worth to criminals just by paying for coffee.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariant}
                  className="p-5 rounded-xl bg-white/2 border border-white/5 hover:border-[#0ce50c]/30 hover:bg-white/4 transition-colors group"
                >
                  <h3 className="text-white font-semibold mb-2 group-hover:text-[#0ce50c] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* PENXCHAIN INTEGRATION */}
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-[#0ce50c]">03.</span> The PENXCHAIN Approach
            </h2>
            <p className="text-white/70">
              We don't treat privacy as a feature toggle. It is the
              architecture.
            </p>
            <ul className="space-y-4 mt-6 list-none pl-0">
              {[
                "Private marketplace listings and negotiations.",
                "Confidential merchant analytics encrypted at source.",
                "Privacy-aware identity verification (Age/Location).",
                "Encrypted smart contract logic on Aleo.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#0ce50c]/20 flex items-center justify-center text-[#0ce50c] text-sm">
                    ✓
                  </span>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* FAQ SECTION */}
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="pt-10 border-t border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-10 text-center">
              Common Questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  q: "Is ZKP secure?",
                  a: "Yes. It relies on advanced mathematics used in military and banking security.",
                },
                {
                  q: "Can it be used for illegal activity?",
                  a: "Privacy is not anonymity. PENXCHAIN includes compliance tools for selective disclosure when legally required.",
                },
                {
                  q: "Is it slower?",
                  a: "Historically yes, but modern ZK-SNARKs verify in milliseconds, making them perfect for consumer apps.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="pb-6 border-b border-white/5 last:border-0"
                >
                  <h4 className="text-lg font-medium text-white mb-2">
                    {faq.q}
                  </h4>
                  <p className="text-white/50 text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* --- INTERACTIVE LIKE BUTTON --- */}
        <div className="mt-20 flex justify-center">
          <div className="relative group">
            {/* GREEN GLOW */}
            <div
              className={`absolute inset-0 bg-[#0ce50c] blur-2xl rounded-full transition-opacity duration-500 ${
                isLiked ? "opacity-20" : "opacity-0"
              }`}
            />

            <button
              onClick={handleLike}
              className={`relative z-10 flex items-center gap-3 px-8 py-4 rounded-full border transition-all duration-300 transform active:scale-95 ${
                isLiked
                  ? "bg-[#0ce50c]/10 border-[#0ce50c] text-[#0ce50c]" // Active Green
                  : "bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10 hover:text-white"
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
                    ease: [0.25, 0.46, 0.45, 0.94], // Mastered Ease Curve
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
