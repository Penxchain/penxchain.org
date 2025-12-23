/* eslint-disable react-hooks/set-state-in-effect */
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

export default function ZeroKnowledgeProofsPage() {
  const postId = 5;
  
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  useEffect(() => {
    const liked = localStorage.getItem(`blog_liked_${postId}`);
    const count = localStorage.getItem(`blog_likes_${postId}`);

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
      setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
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
            headline: "Zero-Knowledge Proofs Explained: Privacy Technology in Blockchain",
            description: "A comprehensive guide to understanding Zero-Knowledge Proofs (ZKPs), how they work, and why they're essential for privacy-powered commerce on PENXCHAIN.",
            image: "https://penxchain.org/blog-images/zkp-in-penxchain.jpg",
            author: {
              "@type": "Person",
              name: "Emmanuel Oluwafemi"
            },
            publisher: {
              "@type": "Organization",
              name: "PENXCHAIN",
              logo: {
                "@type": "ImageObject",
                url: "https://penxchain.org/img/logo.png"
              }
            },
            datePublished: "2024-11-20",
            dateModified: "2024-11-20"
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
                name: "Zero-Knowledge Proofs Explained",
                item: "https://penxchain.org/blog/zkp-penxchain",
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
            <h1>Zero-Knowledge Proofs Explained: The Technology Behind Privacy-Powered Commerce</h1>

            <p>
              <strong>Zero-Knowledge Proofs (ZKPs)</strong> are one of the most important breakthroughs in modern cryptography. They allow a user to prove something is true without revealing the underlying data. This simple idea enables private, secure, and verifiable digital interactions.
            </p>

            <p>
              Traditionally, blockchain transactions expose everything: wallet balances, transaction amounts, sender and receiver details, and full activity history. ZKPs solve this by separating verification from exposure. The blockchain can validate an action without learning anything else.
            </p>

            <div className="callout">
              <strong>In simple terms:</strong> Zero-Knowledge Proofs let you prove you know something or meet a requirement without revealing the actual information. It's like showing you're old enough to enter without showing your ID.
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
              src="/blog-images/zkp-in-penxchain.jpg"
              alt="Zero-Knowledge Proofs in blockchain - privacy technology explained"
              width={680}
              height={420}
              priority
            />
          </div>
        </motion.section>

        {/* HOW IT WORKS */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>How Zero-Knowledge Proofs Work</h2>

          <p>
            A practical example helps clarify the concept. Imagine confirming you're eligible for a service such as age verification, residency confirmation, or identity attributes without sharing your full identity document. You prove the requirement is met while your private information remains protected. That's Zero-Knowledge in action.
          </p>

          <p>
            In technical terms, ZKPs produce two key components:
          </p>

          <p>
            <strong>A proof:</strong> This demonstrates that a statement is valid without revealing the underlying data. For instance, proving you have sufficient funds for a purchase without exposing your total balance.
          </p>

          <p>
            <strong>A verifier:</strong> This is able to check the proof mathematically without accessing any sensitive data. The verifier confirms validity while respecting privacy.
          </p>

          <p>
            This makes ZKPs ideal for finance, e-commerce, and identity systems where confidentiality is critical. Instead of exposing everything to verify one thing, ZKPs allow selective disclosure with mathematical certainty.
          </p>
        </motion.section>

        {/* WHY IT MATTERS */}
        <motion.section
          className="content-section stagger show"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
        >
          <h2>Why Zero-Knowledge Proofs Matter for Blockchain</h2>

          <p>
            Public blockchains are transparent by design. Transparency ensures trust but creates major issues for real-world use:
          </p>

          <motion.ul variants={staggerContainer}>
            <motion.li variants={fadeInSlideUp}>
              <strong>Front-running:</strong> When transaction details are visible in the mempool, bad actors can exploit this information to profit at your expense by jumping ahead of your trade.
            </motion.li>

            <motion.li variants={fadeInSlideUp}>
              <strong>Business surveillance:</strong> Competitors can analyze your wallet activity, sales volume, supplier relationships, and revenue patterns simply by watching the blockchain.
            </motion.li>

            <motion.li variants={fadeInSlideUp}>
              <strong>Leaked user behavior:</strong> Every purchase, subscription, and interaction becomes permanent public record, creating massive privacy violations for consumers.
            </motion.li>

            <motion.li variants={fadeInSlideUp}>
              <strong>Exposed revenue data:</strong> Merchants operating on transparent blockchains inadvertently broadcast their earnings, customer count, and business strategy to anyone watching.
            </motion.li>

            <motion.li variants={fadeInSlideUp}>
              <strong>Compromised privacy:</strong> Users lose control over their financial information the moment they interact with public chains, making traditional e-commerce impossible.
            </motion.li>
          </motion.ul>

          <p>
            ZKPs close this gap by enabling privacy with integrity. Transactions remain verifiable and trustworthy, but the underlying details stay confidential.
          </p>
        </motion.section>

        {/* CAPABILITIES */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>What Zero-Knowledge Proofs Enable</h2>

          <p>
            With ZKPs, blockchain systems can provide capabilities previously impossible on open networks:
          </p>

          <p>
            <strong>Private transactions:</strong> Send and receive payments without exposing amounts, balances, or participants. Only the parties involved know the details.
          </p>

          <p>
            <strong>Confidential merchant data:</strong> Run an online business without revealing sales figures, customer lists, or inventory levels to competitors.
          </p>

          <p>
            <strong>Hidden order flow:</strong> Place orders, negotiate prices, and complete purchases without broadcasting your strategy to front-runners or market manipulators.
          </p>

          <p>
            <strong>Encrypted analytics:</strong> Generate business insights and reports from encrypted data without ever decrypting sensitive information.
          </p>

          <p>
            <strong>Private dispute resolution:</strong> Resolve conflicts and enforce agreements without making internal business details public.
          </p>

          <p>
            <strong>Secure identity attributes:</strong> Prove you meet requirements like age, location, or credentials without revealing your full identity.
          </p>

          <p>
            <strong>Regulatory compliance through selective disclosure:</strong> Share only the specific information regulators need without exposing everything else.
          </p>

          <p>
            This unlocks real commercial use cases previously impossible on open blockchains. Businesses can operate with the efficiency of blockchain technology while maintaining the confidentiality they need to compete.
          </p>
        </motion.section>

        {/* PENXCHAIN INTEGRATION */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>Zero-Knowledge Proofs in PENXCHAIN</h2>

          <p>
            For PENXCHAIN specifically, ZKPs are foundational to the entire ecosystem. They power every layer of the platform to ensure users and merchants maintain control of their data.
          </p>

          <p>
            <strong>Private marketplace interactions:</strong> Listings, orders, negotiations, and payments all happen with built-in privacy. Buyers and sellers interact without exposing sensitive commercial information to third parties or competitors.
          </p>

          <p>
            <strong>Confidential merchant analytics:</strong> Business owners can track performance, analyze trends, and optimize operations using encrypted data that never leaves their control.
          </p>

          <p>
            <strong>Private invoicing and settlement via PENXPAY:</strong> Generate invoices, process payments, and settle accounts with complete confidentiality. Transaction amounts and parties remain private while settlement is verifiable.
          </p>

          <p>
            <strong>Privacy-aware identity inside the Native Wallet:</strong> Users control exactly what identity information they share and with whom. Age verification, location confirmation, and credential checks happen without exposing full identity documents.
          </p>

          <p>
            <strong>Encrypted commercial logic on Aleo:</strong> Smart contracts execute business logic while keeping inputs, outputs, and state transitions completely private. Only the parties involved see the details.
          </p>

          <p>
            Every step of the commerce flow is protected by default. This is not an optional feature—privacy is the architecture.
          </p>
        </motion.section>

        {/* USER CONTROL */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>Taking Back Control of Your Data</h2>

          <p>
            ZKPs ensure that users and merchants regain control of their data. No centralized platform, third party, or observer can:
          </p>

          <p>
            Track spending habits, inspect sales volume, reverse-engineer revenue, or monitor interactions. Your financial activity is yours alone.
          </p>

          <p>
            Privacy becomes an inherent feature, not an add-on. You don't have to trust anyone to protect your data because the cryptography does it automatically.
          </p>

          <p>
            The result is a new standard for digital commerce where transactions remain verifiable, user and merchant data stays confidential, and the marketplace functions efficiently without exposure.
          </p>

          <p>
            This is the foundation of a privacy-powered digital economy. Commerce that respects your autonomy, protects your information, and preserves your freedom.
          </p>
        </motion.section>

        {/* CONCLUSION */}
        <motion.section
          className="content-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInSlideUp}
        >
          <h2>The Future of Privacy in Commerce</h2>

          <p>
            Zero-Knowledge Proofs are not just a technical upgrade—they are the key to making blockchain commercially usable, secure, and human-centered. They enable systems like PENXCHAIN to deliver real privacy, real trust, and real economic freedom.
          </p>

          <p>
            As more businesses and users demand confidentiality in their digital interactions, ZKPs will become the standard, not the exception. The question is no longer whether privacy matters, but whether platforms can deliver it without compromise.
          </p>

          <p>
            PENXCHAIN proves it's possible. Learn more about our{" "}
            <Link href="/privacy-blockchain" style={{ color: "#00bfff" }}>
              privacy-first blockchain
            </Link>
            , explore the{" "}
            <Link href="/penxchain-wallet" style={{ color: "#00bfff" }}>
              PENXCHAIN Wallet
            </Link>
            , or discover how the{" "}
            <Link href="/penxchain-marketplace" style={{ color: "#00bfff" }}>
              marketplace
            </Link>
            {" "}uses Zero-Knowledge Proofs to protect your commerce.
          </p>
        </motion.section>

        {/* FAQ SECTION */}
        <motion.section
          className="content-section faq"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInSlideUp}
        >
          <h2>Frequently Asked Questions About Zero-Knowledge Proofs</h2>

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ color: "#0ce50c", marginBottom: "0.5rem" }}>
              What is a Zero-Knowledge Proof in simple terms?
            </h3>
            <p>
              A Zero-Knowledge Proof lets you prove you know something or meet a requirement without revealing the actual information. For example, proving you're over 18 without showing your birthdate, or proving you have enough money without showing your balance.
            </p>

            <h3 style={{ color: "#0ce50c", marginBottom: "0.5rem", marginTop: "2rem" }}>
              How do Zero-Knowledge Proofs protect privacy on blockchain?
            </h3>
            <p>
              ZKPs allow blockchain networks to verify transactions are valid without exposing amounts, participants, or balances. This means you can use cryptocurrency privately, just like cash, while still maintaining the security and verifiability of blockchain.
            </p>

            <h3 style={{ color: "#0ce50c", marginBottom: "0.5rem", marginTop: "2rem" }}>
              Are Zero-Knowledge Proofs secure?
            </h3>
            <p>
              Yes. ZKPs are based on advanced mathematics and cryptography that have been rigorously tested and peer-reviewed. They provide the same level of security as other cryptographic systems used in banking, military, and government applications.
            </p>

            <h3 style={{ color: "#0ce50c", marginBottom: "0.5rem", marginTop: "2rem" }}>
              What's the difference between ZK-SNARKs and ZK-STARKs?
            </h3>
            <p>
              Both are types of Zero-Knowledge Proofs. ZK-SNARKs are smaller and faster but require a trusted setup. ZK-STARKs are larger but don't need a trusted setup and are more resistant to quantum computing attacks. PENXCHAIN uses the most appropriate ZKP technology for each use case.
            </p>

            <h3 style={{ color: "#0ce50c", marginBottom: "0.5rem", marginTop: "2rem" }}>
              Can Zero-Knowledge Proofs be used for illegal activity?
            </h3>
            <p>
              Privacy is not the same as anonymity. ZKPs protect your data from unnecessary exposure, but PENXCHAIN includes compliance features that allow selective disclosure to authorized parties when legally required. Privacy and compliance can coexist.
            </p>

            <h3 style={{ color: "#0ce50c", marginBottom: "0.5rem", marginTop: "2rem" }}>
              How does PENXCHAIN use Zero-Knowledge Proofs?
            </h3>
            <p>
              PENXCHAIN integrates ZKPs throughout the platform—in the wallet for private transactions, in the marketplace for confidential commerce, in PENXPAY for private payments, and in smart contracts for encrypted business logic. Privacy is built into every layer.
            </p>
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