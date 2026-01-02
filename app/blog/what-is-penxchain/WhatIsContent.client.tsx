/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import FaqAccordion from "./FaqAccordion";
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

// Safe localStorage access
const getStorageValue = (key: string, defaultValue: string): string => {
  if (typeof window === "undefined") return defaultValue;
  return window.localStorage.getItem(key) ?? defaultValue;
};

export default function WhatIsPenxchainPage() {
  const postId = 1;

  // Lazy initialization to prevent hydration issues
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

  // Optimized heart creation function
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
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .penx-article {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
          color: rgba(255, 255, 255, 0.9);
          padding: 3rem 0 5rem;
        }

        .penx-article-hero {
          max-width: 1100px;
          margin: 0 auto 4rem;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (max-width: 968px) {
          .penx-article-hero {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .penx-hero-text h1 {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .penx-hero-text p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 1.25rem;
        }

        .penx-hero-text strong {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 600;
        }

        .penx-callout {
          background: linear-gradient(135deg, rgba(0, 191, 255, 0.08) 0%, rgba(0, 191, 255, 0.03) 100%);
          border-left: 3px solid #00bfff;
          padding: 1.5rem;
          border-radius: 12px;
          margin-top: 2rem;
          backdrop-filter: blur(10px);
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
        }

        .penx-seo-image {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          position: relative;
        }

        .penx-seo-image::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 191, 255, 0.1) 0%, rgba(201, 74, 74, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 1;
        }

        .penx-seo-image:hover::before {
          opacity: 1;
        }

        .penx-seo-image:hover {
          transform: scale(1.03);
        }

        .penx-seo-image.penx-breathe {
          animation: penx-breathe 1.2s ease-in-out;
        }

        @keyframes penx-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .penx-seo-image img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        .penx-content-section {
          max-width: 800px;
          margin: 0 auto 4rem;
          padding: 0 2rem;
        }

        .penx-content-section h2 {
          font-size: clamp(1.875rem, 4vw, 2.5rem);
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.95);
          position: relative;
          padding-bottom: 0.75rem;
        }

        .penx-content-section h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #00bfff 0%, transparent 100%);
          border-radius: 2px;
        }

        .penx-content-section p {
          font-size: 1.0625rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.25rem;
        }

        .penx-content-section ul {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }

        .penx-content-section li {
          padding-left: 1.75rem;
          margin-bottom: 1.5rem;
          position: relative;
          font-size: 1.0625rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.75);
        }

        .penx-content-section li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #00bfff;
          font-weight: bold;
          font-size: 1.25rem;
        }

        .penx-content-section a {
          color: #00bfff;
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;
        }

        .penx-content-section a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #00bfff;
          transition: width 0.25s ease;
        }

        .penx-content-section a:hover::after {
          width: 100%;
        }

        .penx-content-section a:hover {
          color: #33ccff;
        }

        .penx-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.5rem 0.875rem;
          border-radius: 10px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border: 1px solid transparent;
        }

        .penx-back-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(201, 74, 74, 0.08);
          border: 1px solid rgba(201, 74, 74, 0.25);
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .penx-back-link:hover::before {
          opacity: 1;
        }

        .penx-back-link:hover {
          color: #c94a4a;
          transform: translateX(-3px);
        }

        .penx-back-link svg {
          transition: transform 0.25s ease;
        }

        .penx-like-container {
          max-width: 500px;
          margin: 0 auto 2rem;
          padding: 0 2rem;
          position: relative;
        }

        .penx-like-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          flex-wrap: wrap;
          backdrop-filter: blur(10px);
        }

        .penx-like-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: visible;
        }

        .penx-like-button.penx-liked {
          background: rgba(255, 107, 107, 0.15);
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .penx-like-button:not(.penx-liked):hover {
          background: rgba(255, 107, 107, 0.1);
          border-color: #ff6b6b;
          color: #ff6b6b;
          transform: scale(1.05);
        }

        .penx-like-button svg {
          width: 24px;
          height: 24px;
          transition: transform 0.3s ease;
        }

        .penx-like-button:hover svg {
          transform: scale(1.1);
        }

        .penx-like-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .penx-article {
            padding: 2rem 0 3rem;
          }

          .penx-content-section {
            margin-bottom: 3rem;
          }
        }
      `,
        }}
      />

      <main className="penx-article seo-article fade-up">
        {/* Navigation */}
        <nav
          style={{
            maxWidth: "1100px",
            margin: "0 auto 3rem",
            padding: "0 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 20,
          }}
        >
          <Link href="/blog" className="penx-back-link">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <ShareButtons
            title="What is PENXCHAIN? A Privacy-First Blockchain Ecosystem"
            slug="what-is-penxchain"
          />
        </nav>

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
            className="penx-article-hero article-hero"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInSlideUp}
          >
            <div className="penx-hero-text hero-text">
              <h1>What is PENXCHAIN?</h1>

              <p>
                <strong>PENXCHAIN</strong> is a privacy-first blockchain
                ecosystem built for people who want to use crypto without
                exposing their entire financial life to the public.
              </p>

              <p>
                Today, most blockchains are fully transparent. Anyone can see
                your balance, your transaction history, and who you interact
                with. That's not freedom. That's surveillance dressed up as
                technology.
              </p>

              <p>
                PENXCHAIN was created to fix this. It gives you secure wallets,
                private payments, and decentralized commerce, all built with
                privacy as the default, not an optional feature.
              </p>

              <div className="penx-callout callout">
                <strong>Short answer:</strong> PENXCHAIN is a blockchain that
                lets you control your money, protect your data, and stay private
                without stress.
              </div>
            </div>

            <div
              className="penx-seo-image seo-image penx-breathe breathe"
              role="button"
              tabIndex={0}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                const el = e.currentTarget;
                el.classList.remove("penx-breathe", "breathe");
                void el.offsetWidth;
                el.classList.add("penx-breathe", "breathe");
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  const el = e.currentTarget;
                  el.classList.remove("penx-breathe", "breathe");
                  void el.offsetWidth;
                  el.classList.add("penx-breathe", "breathe");
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
            className="penx-content-section content-section stagger show"
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
                <strong>Strong security:</strong> PENXCHAIN follows a
                self-custody model. This means you control your wallet and your
                keys. Nobody can freeze, seize, or restrict your funds. The
                system is also auditable, so security can be verified, not just
                promised.
              </motion.li>

              <motion.li variants={fadeInSlideUp}>
                <strong>Decentralized commerce:</strong> PENXCHAIN is not just
                about sending money. It's about using it. The ecosystem includes
                a decentralized marketplace where people can trade directly with
                each other without middlemen, unnecessary fees, or constant
                tracking.
              </motion.li>
            </ul>
          </motion.section>

          {/* WHY IT MATTERS */}
          <motion.section
            className="penx-content-section content-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeInSlideUp}
          >
            <h2>Why Privacy Matters</h2>

            <p>
              Most blockchains today are radically transparent. Anyone can
              inspect your wallet, track your spending habits, and analyze your
              financial behavior.
            </p>

            <p>
              This creates real risks like targeted attacks, profiling, and loss
              of personal freedom. Privacy is not about hiding wrongdoing. It's
              about protecting normal people who simply want control over their
              own finances.
            </p>

            <p>
              Just like you don't publish your bank statement online, your
              crypto activity should also remain private. PENXCHAIN makes that
              possible.
            </p>
          </motion.section>

          {/* INTERNAL LINKS */}
          <motion.section
            className="penx-content-section content-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInSlideUp}
          >
            <h2>Explore the PENXCHAIN Ecosystem</h2>

            <p>
              PENXCHAIN is more than a single product. It is a connected
              ecosystem designed to work smoothly together. Explore our{" "}
              <Link href="/privacy-blockchain">privacy-first blockchain</Link>,
              the secure <Link href="/penxchain-wallet">PENXCHAIN Wallet</Link>,
              and the decentralized{" "}
              <Link href="/penxchain-marketplace">marketplace</Link>.
            </p>
          </motion.section>

          {/* FAQ */}
          <motion.section
            className="penx-content-section content-section faq"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInSlideUp}
          >
            <h2>Frequently Asked Questions</h2>

            <p>
              If you are new to PENXCHAIN, questions are normal. Crypto is
              already complex enough, so we keep answers clear, honest, and easy
              to understand.
            </p>

            <FaqAccordion />
          </motion.section>

          {/* Like Section */}
          <div className="penx-like-container">
            <div className="penx-like-wrapper">
              <button
                onClick={handleLike}
                className={`penx-like-button ${isLiked ? "penx-liked" : ""}`}
                aria-label={isLiked ? "Unlike this post" : "Like this post"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>
              <span className="penx-like-text">
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
    </>
  );
}
