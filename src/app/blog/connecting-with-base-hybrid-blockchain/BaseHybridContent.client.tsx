"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Lightbulb, Shield, Zap, ArrowRight, Link2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShareButtons from "@/components/ShareButtons";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

// Three.js Particle Network Component
function ParticleNetwork() {
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const particleCount = typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 60;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 15;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      // Mix of green (Aleo) and blue (Base) colors
      const isGreen = Math.random() > 0.5;
      if (isGreen) {
        colors[i3] = 0.047; // R for #0ce50c
        colors[i3 + 1] = 0.898; // G
        colors[i3 + 2] = 0.047; // B
      } else {
        colors[i3] = 0; // R for #0052ff
        colors[i3 + 1] = 0.322; // G
        colors[i3 + 2] = 1; // B
      }
    }

    return { positions, velocities, colors };
  }, [particleCount]);

  useFrame(() => {
    if (meshRef.current && linesRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = particles.velocities;

      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Bounce off boundaries
        if (Math.abs(positions[i3]) > 10) velocities[i3] *= -1;
        if (Math.abs(positions[i3 + 1]) > 7.5) velocities[i3 + 1] *= -1;
        if (Math.abs(positions[i3 + 2]) > 5) velocities[i3 + 2] *= -1;
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true;

      // Draw connections between nearby particles
      const linePositions: number[] = [];
      const maxDistance = 3;

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const i3 = i * 3;
          const j3 = j * 3;
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxDistance) {
            linePositions.push(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            linePositions.push(positions[j3], positions[j3 + 1], positions[j3 + 2]);
          }
        }
      }

      linesRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(linePositions), 3)
      );
    }
  });

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} vertexColors transparent opacity={0.8} />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.2} />
      </lineSegments>
    </>
  );
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

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

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

  // GSAP Scroll Animations
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          gsap.from(section, {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
            delay: index * 0.1,
          });
        }
      });
    });

    return () => ctx.revert();
  }, [isMounted]);

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
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Three.js Background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ParticleNetwork />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-950 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header Navigation */}
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-4 flex justify-between items-center">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300 font-semibold px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <ShareButtons title={postTitle} slug={postSlug} />
        </div>

        {/* SEO Schema */}
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
                  url: "https://penxchain.org/icon.jpeg",
                },
              },
              datePublished: "2025-11-25",
            }),
          }}
        />

        <article className="max-w-5xl mx-auto px-6 py-12 space-y-24">
          {/* Hero Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInSlideUp}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Connecting with Base: The Hybrid Approach
              </h1>

              <p className="text-xl text-white/70 leading-relaxed">
                <strong className="text-white/90">PENXCHAIN is built hybrid by design.</strong>
              </p>

              <p className="text-lg text-white/60 leading-relaxed">
                We build our core products on <strong className="text-emerald-400">Aleo</strong> using
                zero-knowledge (ZK) technology to deliver privacy-first execution
                for payments, commerce, and identity.
              </p>

              <p className="text-lg text-white/60 leading-relaxed">
                We deploy the <strong className="text-blue-400">$PENX token on Base</strong> for liquidity,
                distribution, composability, and access to a larger market.
              </p>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-black to-blue-500/10 border border-blue-500/20 backdrop-blur-xl">
                <p className="text-white/80 leading-relaxed">
                  Aleo handles private execution. Base handles liquidity and
                  settlement. This structure lets us scale real-world privacy
                  without sacrificing adoption.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-900 via-blue-400 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm bg-white/5">
                <Image
                  src="/blog-images/base-hybrid.jpg"
                  alt="PENXCHAIN hybrid architecture with Aleo and Base"
                  width={680}
                  height={420}
                  priority
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.section>

          {/* Why Hybrid Architecture */}
          <section
            ref={(el) => {
              sectionsRef.current[0] = el;
            }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Why Hybrid Architecture?
            </h2>

            <p className="text-lg text-white/70 leading-relaxed">
              Most blockchain projects force a choice: either prioritize privacy
              and limit adoption, or maximize liquidity and sacrifice user
              protection.
            </p>

            <p className="text-lg text-white/70 leading-relaxed">
              PENXCHAIN refuses that trade-off. By combining the strengths of two
              specialized chains, we deliver both privacy and scale.
            </p>

            <p className="text-lg text-white/70 leading-relaxed">
              This is not a compromise. It is an intentional design decision that
              acknowledges the different needs of private execution versus public
              liquidity.
            </p>
          </section>

          {/* Two-Layer System */}
          <section
            ref={(el) => {
              sectionsRef.current[1] = el;
            }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
              The Two-Layer System
            </h2>

            <div className="grid md:grid-cols-2 gap-8 relative">
              {/* Connection Line (Desktop only) */}
              <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 z-0">
                <div className="w-full h-full bg-gradient-to-r from-emerald-500 via-purple-500 to-blue-500 animate-pulse" />
              </div>

              {/* Aleo Layer */}
              <motion.div
                variants={fadeInSlideUp}
                className="relative group p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="absolute -top-4 -right-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>

                <h3 className="text-3xl font-bold text-emerald-400 mb-6">
                  Layer 1: Aleo (Privacy)
                </h3>

                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3 text-white/70">
                    <ArrowRight className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Zero-knowledge proof execution</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <ArrowRight className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Private payments and transactions</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <ArrowRight className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Confidential commerce infrastructure</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <ArrowRight className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Encrypted identity management</span>
                  </li>
                </ul>

                <p className="text-sm text-white/50">
                  <strong className="text-white/70">Purpose:</strong> Protect user data and transaction privacy
                </p>
              </motion.div>

              {/* Base Layer */}
              <motion.div
                variants={fadeInSlideUp}
                className="relative group p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="absolute -top-4 -right-4 p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>

                <h3 className="text-3xl font-bold text-blue-400 mb-6">
                  Layer 2: Base (Liquidity)
                </h3>

                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3 text-white/70">
                    <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <span>$PENX token distribution</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <span>DeFi integration and composability</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <span>Broader market access</span>
                  </li>
                  <li className="flex items-start gap-3 text-white/70">
                    <ArrowRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <span>Fast, low-cost settlements</span>
                  </li>
                </ul>

                <p className="text-sm text-white/50">
                  <strong className="text-white/70">Purpose:</strong> Enable adoption and liquidity at scale
                </p>
              </motion.div>
            </div>
          </section>

          {/* How It Works in Practice */}
          <section
            ref={(el) => {
              sectionsRef.current[2] = el;
            }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              How It Works in Practice
            </h2>

            <p className="text-lg text-white/70 leading-relaxed">
              When you use PENXCHAIN, the system routes your activity to the right
              layer automatically:
            </p>

            <ul className="space-y-6">
              <li className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <ArrowRight className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-white/90 text-lg">Making a private payment?</strong>
                  <p className="text-white/60 mt-2">
                    Your transaction is processed on Aleo with full ZK encryption. Nobody can see who you
                    paid, how much you sent, or what your balance is.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <ArrowRight className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-white/90 text-lg">Trading $PENX tokens?</strong>
                  <p className="text-white/60 mt-2">
                    The transaction happens on Base, where you benefit from deep liquidity, fast confirmations,
                    and integration with the broader DeFi ecosystem.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <ArrowRight className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-white/90 text-lg">Shopping on the marketplace?</strong>
                  <p className="text-white/60 mt-2">
                    The payment is private (Aleo), but the token movement for rewards or settlements
                    happens on Base when needed.
                  </p>
                </div>
              </li>
            </ul>

            <p className="text-lg text-white/70 leading-relaxed">
              You do not have to think about which chain you are using. The
              interface handles routing behind the scenes, giving you a seamless
              experience.
            </p>
          </section>

          {/* Why Base Specifically */}
          <section
            ref={(el) => {
              sectionsRef.current[3] = el;
            }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Why Base Specifically?
            </h2>

            <p className="text-lg text-white/70 leading-relaxed">
              Base is an Ethereum Layer 2 built by Coinbase. It is optimized for
              speed, low fees, and Ethereum compatibility. More importantly, it
              has rapidly become one of the most active chains for real users and
              real applications.
            </p>

            <p className="text-lg text-white/70 leading-relaxed">
              Here is why it fits PENXCHAIN:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h4 className="text-lg font-bold text-white mb-2">High liquidity</h4>
                <p className="text-white/60 text-sm">
                  Base has strong DeFi integration, making it easy to trade, swap, and provide liquidity for $PENX.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h4 className="text-lg font-bold text-white mb-2">Low fees</h4>
                <p className="text-white/60 text-sm">
                  Transaction costs are a fraction of Ethereum mainnet, making small payments practical.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h4 className="text-lg font-bold text-white mb-2">Ecosystem growth</h4>
                <p className="text-white/60 text-sm">
                  Base is attracting developers and users focused on real-world utility, not just speculation.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h4 className="text-lg font-bold text-white mb-2">Composability</h4>
                <p className="text-white/60 text-sm">
                  Being EVM-compatible means $PENX can interact with hundreds of existing protocols.
                </p>
              </div>
            </div>
          </section>

          {/* Strategic Advantage */}
          <section
            ref={(el) => {
              sectionsRef.current[4] = el;
            }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              The Strategic Advantage
            </h2>

            <p className="text-lg text-white/70 leading-relaxed">
              By splitting responsibilities between Aleo and Base, PENXCHAIN gains
              advantages that single-chain projects cannot match:
            </p>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Best-in-Class Technology for Each Use Case
                </h3>
                <p className="text-white/70">
                  Aleo is purpose-built for privacy. Base is purpose-built for
                  liquidity. We use each chain for what it does best.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Reduced Risk
                </h3>
                <p className="text-white/70">
                  If one chain faces congestion, regulatory pressure, or technical
                  issues, the other continues operating. The system is resilient by
                  design.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Flexibility for Future Growth
                </h3>
                <p className="text-white/70">
                  As the ecosystem evolves, we can integrate additional chains or
                  protocols without rebuilding from scratch. The hybrid model is
                  future-proof.
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section
            ref={(el) => {
              sectionsRef.current[5] = el;
            }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Hybrid Is Not a Trend. It Is How PENXCHAIN Grows.
            </h2>

            <p className="text-lg text-white/70 leading-relaxed">
              Privacy and adoption are not opposing forces. They are complementary
              goals that require the right infrastructure.
            </p>

            <p className="text-lg text-white/70 leading-relaxed">
              By building on Aleo for privacy and Base for liquidity, PENXCHAIN
              creates a system that serves both users who need protection and
              users who need access.
            </p>

            <p className="text-lg text-white/70 leading-relaxed">
              This is not a temporary strategy. It is the foundation of how
              PENXCHAIN scales globally without compromising its core values.
            </p>

            <p className="text-xl font-bold text-white">
              Privacy-first. Liquidity-ready. Built to last.
            </p>
          </section>

          {/* Like & Share Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInSlideUp}
            className="max-w-2xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                <Lightbulb className="w-12 h-12 text-purple-400" />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-white">
              Enjoyed this architectural deep-dive?
            </h3>

            <p className="text-white/60 max-w-md mx-auto leading-relaxed">
              Knowledge is the only asset that grows when shared. Help us
              enlighten the community by sharing this hybrid vision with your
              network.
            </p>

            <div className="space-y-6">
              {/* Like Button */}
              <div className="relative inline-block">
                <motion.button
                  onClick={handleLike}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all ${
                    isLiked
                      ? "bg-gradient-to-r from-pink-500/20 to-red-500/20 border-2 border-pink-500/50 text-pink-400"
                      : "bg-white/5 border-2 border-white/20 text-white/70 hover:border-pink-500/50 hover:text-pink-400"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="w-6 h-6"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {isLiked ? `Loved by ${likeCount}` : "Appreciate Article"}
                </motion.button>

                {/* Heart Animation */}
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
                      className="absolute top-0 left-1/2 pointer-events-none z-50"
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

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Share Section */}
              <div className="flex flex-col items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Spread the Vision
                </span>
                <ShareButtons title={postTitle} slug={postSlug} />
              </div>
            </div>
          </motion.div>
        </article>
      </div>
    </main>
  );
}