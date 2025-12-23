"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";

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

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

export default function PenxTokenUtilityContent() {
  const postId = 7;

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

    if (newLikedState) {
      createHearts();
    }
  };

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

  return (
    <main className="seo-article fade-up">
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "$PENX Token Utility: The Economic Backbone of PENXCHAIN",
            image: "https://penxchain.org/blog-images/penx-token-utility.jpg",
            author: {
              "@type": "Person",
              name: "Emmanuel Oluwafemi",
            },
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

      <article>
        <motion.section
          className="article-hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInSlideUp}
        >
          <div className="hero-text">
            <h1>$PENX Token Utility</h1>

            <p style={{ fontSize: "1.2rem" }}>
              <strong>
                What role does $PENX play in the PENXCHAIN ecosystem?
              </strong>
            </p>

            <p>
              $PENX is the <strong>economic backbone of PENXCHAIN</strong>,
              designed to power privacy-first commerce, governance, and
              incentives.
            </p>

            <div className="callout">
              $PENX is not just a token. It&apos;s how users participate, merchants
              grow, and governance stays community-driven.
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
              src="/blog-images/penx-token-utility.jpg"
              alt="$PENX token utility and ecosystem benefits"
              width={680}
              height={420}
              priority
            />
          </div>
        </motion.section>

        <motion.section
          className="content-section stagger show"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>
            Core Utilities of $PENX
          </h2>

          {/* Staking */}
          <motion.div
            variants={fadeInSlideUp}
            style={{
              background:
                "linear-gradient(135deg, rgba(12, 229, 12, 0.1) 0%, rgba(12, 229, 12, 0.05) 100%)",
              border: "2px solid rgba(12, 229, 12, 0.3)",
              borderRadius: "16px",
              padding: "2.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  background: "rgba(12, 229, 12, 0.2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                🔒
              </div>
              <h3
                style={{
                  margin: 0,
                  color: "#0ce50c",
                  fontSize: "1.8rem",
                }}
              >
                Staking
              </h3>
            </div>

            <p style={{ fontSize: "1.05rem", marginBottom: "1.5rem" }}>
              $PENX holders can stake their tokens to participate in securing
              the network and earning rewards.
            </p>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p style={{ fontWeight: "600", marginBottom: "1rem" }}>
                Staking Benefits:
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Earn protocol rewards</strong> – Get rewarded for
                  supporting the ecosystem
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Support network security</strong> – Help maintain a
                  robust and decentralized infrastructure
                </li>
                <li style={{ marginBottom: 0 }}>
                  <strong>Align long-term incentives</strong> – Benefit from
                  ecosystem growth over time
                </li>
              </ul>
            </div>

            <p
              style={{
                marginTop: "1.5rem",
                marginBottom: 0,
                fontSize: "1.05rem",
                fontStyle: "italic",
                opacity: 0.9,
              }}
            >
              Staking encourages <strong>commitment, not speculation</strong>.
            </p>
          </motion.div>

          {/* Governance */}
          <motion.div
            variants={fadeInSlideUp}
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.05) 100%)",
              border: "2px solid rgba(0, 122, 255, 0.3)",
              borderRadius: "16px",
              padding: "2.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  background: "rgba(0, 122, 255, 0.2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                🗳️
              </div>
              <h3
                style={{
                  margin: 0,
                  color: "#007aff",
                  fontSize: "1.8rem",
                }}
              >
                Governance (PENXDAO)
              </h3>
            </div>

            <p style={{ fontSize: "1.05rem", marginBottom: "1.5rem" }}>
              $PENX gives holders <strong>direct influence</strong> over the
              ecosystem&apos;s future direction.
            </p>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p style={{ fontWeight: "600", marginBottom: "1rem" }}>
                Token holders can vote on:
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Protocol upgrades</strong> – Shape technical
                  improvements
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Marketplace rules</strong> – Define commerce standards
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Treasury allocation</strong> – Decide how funds are
                  used
                </li>
                <li style={{ marginBottom: 0 }}>
                  <strong>Ecosystem grants</strong> – Support community
                  initiatives
                </li>
              </ul>
            </div>

            <p
              style={{
                marginTop: "1.5rem",
                marginBottom: 0,
                fontSize: "1.05rem",
                fontStyle: "italic",
                opacity: 0.9,
              }}
            >
              Governance can be public or{" "}
              <strong>privacy-preserving using zero-knowledge proofs</strong>.
            </p>
          </motion.div>

          {/* Fees & Payments */}
          <motion.div
            variants={fadeInSlideUp}
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 159, 10, 0.1) 0%, rgba(255, 159, 10, 0.05) 100%)",
              border: "2px solid rgba(255, 159, 10, 0.3)",
              borderRadius: "16px",
              padding: "2.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  background: "rgba(255, 159, 10, 0.2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                💳
              </div>
              <h3
                style={{
                  margin: 0,
                  color: "#ff9f0a",
                  fontSize: "1.8rem",
                }}
              >
                Fees & Payments
              </h3>
            </div>

            <p style={{ fontSize: "1.05rem", marginBottom: "1.5rem" }}>
              $PENX is the primary payment method across PENXCHAIN services.
            </p>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p style={{ fontWeight: "600", marginBottom: "1rem" }}>
                $PENX is used for:
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Wallet services</strong> – Access advanced features
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Marketplace transactions</strong> – Buy and sell with
                  lower fees
                </li>
                <li style={{ marginBottom: 0 }}>
                  <strong>PENXPAY settlement fees</strong> – Fast, private
                  payments
                </li>
              </ul>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                background: "rgba(255, 159, 10, 0.15)",
                border: "1px solid rgba(255, 159, 10, 0.3)",
                borderRadius: "8px",
                padding: "1rem 1.5rem",
              }}
            >
              <p style={{ margin: 0, fontWeight: "600" }}>
                💡 Pro Tip: Using $PENX unlocks{" "}
                <strong>lower fees across the entire ecosystem</strong>.
              </p>
            </div>
          </motion.div>

          {/* Liquidity & LP Rewards */}
          <motion.div
            variants={fadeInSlideUp}
            style={{
              background:
                "linear-gradient(135deg, rgba(94, 92, 230, 0.1) 0%, rgba(94, 92, 230, 0.05) 100%)",
              border: "2px solid rgba(94, 92, 230, 0.3)",
              borderRadius: "16px",
              padding: "2.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  background: "rgba(94, 92, 230, 0.2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                💧
              </div>
              <h3
                style={{
                  margin: 0,
                  color: "#5e5ce6",
                  fontSize: "1.8rem",
                }}
              >
                Liquidity & LP Rewards
              </h3>
            </div>

            <p style={{ fontSize: "1.05rem", marginBottom: "1.5rem" }}>
              Liquidity providers earn rewards by supporting healthy markets for
              $PENX.
            </p>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p style={{ fontWeight: "600", marginBottom: "1rem" }}>
                This ensures:
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Deep liquidity</strong> – Easy to buy and sell without
                  slippage
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Price stability</strong> – Reduced volatility for
                  everyday use
                </li>
                <li style={{ marginBottom: 0 }}>
                  <strong>Smooth trading experience</strong> – Fast execution at
                  fair prices
                </li>
              </ul>
            </div>

            <p
              style={{
                marginTop: "1.5rem",
                marginBottom: 0,
                fontSize: "1.05rem",
                opacity: 0.9,
              }}
            >
              Liquidity providers are the backbone of a healthy token economy,
              and PENXCHAIN <strong>rewards them generously</strong>.
            </p>
          </motion.div>

          {/* Marketplace & Merchant Perks */}
          <motion.div
            variants={fadeInSlideUp}
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 55, 95, 0.1) 0%, rgba(255, 55, 95, 0.05) 100%)",
              border: "2px solid rgba(255, 55, 95, 0.3)",
              borderRadius: "16px",
              padding: "2.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  background: "rgba(255, 55, 95, 0.2)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                🏪
              </div>
              <h3
                style={{
                  margin: 0,
                  color: "#ff375f",
                  fontSize: "1.8rem",
                }}
              >
                Marketplace & Merchant Perks
              </h3>
            </div>

            <p style={{ fontSize: "1.05rem", marginBottom: "1.5rem" }}>
              Holding or using $PENX unlocks exclusive benefits for merchants
              and active users.
            </p>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p style={{ fontWeight: "600", marginBottom: "1rem" }}>
                Benefits include:
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Reduced merchant fees</strong> – Keep more of your
                  revenue
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Access to premium tools</strong> – Advanced analytics
                  and features
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Subscription discounts</strong> – Lower costs for
                  recurring services
                </li>
                <li style={{ marginBottom: 0 }}>
                  <strong>Priority features</strong> – Early access to new
                  releases
                </li>
              </ul>
            </div>

            <p
              style={{
                marginTop: "1.5rem",
                marginBottom: 0,
                fontSize: "1.05rem",
                fontStyle: "italic",
                opacity: 0.9,
              }}
            >
              For merchants building on PENXCHAIN, $PENX is the key to{" "}
              <strong>lower costs and better tools</strong>.
            </p>
          </motion.div>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>Private Commerce with pPENX</h2>

          <p>
            Inside <strong>Aleo</strong>, the wrapped version{" "}
            <strong>pPENX</strong> enables fully private commerce.
          </p>

          <div
            style={{
              background: "rgba(12, 229, 12, 0.05)",
              border: "2px solid rgba(12, 229, 12, 0.2)",
              borderRadius: "16px",
              padding: "2rem",
              margin: "2rem 0",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0ce50c" }}>What is pPENX?</h3>
            <p>
              pPENX is a privacy-wrapped version of $PENX that operates on the
              Aleo blockchain using zero-knowledge proofs.
            </p>
            <p>
              When you use pPENX, your transactions are completely confidential.
              Nobody can see:
            </p>
            <ul>
              <li>How much you paid</li>
              <li>Who you paid</li>
              <li>What you bought</li>
              <li>Your wallet balance</li>
            </ul>
            <p style={{ marginBottom: 0 }}>
              This makes pPENX ideal for{" "}
              <strong>private marketplace purchases</strong>,{" "}
              <strong>confidential payments</strong>, and{" "}
              <strong>business transactions</strong> that require discretion.
            </p>
          </div>

          <p>
            The combination of $PENX on Base (for liquidity) and pPENX on Aleo
            (for privacy) gives users the best of both worlds.
          </p>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{
            background:
              "linear-gradient(135deg, rgba(12, 229, 12, 0.1) 0%, rgba(0, 122, 255, 0.1) 100%)",
            border: "2px solid rgba(12, 229, 12, 0.3)",
            borderRadius: "16px",
            padding: "3rem 2rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginTop: 0 }}>
            $PENX: More Than Just a Token
          </h2>

          <p
            style={{
              fontSize: "1.15rem",
              maxWidth: "700px",
              margin: "0 auto 2rem",
            }}
          >
            $PENX is not just a speculative asset. It is the economic engine
            that powers the entire PENXCHAIN ecosystem.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              margin: "2rem auto 0",
              maxWidth: "800px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>
                🙋 For Users
              </p>
              <p style={{ margin: "0.5rem 0 0", opacity: 0.9 }}>
                Participate in governance and earn rewards
              </p>
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>
                🏪 For Merchants
              </p>
              <p style={{ margin: "0.5rem 0 0", opacity: 0.9 }}>
                Grow businesses with lower fees and better tools
              </p>
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>
                🤝 For the Community
              </p>
              <p style={{ margin: "0.5rem 0 0", opacity: 0.9 }}>
                Keep governance decentralized and community-driven
              </p>
            </div>
          </div>

          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginTop: "2.5rem",
              marginBottom: 0,
            }}
          >
            It&apos;s how the ecosystem stays <strong>sustainable</strong>,{" "}
            <strong>user-focused</strong>, and <strong>privacy-first</strong>.
          </p>
        </motion.section>

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
