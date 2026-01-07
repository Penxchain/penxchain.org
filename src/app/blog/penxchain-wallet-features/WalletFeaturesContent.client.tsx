"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ShareButtons from "@/components/ShareButtons";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

export default function WalletFeaturesPage() {
  const postId = "penxchain-wallet-features";

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  useEffect(() => {
    const liked = localStorage.getItem(`blog_liked_${postId}`);
    const count = localStorage.getItem(`blog_likes_${postId}`);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (liked) setIsLiked(liked === "true");
    if (count) setLikeCount(parseInt(count, 10));
     
  }, []);

  const createHearts = () => {
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
  };

  const handleLike = (): void => {
    const newLikedState = !isLiked;
    const newCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);

    setIsLiked(newLikedState);
    setLikeCount(newCount);

    localStorage.setItem(`blog_liked_${postId}`, String(newLikedState));
    localStorage.setItem(`blog_likes_${postId}`, String(newCount));

    if (newLikedState) {
      createHearts();
    }
  };

  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Staking",
      description:
        "Stake assets directly from the wallet to earn rewards. No third-party platforms. No giving up control.",
      highlight: "Your assets stay yours.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      title: "Swaps",
      description:
        "Swap supported assets inside the wallet with a smooth, built-in experience.",
      highlight: "No jumping between apps. No unnecessary friction.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: "Private Transaction History",
      description:
        "Unlike most wallets, PENXCHAIN doesn't make your activity public by default.",
      highlight: "Your transaction history is encrypted, visible only to you.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ),
      title: "Balance Obfuscation",
      description:
        "Need to prove you have funds without showing exact amounts?",
      highlight:
        "PENXCHAIN uses zero-knowledge proofs to confirm solvency without revealing balances.",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black text-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Back Button */}
          <Link
            href="/blog"
            className="group flex items-center gap-2 px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-300"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Blog</span>
          </Link>

          {/* Share Button */}
          <div className="flex items-center gap-3">
            <ShareButtons
              title="PENXCHAIN Wallet Features: Privacy-First Financial Tool"
              excerpt="Staking, swaps, private transactions, and balance obfuscation—all in one wallet. Simple on the surface. Powerful underneath."
              slug="penxchain-wallet-features"
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12"
      >
        <div className="text-center space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Wallet Features
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-linear-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              PENXCHAIN Wallet
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Built for people who want to use crypto without exposing their
            entire financial life.
          </p>

          {/* Tagline */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-lg">
            <span className="text-green-400 font-semibold">
              Simple on the surface.
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="text-blue-400 font-semibold">
              Powerful underneath.
            </span>
          </div>
        </div>

        {/* Hero Image with Parallax Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-linear-to-r from-green-500/20 to-blue-500/20 blur-3xl -z-10" />
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/blog-images/penxchain-wallet-features.jpg"
              alt="PENXCHAIN Wallet Features - Privacy-first financial tool"
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl bg-linear-to-br from-white/5 to-white/2 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10">
                {/* Gradient Accent */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl bg-linear-to-br ${feature.color} p-0.5`}
                  >
                    <div className="w-full h-full rounded-xl bg-black flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Highlight */}
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-green-400 font-medium italic">
                      {feature.highlight}
                    </p>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-linear-to-br from-green-500/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="relative p-12 rounded-3xl bg-linear-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 border border-white/10">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-green-500/20 to-blue-500/20 blur-3xl -z-10" />

          <div className="relative text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              More Than Just Storage
            </h2>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              Together, these features make the PENXCHAIN Wallet more than
              storage. It&apos;s a privacy-first financial tool, designed for
              real-world use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/downloads"
                className="group px-8 py-4 rounded-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Try the Wallet
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/blog"
                className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold transition-all duration-300"
              >
                Read More Posts
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Like Section */}
      <section className="max-w-md mx-auto px-4 pb-20 relative">
        <div className="flex items-center justify-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={handleLike}
            className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              isLiked
                ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                : "bg-white/5 border-2 border-white/10 text-white/70 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10"
            }`}
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isLiked ? "scale-110" : "group-hover:scale-110"
              }`}
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {likeCount > 0 && (
              <span className="text-sm font-bold">{likeCount}</span>
            )}
          </button>
          <span className="text-white/60">
            {isLiked ? "You liked this" : "Like this post"}
          </span>
        </div>

        {/* Falling Hearts Animation */}
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, y: 0, x: heart.x, scale: 0, rotate: 0 }}
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
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute top-1/2 left-1/2 pointer-events-none z-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="#ff6b6b"
                style={{
                  width: `${heart.size}px`,
                  height: `${heart.size}px`,
                  filter: "drop-shadow(0 2px 4px rgba(255, 107, 107, 0.3))",
                }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>
    </main>
  );
}
