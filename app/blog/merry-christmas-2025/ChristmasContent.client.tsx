/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
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

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

export default function ChristmasPage() {
  const postId = 9;

  const [isMounted, setIsMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  // ✅ SAFE localStorage access
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const liked = localStorage.getItem(`blog_liked_${postId}`);
    const count = localStorage.getItem(`blog_likes_${postId}`);

    setIsLiked(liked === "true");
    setLikeCount(count ? parseInt(count, 10) : 0);
  }, [postId]);

  if (!isMounted) {
    return null; // prevents hydration mismatch
  }

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

  const handleLike = () => {
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

  // 👇👇👇
  // EVERYTHING BELOW THIS LINE (YOUR JSX/UI)
  // STAYS EXACTLY THE SAME

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

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Merry Christmas from PENXCHAIN: Celebrating the Privacy Blockchain Community",
            description:
              "PENXCHAIN wishes a Merry Christmas to all privacy-conscious builders, users, and communities in the blockchain ecosystem—Aleo, Base, zkSync, Scroll, Starknet, and more.",
            image: "https://penxchain.org/blog-images/christmas-2025.jpg",
            author: {
              "@type": "Person",
              name: "PENXCHAIN Team",
            },
            publisher: {
              "@type": "Organization",
              name: "PENXCHAIN",
              logo: {
                "@type": "ImageObject",
                url: "https://penxchain.org/img/logo.png",
              },
            },
            datePublished: "2025-12-25",
            dateModified: "2025-12-25",
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
                name: "Merry Christmas 2025",
                item: "https://penxchain.org/blog/merry-christmas-2025",
              },
            ],
          }),
        }}
      />

      <article>
        {/* FESTIVE HERO WITH CENTERED IMAGE */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInSlideUp}
          style={{
            textAlign: "center",
            paddingBottom: "2rem",
            position: "relative",
          }}
        >
          <motion.div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🎄
          </motion.div>

          <h1 style={{ marginBottom: "1.5rem" }}>
            Merry Christmas from PENXCHAIN
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "700px",
              margin: "0 auto 3rem",
            }}
          >
            To all our privacy-conscious friends, families, builders, and
            communities around the world—we wish you a wonderful Christmas
            filled with joy, peace, and the freedom you deserve.
          </p>

          {/* HERO IMAGE - Well sized and centered */}
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
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(12, 229, 12, 0.2)",
              border: "2px solid rgba(12, 229, 12, 0.3)",
            }}
          >
            <Image
              src="/blog-images/christmas-2025.jpg"
              alt="Merry Christmas from PENXCHAIN - Privacy blockchain community celebration"
              width={900}
              height={500}
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </motion.section>

        {/* GRATITUDE MESSAGE */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{
            maxWidth: "900px",
            margin: "3rem auto",
            padding: "0 2rem",
            textAlign: "center",
          }}
        >
          <h2>Celebrating the Privacy Community</h2>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
            This Christmas, we want to take a moment to celebrate the incredible
            community of builders, innovators, and believers who are working to
            make privacy a fundamental right in the digital world.
          </p>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
            Privacy is not just a feature—it's a value we share with remarkable
            projects and teams across the blockchain ecosystem. Together, we're
            building a future where people control their data, protect their
            financial sovereignty, and transact with dignity.
          </p>
        </motion.section>

        {/* SHOUTOUTS GRID */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInSlideUp}
          style={{
            maxWidth: "1000px",
            margin: "3rem auto",
            padding: "0 2rem",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Merry Christmas To Our Fellow Builders
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                padding: "2rem",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(12, 229, 12, 0.2)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ color: "#0ce50c", marginBottom: "0.5rem" }}>Aleo</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                For pioneering zero-knowledge technology that makes privacy
                practical at scale
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                padding: "2rem",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(0, 82, 255, 0.2)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ color: "#0052ff", marginBottom: "0.5rem" }}>Base</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                For building an accessible Layer 2 that brings blockchain to
                everyone
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                padding: "2rem",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ color: "#8b5cf6", marginBottom: "0.5rem" }}>
                zkSync
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                For advancing ZK rollups and making Ethereum more scalable
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                padding: "2rem",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 107, 107, 0.2)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ color: "#ff6b6b", marginBottom: "0.5rem" }}>
                Scroll
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                For pushing the boundaries of ZK-EVM technology
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                padding: "2rem",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(236, 72, 153, 0.2)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ color: "#ec4899", marginBottom: "0.5rem" }}>
                Starknet
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                For innovating with STARK proofs and Cairo language
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                padding: "2rem",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <h3 style={{ color: "#22c55e", marginBottom: "0.5rem" }}>
                Verza
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                For contributing to the privacy ecosystem
              </p>
            </motion.div>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "2rem",
              fontSize: "1.1rem",
              fontStyle: "italic",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            ...and many more incredible teams building the future of privacy and
            decentralization.
          </p>
        </motion.section>

        {/* COMMUNITY MESSAGE */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{
            maxWidth: "800px",
            margin: "3rem auto",
            padding: "0 2rem",
            textAlign: "center",
          }}
        >
          <h2>Building Together</h2>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
            The future of blockchain isn't about competition—it's about
            collaboration. Every project advancing privacy, scalability, or
            accessibility makes the entire ecosystem stronger.
          </p>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
            PENXCHAIN exists because of the groundbreaking work done by teams
            like Aleo, Base, and countless others. We're grateful to be part of
            a community that shares our values and pushes the boundaries of
            what's possible.
          </p>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
            This Christmas, we celebrate not just our own progress but the
            collective effort of everyone working toward a more private,
            decentralized, and human-centered digital future.
          </p>
        </motion.section>

        {/* FESTIVE CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{
            maxWidth: "700px",
            margin: "3rem auto",
            padding: "0 2rem",
          }}
        >
          <div
            style={{
              padding: "3rem 2rem",
              background:
                "linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(34, 197, 94, 0.1))",
              borderRadius: "16px",
              border: "2px solid rgba(220, 38, 38, 0.3)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
            <h3
              style={{
                color: "#dc2626",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Here's to 2025
            </h3>
            <p
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
            >
              May the new year bring privacy, prosperity, and freedom to
              everyone in the blockchain community. Let's continue building
              systems that serve humanity, not the other way around.
            </p>
            <p
              style={{
                fontSize: "1.3rem",
                fontWeight: "600",
                color: "#22c55e",
              }}
            >
              Merry Christmas & Happy Holidays! 🎄
            </p>
          </div>
        </motion.section>

        {/* LINKS TO ECOSYSTEM */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{
            maxWidth: "800px",
            margin: "3rem auto",
            padding: "0 2rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1rem", opacity: 0.8, lineHeight: "1.8" }}>
            While you're here, explore how PENXCHAIN is contributing to the
            privacy ecosystem. Try the{" "}
            <Link href="/penxchain-wallet" style={{ color: "#0ce50c" }}>
              PENXCHAIN Wallet
            </Link>
            , discover{" "}
            <Link href="/penxpay" style={{ color: "#0ce50c" }}>
              PENXPAY
            </Link>{" "}
            for private transactions, or read about our{" "}
            <Link
              href="/blog/connecting-with-base"
              style={{ color: "#00bfff" }}
            >
              hybrid architecture
            </Link>{" "}
            connecting Aleo and Base.
          </p>
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
