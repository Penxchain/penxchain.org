/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import FaqAccordion from "./FaqAccordion";

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
    transition: { staggerChildren: 0.2 },
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

export default function WhatIsPenxchainPage() {
  const postId = 1;

  // Initialize states from localStorage using lazy initialization
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`blog_liked_${postId}`) === "true";
    }
    return false;
  });

  const [likeCount, setLikeCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const count = localStorage.getItem(`blog_likes_${postId}`);
      return count ? parseInt(count, 10) : 0;
    }
    return 0;
  });

  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  const handleLike = (): void => {
    const newLikedState = !isLiked;
    const newCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);

    setIsLiked(newLikedState);
    setLikeCount(newCount);

    localStorage.setItem(`blog_liked_${postId}`, String(newLikedState));
    localStorage.setItem(`blog_likes_${postId}`, String(newCount));

    // Trigger heart animation when liking
    if (newLikedState) {
      createHearts();
    }
  };

  const createHearts = () => {
    const newHearts: Heart[] = [];
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 hearts

    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: heartIdCounter + i,
        x: Math.random() * 100 - 50, // -50 to 50
        size: Math.random() * 10 + 20, // 20-30px
        duration: Math.random() * 0.5 + 1.5, // 1.5-2s
        delay: i * 0.1, // Stagger the hearts
        rotation: (Math.random() - 0.5) * 60, // -30 to 30 degrees
        drift: (Math.random() - 0.5) * 30, // -15 to 15 horizontal drift
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);
    setHeartIdCounter((prev) => prev + count);

    // Remove hearts after animation
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.find((nh) => nh.id === h.id))
      );
    }, 2500);
  };

  return (
    <main className="seo-article fade-up">
      {/* Back to Blog Button */}
      <div
        style={{ maxWidth: "900px", margin: "0 auto 2rem", padding: "0 2rem" }}
      >
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "rgba(255, 255, 255, 0.7)",
            textDecoration: "none",
            fontWeight: "500",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#0ce50c";
            e.currentTarget.style.background = "rgba(12, 229, 12, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: "20px", height: "20px" }}
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </div>

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "PENXCHAIN",
            url: "https://penxchain.org",
            logo: "https://penxchain.org/img/what-is-penxchain.jpg",
            description:
              "PENXCHAIN is a privacy-first blockchain ecosystem offering decentralized wallets, private payments, and a global marketplace.",
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://penxchain.org",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://penxchain.org/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "What is PENXCHAIN",
                item: "https://penxchain.org/blog/what-is-penxchain",
              },
            ],
          }),
        }}
      />

      <article>
        {/* HERO SECTION */}
        <motion.section
          className="article-hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInSlideUp}
        >
          <div className="hero-text">
            <h1>What is PENXCHAIN?</h1>

            <p>
              <strong>PENXCHAIN</strong> is a privacy-first blockchain ecosystem
              built for people who want to use crypto without exposing their
              entire financial life to the public.
            </p>

            <p>
              Today, most blockchains are fully transparent. Anyone can see your
              balance, your transaction history, and who you interact with.
              That's not freedom. That's surveillance dressed up as technology.
            </p>

            <p>
              PENXCHAIN was created to fix this. It gives you secure wallets,
              private payments, and decentralized commerce, all built with
              privacy as the default, not an optional feature.
            </p>

            <div className="callout">
              <strong>Short answer:</strong> PENXCHAIN is a blockchain that lets
              you control your money, protect your data, and stay private
              without stress.
            </div>
          </div>

          <div
            className="seo-image breathe"
            role="button"
            tabIndex={0}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              const el = e.currentTarget;
              if (!el) return;
              el.classList.remove("breathe");
              void el.offsetWidth;
              el.classList.add("breathe");
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                const el = e.currentTarget;
                el.classList.remove("breathe");
                void el.offsetWidth;
                el.classList.add("breathe");
              }
            }}
          >
            <Image
              src="/blog-images/what-is-penxchain.jpg"
              alt="What is PENXCHAIN — privacy-first blockchain ecosystem"
              width={680}
              height={420}
              priority
            />
          </div>
        </motion.section>

        {/* CORE PILLARS */}
        <motion.section
          className="content-section stagger show"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
        >
          <h2>Core Pillars of PENXCHAIN</h2>

          <ul>
            <motion.li variants={fadeInSlideUp}>
              <strong>Privacy by design:</strong> Privacy is built into
              PENXCHAIN from the ground up. Using advanced cryptography like
              zero-knowledge proofs, your balance, transactions, and identity
              remain hidden by default. In simple terms, you can use crypto
              without broadcasting your financial life to the world.
            </motion.li>

            <motion.li variants={fadeInSlideUp}>
              <strong>Strong security:</strong> PENXCHAIN follows a self-custody
              model. This means you control your wallet and your keys. Nobody
              can freeze, seize, or restrict your funds. The system is also
              auditable, so security can be verified, not just promised.
            </motion.li>

            <motion.li variants={fadeInSlideUp}>
              <strong>Decentralized commerce:</strong> PENXCHAIN is not just
              about sending money. It's about using it. The ecosystem includes a
              decentralized marketplace where people can trade directly with
              each other without middlemen, unnecessary fees, or constant
              tracking.
            </motion.li>
          </ul>
        </motion.section>

        {/* WHY IT MATTERS */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>Why Privacy Matters</h2>

          <p>
            Most blockchains today are radically transparent. Anyone can inspect
            your wallet, track your spending habits, and analyze your financial
            behavior.
          </p>

          <p>
            This creates real risks like targeted attacks, profiling, and loss
            of personal freedom. Privacy is not about hiding wrongdoing. It's
            about protecting normal people who simply want control over their
            own finances.
          </p>

          <p>
            Just like you don't publish your bank statement online, your crypto
            activity should also remain private. PENXCHAIN makes that possible.
          </p>
        </motion.section>

        {/* INTERNAL LINKS */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInSlideUp}
        >
          <h2>Explore the PENXCHAIN Ecosystem</h2>

          <p>
            PENXCHAIN is more than a single product. It is a connected ecosystem
            designed to work smoothly together. Explore our{" "}
            <Link href="/privacy-blockchain" style={{ color: "#00bfff" }}>
              privacy-first blockchain
            </Link>
            , the secure{" "}
            <Link href="/penxchain-wallet" style={{ color: "#00bfff" }}>
              PENXCHAIN Wallet
            </Link>
            , and the decentralized{" "}
            <Link href="/penxchain-marketplace" style={{ color: "#00bfff" }}>
              marketplace
            </Link>
            .
          </p>
        </motion.section>

        {/* FAQ */}
        <motion.section
          className="content-section faq"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInSlideUp}
        >
          <h2>Frequently Asked Questions</h2>

          <p>
            If you are new to PENXCHAIN, questions are normal. Crypto is already
            complex enough, so we keep answers clear, honest, and easy to
            understand.
          </p>

          <FaqAccordion />
        </motion.section>

        {/* Like Button Section */}
        <div
          style={{
            maxWidth: "300px",
            margin: "0 auto 2rem",
            padding: "0 2rem",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              padding: "1.5rem",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <button
              onClick={handleLike}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: isLiked
                  ? "rgba(255, 107, 107, 0.15)"
                  : "transparent",
                border: `2px solid ${
                  isLiked ? "#ff6b6b" : "rgba(255, 255, 255, 0.1)"
                }`,
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                color: isLiked ? "#ff6b6b" : "rgba(255, 255, 255, 0.7)",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "visible",
              }}
              onMouseEnter={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.background = "rgba(255, 107, 107, 0.1)";
                  e.currentTarget.style.borderColor = "#ff6b6b";
                  e.currentTarget.style.color = "#ff6b6b";
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                style={{ width: "24px", height: "24px" }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
            <span
              style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem" }}
            >
              {isLiked ? "You liked this" : "Like this post"}
            </span>
          </div>

          {/* Falling Hearts Animation */}
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
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  pointerEvents: "none",
                  zIndex: 1000,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
        </div>
      </article>
    </main>
  );
}
