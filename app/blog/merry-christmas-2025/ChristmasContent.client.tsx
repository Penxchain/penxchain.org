/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import ShareButtons from "@/components/ShareButtons";
import confetti from "canvas-confetti"; // Assumes 'npm install canvas-confetti'

// --- Types ---
interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

interface Snowflake {
  id: number;
  left: string;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

/**
 * High-Performance Snowfall
 */
const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const flakes = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 12 + 15,
        delay: Math.random() * -20,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.2,
      }));
      setSnowflakes(flakes);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (snowflakes.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: "105vh",
            opacity: [0, flake.opacity, flake.opacity, 0],
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: flake.left,
            width: flake.size,
            height: flake.size,
            backgroundColor: "#fff",
            borderRadius: "50%",
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
  },
};

export default function ChristmasPage() {
  const postId = 9;
  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);
  const [giftClaimed, setGiftClaimed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Design Tokens
  const EMERALD = "#10b981";
  const RUBY = "#ef4444";
  const PREMIUM_NAVY = "#020617";
  const BORDER_SUBTLE = "rgba(255, 255, 255, 0.08)";
  const TEXT_DIM = "rgba(255, 255, 255, 0.6)";

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsMounted(true);
      const savedLiked = localStorage.getItem(`blog_liked_${postId}`);
      const savedCount = localStorage.getItem(`blog_likes_${postId}`);
      const savedGift = localStorage.getItem(`christmas_gift_2025`);

      setIsLiked(savedLiked === "true");
      setLikeCount(savedCount ? parseInt(savedCount, 10) : 0);
      setGiftClaimed(savedGift === "true");
    });
    return () => cancelAnimationFrame(frameId);
  }, [postId]);

  const handleGiftClick = () => {
    if (giftClaimed) return;

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [EMERALD, RUBY, "#ffffff", "#fbbf24"],
    });

    setGiftClaimed(true);
    setShowNotification(true);
    localStorage.setItem(`christmas_gift_2025`, "true");

    setTimeout(() => setShowNotification(false), 5000);
  };

  const shoutouts = useMemo(
    () => [
      {
        name: "Aleo",
        color: EMERALD,
        desc: "Pioneering ZK technology that makes privacy practical at scale.",
      },
      {
        name: "Base",
        color: "#0052ff",
        desc: "Building an accessible Layer 2 that brings blockchain to everyone.",
      },
      {
        name: "zkSync",
        color: "#8b5cf6",
        desc: "Advancing ZK rollups and making Ethereum more scalable.",
      },
      {
        name: "Scroll",
        color: "#ffb088",
        desc: "Pushing the boundaries of ZK-EVM technology.",
      },
      {
        name: "Starknet",
        color: "#ec4899",
        desc: "Innovating with STARK proofs and Cairo language.",
      },
      {
        name: "Verza",
        color: "#22c55e",
        desc: "Contributing to the privacy ecosystem and decentralization.",
      },
    ],
    [EMERALD]
  );

  const handleLike = useCallback(() => {
    const nextState = !isLiked;
    const nextCount = nextState ? likeCount + 1 : Math.max(0, likeCount - 1);
    setIsLiked(nextState);
    setLikeCount(nextCount);
    localStorage.setItem(`blog_liked_${postId}`, String(nextState));
    localStorage.setItem(`blog_likes_${postId}`, String(nextCount));

    if (nextState) {
      const burst: Heart[] = Array.from({ length: 8 }).map((_, i) => ({
        id: heartIdCounter + i,
        x: (Math.random() - 0.5) * 120,
        size: Math.random() * 15 + 15,
        duration: 1.2 + Math.random(),
        delay: i * 0.05,
        rotation: (Math.random() - 0.5) * 90,
        drift: (Math.random() - 0.5) * 60,
      }));
      setHearts((prev) => [...prev, ...burst]);
      setHeartIdCounter((c) => c + 8);
      setTimeout(
        () => setHearts((prev) => prev.filter((h) => !burst.includes(h))),
        3000
      );
    }
  }, [isLiked, likeCount, heartIdCounter, postId]);

  if (!isMounted)
    return <div style={{ minHeight: "100vh", background: PREMIUM_NAVY }} />;

  return (
    <main
      style={{
        backgroundColor: PREMIUM_NAVY,
        backgroundImage: `radial-gradient(circle at 50% 0%, #0f172a 0%, ${PREMIUM_NAVY} 100%)`,
        color: "#fff",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        paddingTop: "120px",
      }}
    >
      <Snowfall />

      {/* Global Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            style={{
              position: "fixed",
              bottom: "40px",
              left: "50%",
              zIndex: 100,
              padding: "1.2rem 2.5rem",
              background: "rgba(16, 185, 129, 0.15)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${EMERALD}`,
              borderRadius: "100px",
              color: "#fff",
              fontWeight: "600",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            🌟 You've unlocked the spirit of Privacy! Have a great 2026!
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 20,
        }}
      >
        <Link
          href="/blog"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#c94a4a";
            e.currentTarget.style.background = "rgba(201, 74, 74, 0.08)";
            e.currentTarget.style.backdropFilter = "blur(6px)";
            e.currentTarget.style.borderColor = "rgba(201, 74, 74, 0.25)";
            e.currentTarget.style.padding = "6px 10px";
            e.currentTarget.style.borderRadius = "10px";
            e.currentTarget.style.transform = "translateX(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = TEXT_DIM;
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.backdropFilter = "none";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.padding = "0";
            e.currentTarget.style.borderRadius = "0";
            e.currentTarget.style.transform = "translateX(0)";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: TEXT_DIM,
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: "500",
            border: "1px solid transparent",
            transition: "all 0.25s ease",
            willChange: "transform, background, color",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ transition: "transform 0.25s ease" }}
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <ShareButtons
          title="Merry Christmas 2025 - PENXCHAIN"
          slug="merry-christmas-2025"
        />
      </nav>

      <motion.article
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          padding: "2rem 1.5rem 8rem",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Hero Section */}
        <motion.section
          variants={itemVariants}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <h1
            style={{
              fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
              fontWeight: "850",
              letterSpacing: "-0.04em",
              lineHeight: "1.1",
              marginBottom: "1.5rem",
            }}
          >
            Season of <span style={{ color: EMERALD }}>Privacy</span> <br /> &
            Global Peace
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: TEXT_DIM,
              maxWidth: "650px",
              margin: "0 auto 3.5rem",
              lineHeight: "1.7",
            }}
          >
            To all our privacy-conscious friends, families, builders, and
            communities—we wish you a wonderful Christmas filled with joy,
            peace, and the freedom you deserve.
          </p>
          <motion.div
            whileHover={{ scale: 1.015 }}
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              border: `1px solid ${BORDER_SUBTLE}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              margin: "0 auto",
            }}
          >
            <Image
              src="/blog-images/christmas-2025.jpg"
              alt="PENXCHAIN Christmas"
              width={850}
              height={470}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>
        </motion.section>

        {/* Community Intro */}
        <motion.section
          variants={itemVariants}
          style={{ marginBottom: "4rem", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "750",
              marginBottom: "1.5rem",
            }}
          >
            Celebrating the Privacy Community
          </h2>
          <p
            style={{ color: TEXT_DIM, fontSize: "1.05rem", lineHeight: "1.8" }}
          >
            Privacy is not just a feature—it's a fundamental right. Together
            with remarkable projects across the blockchain ecosystem, we're
            building a future where people control their data and protect their
            financial sovereignty.
          </p>
        </motion.section>

        {/* Fellow Builders Grid */}
        <motion.section
          variants={itemVariants}
          style={{ marginBottom: "5rem" }}
        >
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              marginBottom: "2rem",
              textAlign: "center",
              color: EMERALD,
            }}
          >
            Merry Christmas To Our Fellow Builders
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {shoutouts.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{
                  y: -8,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: item.color,
                }}
                style={{
                  padding: "2rem",
                  borderRadius: "24px",
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${BORDER_SUBTLE}`,
                  transition: "all 0.4s ease",
                }}
              >
                <div
                  style={{
                    color: item.color,
                    fontWeight: "800",
                    fontSize: "1.1rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  {item.name}
                </div>
                <p
                  style={{
                    color: TEXT_DIM,
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              color: "white",
              marginTop: "2rem",
              fontSize: "0.95rem",
            }}
          >
            ...and many more incredible teams building the future of privacy.
          </p>
        </motion.section>

        {/* Building Together Vision */}
        <motion.section
          variants={itemVariants}
          style={{ marginBottom: "5rem" }}
        >
          <div
            style={{
              padding: "4rem 2rem",
              borderRadius: "32px",
              background: `linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)`,
              border: `1px solid ${BORDER_SUBTLE}`,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                marginBottom: "1.5rem",
                fontWeight: "750",
              }}
            >
              Building Together
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1.1rem",
                lineHeight: "1.8",
                marginBottom: "2rem",
              }}
            >
              The future of blockchain isn't about competition—it's about{" "}
              <strong>collaboration</strong>. Every project advancing privacy
              makes the entire ecosystem stronger.
            </p>

            {/* Shaking Gift Box */}
            <motion.div
              onClick={handleGiftClick}
              animate={!giftClaimed ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={
                !giftClaimed
                  ? { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
                  : {}
              }
              style={{
                fontSize: "4rem",
                cursor: giftClaimed ? "default" : "pointer",
                display: "inline-block",
                filter: "drop-shadow(0 0 15px rgba(239, 68, 68, 0.3))",
              }}
            >
              {giftClaimed ? "🎊" : "🎁"}
            </motion.div>
          </div>
        </motion.section>

        {/* 2025 Vision & Links */}
        <motion.section variants={itemVariants} style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              marginBottom: "1rem",
            }}
          >
            Here's to 2025
          </h2>
          <p
            style={{
              color: TEXT_DIM,
              fontSize: "1.1rem",
              lineHeight: "1.7",
              marginBottom: "3.5rem",
            }}
          >
            May the new year bring privacy, prosperity, and freedom to everyone.
            Let's continue building systems that serve humanity.
          </p>

          <div
            style={{
              padding: "2.5rem",
              borderRadius: "28px",
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${BORDER_SUBTLE}`,
              marginBottom: "4rem",
            }}
          >
            <p
              style={{
                color: TEXT_DIM,
                marginBottom: "2rem",
                fontSize: "0.95rem",
              }}
            >
              Explore how PENXCHAIN contributes to the privacy ecosystem:
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "25px",
              }}
            >
              {[
                { name: "PENXCHAIN Wallet", href: "/wallet" },
                { name: "PENXPAY", href: "/pay" },
                {
                  name: "Hybrid Architecture",
                  href: "/blog/connecting-with-base-hybrid-blockchain",
                },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    color: EMERALD,
                    fontWeight: "600",
                    textDecoration: "none",
                    borderBottom: `2px solid transparent`,
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderBottomColor = EMERALD)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderBottomColor = "transparent")
                  }
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "3rem",
            }}
          >
            Merry Christmas & Happy Holidays! 🎄
          </div>

          {/* Restored Like Interaction */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 36px",
                background: isLiked
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(255,255,255,0.05)",
                border: `1.5px solid ${isLiked ? RUBY : BORDER_SUBTLE}`,
                borderRadius: "100px",
                color: isLiked ? RUBY : "#fff",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {isLiked ? `Loved by ${likeCount}` : "Send Love"}
            </motion.button>

            <AnimatePresence>
              {hearts.map((h) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 1, y: 0, x: h.x, scale: 0 }}
                  animate={{
                    opacity: 0,
                    y: -160,
                    x: h.x + h.drift,
                    scale: 1.3,
                    rotate: h.rotation,
                  }}
                  transition={{
                    duration: h.duration,
                    delay: h.delay,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "0",
                    pointerEvents: "none",
                  }}
                >
                  <svg
                    width={h.size}
                    height={h.size}
                    viewBox="0 0 24 24"
                    fill={RUBY}
                    style={{ filter: `drop-shadow(0 0 8px ${RUBY}66)` }}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      </motion.article>
    </main>
  );
}
