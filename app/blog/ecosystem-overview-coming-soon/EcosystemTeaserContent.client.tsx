/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
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

const pulseAnimation: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
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

export default function EcosystemTeaserPage() {
  const postId = 8;

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
              "PENXCHAIN Ecosystem Overview Coming Soon: The Future of Privacy-Powered Commerce",
            description:
              "Stay tuned for PENXCHAIN's full ecosystem overview revealing how Base and Aleo integration enables what many thought impossible—true privacy at scale.",
            image: "https://penxchain.org/blog-images/ecosystem-teaser.jpg",
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
            datePublished: "2024-12-20",
            dateModified: "2024-12-20",
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
                name: "Ecosystem Overview Coming Soon",
                item: "https://penxchain.org/blog/ecosystem-overview-coming-soon",
              },
            ],
          }),
        }}
      />

      <article>
        {/* HERO SECTION WITH CENTERED BADGE */}
        <motion.section
          className="article-hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInSlideUp}
          style={{ textAlign: "center", paddingBottom: "1rem" }}
        >
          <motion.div
            variants={pulseAnimation}
            style={{
              display: "inline-block",
              padding: "0.5rem 1.5rem",
              background: "rgba(12, 229, 12, 0.1)",
              border: "2px solid #0ce50c",
              borderRadius: "50px",
              color: "#0ce50c",
              fontWeight: "700",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "2rem",
            }}
          >
            Coming Soon
          </motion.div>

          <div className="hero-text">
            <h1>The Full PENXCHAIN Ecosystem Overview Is Almost Here</h1>

            <p style={{ fontSize: "1.2rem", marginTop: "1.5rem" }}>
              <strong>We're revealing everything.</strong>
            </p>

            <p>
              In the coming days, we will release a comprehensive overview of
              the PENXCHAIN ecosystem—the complete architecture, product suite,
              technical infrastructure, and strategic vision that makes private,
              scalable commerce possible.
            </p>

            <p>
              This is the deep dive that explains how we're building what many
              considered too difficult to achieve.
            </p>
          </div>
        </motion.section>

        {/* IMAGE CENTERED FULL WIDTH */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInSlideUp}
          style={{
            maxWidth: "100%",
            margin: "3rem 0",
            padding: "0",
          }}
        >
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
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <Image
              src="/blog-images/ecosystem-teaser.jpg"
              alt="PENXCHAIN ecosystem overview coming soon"
              width={1200}
              height={600}
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </motion.section>

        {/* WHAT TO EXPECT */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}
        >
          <h2>What to Expect</h2>

          <p>
            This overview will help users, communities, and brands understand
            why we chose the hybrid possibilities of Base and Aleo—and how this
            architecture enables capabilities that single-chain solutions cannot
            deliver.
          </p>

          <div
            style={{
              marginTop: "2rem",
              padding: "2rem",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h3 style={{ color: "#0ce50c", marginBottom: "1rem" }}>
              The ecosystem overview will cover:
            </h3>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Product Architecture:</strong> How PENXCHAIN Wallet,
              PENXPAY, and the Marketplace work together as a unified system
              rather than isolated applications.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Hybrid Infrastructure:</strong> The technical design that
              connects Aleo's zero-knowledge privacy with Base's liquidity, and
              why both chains are essential to the vision.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Privacy Technology:</strong> Deep dive into how
              zero-knowledge proofs protect users and merchants without
              sacrificing verifiability or functionality.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Token Economics:</strong> The role of $PENX in the
              ecosystem, distribution strategy, utility across products, and
              long-term value capture.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Market Positioning:</strong> Why PENXCHAIN is uniquely
              positioned to capture the privacy-powered commerce market that
              other platforms cannot serve.
            </p>

            <p>
              <strong>Roadmap and Vision:</strong> Where we are now, what's
              coming next, and the long-term strategy for scaling private
              digital commerce globally.
            </p>
          </div>

          <p style={{ marginTop: "2rem" }}>
            This is not marketing material. This is the blueprint for how
            PENXCHAIN delivers on the promise of private, accessible, and
            functional blockchain commerce.
          </p>
        </motion.section>

        {/* WHY HYBRID */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}
        >
          <h2>Why Hybrid Was Necessary</h2>

          <p>
            Many teams have attempted to build privacy-first commerce. Most
            failed because they chose a single chain and forced it to do
            everything—sacrificing either privacy, liquidity, usability, or
            scalability in the process.
          </p>

          <p>
            PENXCHAIN recognized early that no single blockchain could deliver
            everything users need. Privacy chains offer confidentiality but
            struggle with adoption. Public chains offer liquidity but expose
            everything.
          </p>

          <p>
            The hybrid model solves this by using each chain for what it does
            best. Aleo provides zero-knowledge infrastructure for private
            execution. Base provides liquidity, composability, and market
            access. Together, they enable what neither can achieve alone.
          </p>

          <p>
            The upcoming overview will explain this architecture in detail,
            showing exactly how PENXCHAIN routes operations across chains,
            maintains security, and abstracts complexity for users.
          </p>
        </motion.section>

        {/* ACKNOWLEDGMENTS */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}
        >
          <h2>Building on the Shoulders of Giants</h2>

          <p>
            PENXCHAIN exists because of the groundbreaking work done by teams at
            Base and Aleo. Their technical innovations made it possible for us
            to build what we're building.
          </p>

          <div
            style={{
              marginTop: "2rem",
              padding: "2rem",
              background: "rgba(12, 229, 12, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(12, 229, 12, 0.2)",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              <strong>Thank you to Jesse Pollak and the Base team</strong> for
              building a Layer 2 that prioritizes usability, developer
              experience, and real-world adoption. Base's infrastructure gives
              $PENX the liquidity and composability necessary to reach
              mainstream users.
            </p>

            <p>
              <strong>Thank you to Howard Wu and the Aleo team</strong> for
              pioneering zero-knowledge technology that makes privacy practical
              at scale. Aleo's architecture is the foundation of PENXCHAIN's
              private execution layer.
            </p>
          </div>

          <p style={{ marginTop: "2rem" }}>
            Without their work, PENXCHAIN would not be possible. The hybrid
            model we're building stands on the technical achievements they've
            delivered to the blockchain ecosystem.
          </p>
        </motion.section>

        {/* WHAT COMES NEXT */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
          style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}
        >
          <h2>What Comes Next</h2>

          <p>
            The full ecosystem overview will be released in the coming days. It
            will answer the questions we've been asked repeatedly: How does
            PENXCHAIN work? Why hybrid? What's the roadmap? How does $PENX fit
            into the ecosystem?
          </p>

          <p>
            This is the document that users, communities, brands, developers,
            and partners have been waiting for. It's comprehensive, technical,
            and honest—no hype, just the architecture and strategy that makes
            PENXCHAIN viable.
          </p>

          <div className="callout" style={{ marginTop: "2rem" }}>
            <strong>Stay tuned.</strong> Follow our social channels, join the
            community, and watch for the announcement. The full ecosystem
            overview is almost here.
          </div>

          <p style={{ marginTop: "2rem" }}>
            In the meantime, explore how PENXCHAIN is already operational. Try
            the{" "}
            <Link href="/penxchain-wallet" style={{ color: "#00bfff" }}>
              PENXCHAIN Wallet
            </Link>
            , make private payments with{" "}
            <Link href="/" style={{ color: "#00bfff" }}>
              PENXPAY
            </Link>
            , browse the{" "}
            <Link href="/penxchain-marketplace" style={{ color: "#00bfff" }}>
              marketplace
            </Link>
            , or read about our{" "}
            <Link
              href="/blog/connecting-with-base-hybrid-blockchain"
              style={{ color: "#00bfff" }}
            >
              hybrid architecture
            </Link>{" "}
            and{" "}
            <Link
              href="/blog/zkp-penxchain"
              style={{ color: "#00bfff" }}
            >
              zero-knowledge technology
            </Link>
            .
          </p>

          <p>
            PENXCHAIN is not coming. It's here. The ecosystem overview will show
            you how all the pieces fit together.
          </p>
        </motion.section>

        {/* CTA BOX */}
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
                "linear-gradient(135deg, rgba(12, 229, 12, 0.1), rgba(0, 191, 255, 0.1))",
              borderRadius: "16px",
              border: "2px solid rgba(12, 200, 12, 0.3)",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "#0ce50c",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Be the First to Know
            </h3>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              The full ecosystem overview is coming. Don't miss it.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://twitter.com/PENXCHAIN_"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.75rem 2rem",
                  background: "green",
                  color: "#000",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0af00a";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "green";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Follow on Twitter
              </a>
              <a
                href="https://t.me/PENXCHAIN"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.75rem 2rem",
                  background: "transparent",
                  color: "#fff",
                  border: "2px solid green",
                  borderRadius: "50px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(12, 229, 12, 0.1)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Join Telegram
              </a>
            </div>
          </div>
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
