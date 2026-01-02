"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import ShareButtons from "@/components/ShareButtons";

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

export default function BaseHybridContent() {
  const postId = 5;
  const postTitle = "Connecting with Base: PENXCHAIN's Hybrid Architecture";
  const postSlug = "connecting-with-base";

  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  // ✅ Senior Fix: Using requestAnimationFrame to prevent cascading renders
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
      const liked = localStorage.getItem(`blog_liked_${postId}`);
      const count = localStorage.getItem(`blog_likes_${postId}`);
      setIsLiked(liked === "true");
      setLikeCount(count ? parseInt(count, 10) : 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [postId]);

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

  if (!isMounted) return null;

  return (
    <main className="seo-article fade-up">
      {/* HEADER SECTION */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto 2rem",
          padding: "0 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "rgba(255, 255, 255, 0.7)",
            textDecoration: "none",
            fontWeight: "600",
            padding: "0.6rem 1.2rem",
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ff4d4d"; // Premium Muted Red
            e.currentTarget.style.background = "rgba(139, 0, 0, 0.15)"; // Deep Ruby Glass
            e.currentTarget.style.borderColor = "rgba(255, 77, 77, 0.3)";
            e.currentTarget.style.backdropFilter = "blur(10px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.backdropFilter = "none";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ width: "18px", height: "18px" }}
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
        <ShareButtons title={postTitle} slug={postSlug} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Connecting with Base: PENXCHAIN's Hybrid Architecture",
            image: "https://penxchain.org/blog-images/base-hybrid.jpg",
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
            datePublished: "2024-11-25",
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
            <h1>Connecting with Base: The Hybrid Approach</h1>

            <p>
              <strong>PENXCHAIN is built hybrid by design.</strong>
            </p>

            <p>
              We build our core products on <strong>Aleo</strong> using
              zero-knowledge (ZK) technology to deliver privacy-first execution
              for payments, commerce, and identity.
            </p>

            <p>
              We deploy the <strong>$PENX token on Base</strong> for liquidity,
              distribution, composability, and access to a larger market.
            </p>

            <div className="callout">
              Aleo handles private execution. Base handles liquidity and
              settlement. This structure lets us scale real-world privacy
              without sacrificing adoption.
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
              src="/blog-images/base-hybrid.jpg"
              alt="PENXCHAIN hybrid architecture with Aleo and Base"
              width={680}
              height={420}
              priority
            />
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>Why Hybrid Architecture?</h2>

          <p>
            Most blockchain projects force a choice: either prioritize privacy
            and limit adoption, or maximize liquidity and sacrifice user
            protection.
          </p>

          <p>
            PENXCHAIN refuses that trade-off. By combining the strengths of two
            specialized chains, we deliver both privacy and scale.
          </p>

          <p>
            This is not a compromise. It is an intentional design decision that
            acknowledges the different needs of private execution versus public
            liquidity.
          </p>
        </motion.section>

        <motion.section
          className="content-section stagger show"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <h2>The Two-Layer System</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              margin: "2rem 0",
            }}
          >
            <motion.div
              variants={fadeInSlideUp}
              style={{
                background: "rgba(12, 229, 12, 0.05)",
                border: "1px solid rgba(12, 229, 12, 0.2)",
                borderRadius: "12px",
                padding: "2rem",
              }}
            >
              <h3 style={{ color: "#0ce50c", marginTop: 0 }}>
                Layer 1: Aleo (Privacy)
              </h3>
              <ul style={{ margin: "1rem 0", paddingLeft: "1.5rem" }}>
                <li>Zero-knowledge proof execution</li>
                <li>Private payments and transactions</li>
                <li>Confidential commerce infrastructure</li>
                <li>Encrypted identity management</li>
              </ul>
              <p style={{ fontSize: "0.9rem", opacity: 0.8, margin: 0 }}>
                <strong>Purpose:</strong> Protect user data and transaction
                privacy
              </p>
            </motion.div>

            <motion.div
              variants={fadeInSlideUp}
              style={{
                background: "rgba(0, 82, 255, 0.05)",
                border: "1px solid rgba(0, 82, 255, 0.2)",
                borderRadius: "12px",
                padding: "2rem",
              }}
            >
              <h3 style={{ color: "#0052ff", marginTop: 0 }}>
                Layer 2: Base (Liquidity)
              </h3>
              <ul style={{ margin: "1rem 0", paddingLeft: "1.5rem" }}>
                <li>$PENX token distribution</li>
                <li>DeFi integration and composability</li>
                <li>Broader market access</li>
                <li>Fast, low-cost settlements</li>
              </ul>
              <p style={{ fontSize: "0.9rem", opacity: 0.8, margin: 0 }}>
                <strong>Purpose:</strong> Enable adoption and liquidity at scale
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>How It Works in Practice</h2>

          <p>
            When you use PENXCHAIN, the system routes your activity to the right
            layer automatically:
          </p>

          <ul>
            <li>
              <strong>Making a private payment?</strong> Your transaction is
              processed on Aleo with full ZK encryption. Nobody can see who you
              paid, how much you sent, or what your balance is.
            </li>
            <li>
              <strong>Trading $PENX tokens?</strong> The transaction happens on
              Base, where you benefit from deep liquidity, fast confirmations,
              and integration with the broader DeFi ecosystem.
            </li>
            <li>
              <strong>Shopping on the marketplace?</strong> The payment is
              private (Aleo), but the token movement for rewards or settlements
              happens on Base when needed.
            </li>
          </ul>

          <p>
            You do not have to think about which chain you are using. The
            interface handles routing behind the scenes, giving you a seamless
            experience.
          </p>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>Why Base Specifically?</h2>

          <p>
            Base is an Ethereum Layer 2 built by Coinbase. It is optimized for
            speed, low fees, and Ethereum compatibility. More importantly, it
            has rapidly become one of the most active chains for real users and
            real applications.
          </p>

          <p>Here is why it fits PENXCHAIN:</p>

          <ul>
            <li>
              <strong>High liquidity:</strong> Base has strong DeFi integration,
              making it easy to trade, swap, and provide liquidity for $PENX.
            </li>
            <li>
              <strong>Low fees:</strong> Transaction costs are a fraction of
              Ethereum mainnet, making small payments and frequent interactions
              practical.
            </li>
            <li>
              <strong>Ecosystem growth:</strong> Base is attracting developers,
              users, and projects focused on real-world utility, not just
              speculation.
            </li>
            <li>
              <strong>Composability:</strong> Being EVM-compatible means $PENX
              can interact with hundreds of existing protocols and tools.
            </li>
          </ul>
        </motion.section>

        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>The Strategic Advantage</h2>

          <p>
            By splitting responsibilities between Aleo and Base, PENXCHAIN gains
            advantages that single-chain projects cannot match:
          </p>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "2rem",
              margin: "2rem 0",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              Best-in-Class Technology for Each Use Case
            </h3>
            <p>
              Aleo is purpose-built for privacy. Base is purpose-built for
              liquidity. We use each chain for what it does best.
            </p>

            <h3>Reduced Risk</h3>
            <p>
              If one chain faces congestion, regulatory pressure, or technical
              issues, the other continues operating. The system is resilient by
              design.
            </p>

            <h3>Flexibility for Future Growth</h3>
            <p>
              As the ecosystem evolves, we can integrate additional chains or
              protocols without rebuilding from scratch. The hybrid model is
              future-proof.
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
          <h2>Hybrid Is Not a Trend. It Is How PENXCHAIN Grows.</h2>

          <p>
            Privacy and adoption are not opposing forces. They are complementary
            goals that require the right infrastructure.
          </p>

          <p>
            By building on Aleo for privacy and Base for liquidity, PENXCHAIN
            creates a system that serves both users who need protection and
            users who need access.
          </p>

          <p>
            This is not a temporary strategy. It is the foundation of how
            PENXCHAIN scales globally without compromising its core values.
          </p>

          <p>
            <strong>Privacy-first. Liquidity-ready. Built to last.</strong>
          </p>
        </motion.section>

        {/* --- Unified Premium Action Hub (Share & Like) --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInSlideUp}
          style={{
            maxWidth: "800px",
            margin: "5rem auto 4rem",
            padding: "3.5rem 2rem",
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(20px)",
            borderRadius: "32px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "center",
            boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💡</div>
          <h3
            style={{
              fontSize: "1.7rem",
              fontWeight: "800",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Enjoyed this architectural deep-dive?
          </h3>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              marginBottom: "2.5rem",
              lineHeight: "1.6",
              maxWidth: "500px",
              margin: "0 auto 2.5rem",
            }}
          >
            Knowledge is the only asset that grows when shared. Help us
            enlighten the community by sharing this hybrid vision with your
            network.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2.5rem",
            }}
          >
            {/* Redesigned Like Button inside the Share Hub */}
            <div style={{ position: "relative" }}>
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: isLiked
                    ? "rgba(255, 77, 77, 0.1)"
                    : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${
                    isLiked
                      ? "rgba(255, 77, 77, 0.4)"
                      : "rgba(255, 255, 255, 0.1)"
                  }`,
                  padding: "14px 32px",
                  borderRadius: "100px",
                  color: isLiked ? "#ff4d4d" : "rgba(255, 255, 255, 0.8)",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ width: "22px", height: "22px" }}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isLiked ? `Loved by ${likeCount}` : "Appreciate Article"}
              </motion.button>

              {/* Heart animation effects */}
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
                      top: "0",
                      left: "50%",
                      pointerEvents: "none",
                      zIndex: 1000,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#ff4d4d"
                      style={{
                        width: `${heart.size}px`,
                        height: `${heart.size}px`,
                        filter: "drop-shadow(0 2px 4px rgba(255, 77, 77, 0.3))",
                      }}
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div
              style={{
                width: "100%",
                height: "1px",
                background: "rgba(255,255,255,0.06)",
                maxWidth: "400px",
              }}
            />

            {/* Share section */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                Spread the Vision
              </span>
              <ShareButtons title={postTitle} slug={postSlug} />
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  );
}
