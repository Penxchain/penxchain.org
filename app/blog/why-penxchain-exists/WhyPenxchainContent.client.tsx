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

export default function WhyPenxchainContent() {
  const postId = 6;

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
            headline:
              "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
            image: "https://penxchain.org/blog-images/why-penxchain-exists.jpg",
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
            datePublished: "2024-11-28",
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
            <h1>Why PENXCHAIN Exists</h1>

            <p>
              Blockchain promised <strong>freedom</strong>,{" "}
              <strong>transparency</strong>, and <strong>global access</strong>.
            </p>

            <p>
              But for most people, the experience today is{" "}
              <strong>fragmented</strong>, <strong>exposed</strong>, and{" "}
              <strong>difficult to use</strong>.
            </p>

            <p>
              <strong>PENXCHAIN exists to fix that.</strong>
            </p>
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>Problem #1: Fragmented User Experiences</h2>

          <p>
            Users are forced to juggle multiple apps: wallets, bridges,
            marketplaces, payment tools. Each with different rules, risks, and
            learning curves.
          </p>

          <p>
            <strong>This complexity blocks real adoption.</strong>
          </p>

          <p>
            Merchants face the same issue. Selling online often means relying on
            multiple platforms, paying high fees, and losing control over
            customer data.
          </p>

          <p>
            There is no unified, user-first commerce infrastructure that just
            works.
          </p>

          <div
            style={{
              background: "rgba(255, 59, 48, 0.1)",
              border: "1px solid rgba(255, 59, 48, 0.3)",
              borderRadius: "12px",
              padding: "1.5rem",
              margin: "2rem 0",
            }}
          >
            <p style={{ margin: 0, fontWeight: "500" }}>
              <strong>The result?</strong> Users give up. Merchants stick with
              traditional payment processors. And blockchain remains trapped in
              its own bubble.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInSlideUp}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              margin: "2rem 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 300px" }}>
                <h2>Problem #2: Lack of Privacy by Default</h2>

                <p>
                  Most blockchains expose wallet activity, transaction history,
                  spending patterns, and business data to the public.
                </p>

                <p>
                  <strong>
                    This level of transparency is not sustainable for everyday
                    users or real commerce.
                  </strong>
                </p>

                <p>
                  Privacy should not be a premium feature or an optional add-on.
                  It should be built into the system from the start.
                </p>

                <p>
                  <strong>
                    PENXCHAIN was designed with privacy as the foundation, not
                    an afterthought.
                  </strong>
                </p>
              </div>

              <div
                style={{ flex: "1 1 300px" }}
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
                  src="/blog-images/why-penxchain-exists.jpg"
                  alt="Why PENXCHAIN exists - fixing blockchain problems"
                  width={450}
                  height={300}
                  priority
                />
              </div>
            </div>
          </div>

          <div className="callout" style={{ marginTop: "2rem" }}>
            When your financial activity is public, you become a target.
            Surveillance, profiling, and exploitation are not hypothetical
            risks. They are the reality of transparent blockchains today.
          </div>
        </motion.section>

        <motion.section
          className="content-section stagger show"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <h2>Problem #3: Emerging Markets Are Underserved</h2>

          <p>
            <strong>Especially Africa.</strong>
          </p>

          <p>
            Millions of users and merchants face systemic challenges that
            blockchain could solve, but most projects ignore them entirely:
          </p>

          <motion.div
            variants={fadeInSlideUp}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              margin: "2rem 0",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  marginTop: 0,
                  color: "#0ce50c",
                  fontWeight: "700",
                }}
              >
                Limited Access
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                Many people lack access to reliable banking and financial tools
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  marginTop: 0,
                  color: "#0ce50c",
                  fontWeight: "700",
                }}
              >
                High Costs
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                Remittances and cross-border payments drain wealth through
                excessive fees
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  marginTop: 0,
                  color: "#0ce50c",
                  fontWeight: "700",
                }}
              >
                Platform Dependency
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                Small businesses rely on extractive platforms that control their
                data and profits
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  marginTop: 0,
                  color: "#0ce50c",
                  fontWeight: "700",
                }}
              >
                Weak Protection
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                Data protection is often minimal, leaving users and merchants
                vulnerable
              </p>
            </div>
          </motion.div>

          <p>
            Yet these markets are <strong>mobile-first</strong>,{" "}
            <strong>digital-native</strong>, and <strong>ready to scale</strong>
            .
          </p>

          <p>
            <strong>
              PENXCHAIN sees Africa not as an afterthought, but as a starting
              point.
            </strong>
          </p>

          <p>
            By building private, accessible, and low-friction commerce
            infrastructure, the ecosystem supports real economic activity, not
            just speculation.
          </p>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>The PENXCHAIN Solution</h2>

          <p>
            By combining a privacy-aware wallet with fully private e-commerce
            and payments infrastructure, PENXCHAIN creates a unified experience
            for users and merchants.
          </p>

          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(12, 229, 12, 0.1) 0%, rgba(0, 82, 255, 0.1) 100%)",
              border: "1px solid rgba(12, 229, 12, 0.3)",
              borderRadius: "16px",
              padding: "2.5rem",
              margin: "2.5rem 0",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: "1.4rem" }}>
              No Fragmentation
            </h3>
            <p>
              One wallet. One marketplace. One seamless system. No need to
              juggle multiple apps or learn different interfaces.
            </p>

            <h3 style={{ fontSize: "1.4rem" }}>No Data Exposure</h3>
            <p>
              Privacy is default. Your transactions, balances, and activity
              remain confidential. Only you control who sees what.
            </p>

            <h3 style={{ fontSize: "1.4rem", marginBottom: 0 }}>
              No Unnecessary Intermediaries
            </h3>
            <p style={{ marginBottom: 0 }}>
              Direct peer-to-peer commerce. Lower fees. Faster settlements. Real
              ownership.
            </p>
          </div>

          <p>
            <strong>
              PENXCHAIN exists to return control where it belongs:
            </strong>
          </p>

          <ul style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
            <li>
              <strong>Users own their data</strong>
            </li>
            <li>
              <strong>Merchants own their business</strong>
            </li>
            <li>
              <strong>Communities build their own economies</strong>
            </li>
          </ul>

          <p>All without sacrificing usability or liquidity.</p>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>What Makes This Different?</h2>

          <p>
            Many projects talk about privacy. Few actually build it as the
            foundation.
          </p>

          <p>
            Many projects talk about emerging markets. Most ignore them after
            the marketing campaign ends.
          </p>

          <p>
            Many projects talk about user experience. But they still make people
            use five different apps to do one simple thing.
          </p>

          <p>
            <strong>PENXCHAIN is different because it is deliberate:</strong>
          </p>

          <ul>
            <li>
              Privacy is not optional. It is built into every transaction, every
              payment, every interaction.
            </li>
            <li>
              Emerging markets are not an afterthought. They are the testing
              ground for real-world usability.
            </li>
            <li>
              Simplicity is not sacrificed for features. The system works for
              people who just want to pay for something or sell something
              without needing a computer science degree.
            </li>
          </ul>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{
            background: "rgba(12, 229, 12, 0.05)",
            border: "2px solid rgba(12, 229, 12, 0.2)",
            borderRadius: "16px",
            padding: "3rem 2rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginTop: 0 }}>
            In Short, PENXCHAIN Exists Because the Next Phase of Blockchain Must
            Be:
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              margin: "2rem 0 0",
              textAlign: "left",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#0ce50c",
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                Usable
              </h3>
              <p style={{ margin: 0 }}>
                Simple enough for anyone to use without friction
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: "#0ce50c",
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                Private
              </h3>
              <p style={{ margin: 0 }}>
                Protecting users by default, not as an afterthought
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: "#0ce50c",
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                Inclusive
              </h3>
              <p style={{ margin: 0 }}>
                Built for everyone, especially underserved communities
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: "#0ce50c",
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                Commerce-Ready
              </h3>
              <p style={{ margin: 0 }}>
                Designed for real transactions, not just speculation
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <p style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
            That is the foundation of a truly global, privacy-powered digital
            economy.
          </p>

          <p style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
            <strong>
              PENXCHAIN exists because someone had to build it. And we are.
            </strong>
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