"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate, AnimationPlaybackControls } from "framer-motion";

const partners = [
  { name: "Aleo", logo: "/partners/aleo.png" },
  { name: "Base", logo: "/partners/base.png" },
  { name: "Crypt Funding Labs", logo: "/partners/crypt-funding-labs.jpeg" },
  { name: "Cryptorsy", logo: "/partners/cryptorsy.jpeg" },
  { name: "Finceptor", logo: "/partners/finceptor.jpeg" },
  { name: "LBank Exchange", logo: "/partners/lbank-exchange.jpg" },
  { name: "Peanut Trade", logo: "/partners/peanut-trade.jpeg" },
];

export default function Partners() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  // We render two identical rails
  const railA = useMemo(() => partners, []);
  const railB = useMemo(() => partners, []);

  // Measure width of one rail to animate exactly -thatWidth
  const railRef = useRef<HTMLDivElement | null>(null);
  const [railWidth, setRailWidth] = useState(0);

  const measure = () => {
    if (!railRef.current) return;
    setRailWidth(railRef.current.scrollWidth);
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    // Fonts/images can affect layout; measure again after a tick
    const t = window.setTimeout(measure, 250);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, []);

  // === Marquee animation with pause/resume ===
  const duration = 40;

  const x = useMotionValue(0);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);

  const isPausedRef = useRef(false);
  const pauseTimerRef = useRef<number | null>(null);

  const startMarquee = React.useCallback(() => {
    if (!railWidth) return;

    // Stop any existing animation to avoid stacking
    controlsRef.current?.stop();

    // Normalize x into [-railWidth, 0] range so we never drift
    const current = x.get();
    let normalized = current;
    while (normalized <= -railWidth) normalized += railWidth;
    while (normalized > 0) normalized -= railWidth;
    x.set(normalized);

    // Distance remaining until we hit -railWidth
    const remaining = railWidth + normalized; // because normalized is negative or 0
    const speed = railWidth / duration; // px per sec
    const remainingDuration = remaining / speed;

    // Animate to -railWidth then loop
    controlsRef.current = animate(x, [-Math.abs(normalized), -railWidth], {
      duration: remainingDuration,
      ease: "linear",
      onComplete: () => {
        // Jump to 0 (visually seamless because Rail B is identical)
        x.set(0);

        // Start the infinite loop 0 -> -railWidth
        controlsRef.current = animate(x, [0, -railWidth], {
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        });
      },
    });
  }, [duration, railWidth, x]);

  const pauseFor5sOrToggleResume = React.useCallback(() => {
    // If currently paused and user clicks again before 5s: resume immediately
    if (isPausedRef.current) {
      isPausedRef.current = false;

      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }

      startMarquee();
      return;
    }

    // Otherwise: pause now for 5 seconds
    isPausedRef.current = true;
    controlsRef.current?.stop();

    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
      startMarquee();
      pauseTimerRef.current = null;
    }, 5000);
  }, [startMarquee]);

  // Start marquee whenever width is ready
  useEffect(() => {
    if (!railWidth) return;
    if (isPausedRef.current) return;
    startMarquee();

    return () => {
      controlsRef.current?.stop();
    };
  }, [railWidth, startMarquee]);

  // Auto-hide clicked tooltip after 3 seconds (your original)
  useEffect(() => {
    if (clickedIndex !== null) {
      const timer = setTimeout(() => setClickedIndex(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [clickedIndex]);

  // Cleanup pause timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#020202] overflow-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap");

        .partner-mono {
          font-family: "JetBrains Mono", monospace;
        }

        .circuit-bg {
          background-image: linear-gradient(rgba(37, 71, 208, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 71, 208, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .partner-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(37, 71, 208, 0.08) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 8s linear infinite;
        }
      `}</style>

      {/* Circuit pattern background */}
      <div className="absolute inset-0 circuit-bg opacity-30" />

      {/* Radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2547D0]/5 rounded-full blur-[120px]" />

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12 md:mb-16">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-1 h-5 bg-gradient-to-b from-[#2547D0] to-transparent rounded-full" />
            <span className="partner-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase font-medium">
              Network
            </span>
            <div className="w-1 h-5 bg-gradient-to-b from-transparent to-[#2547D0] rounded-full" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-space"
          >
            <span className="text-white">Strategic </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500">
              Partnerships
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="partner-mono text-xs text-zinc-600 mt-3 max-w-xl"
          >
            Building the future of privacy-first blockchain with industry leaders
          </motion.p>
        </div>
      </div>

      {/* Infinite Scroll */}
      <div className="relative">
        {/* Left gradient mask */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 md:w-48 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, #020202 0%, transparent 100%)",
          }}
        />

        {/* Right gradient mask */}
        <div
          className="absolute right-0 top-0 bottom-0 w-32 md:w-48 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(270deg, #020202 0%, transparent 100%)",
          }}
        />

        {/* Marquee viewport */}
        <div className="overflow-hidden">
          {/* Track: contains Rail A + Rail B */}
          <motion.div
            className="flex w-max"
            style={{ x }}
          >
            {/* Rail A (measured) */}
            <div
              ref={railRef}
              className="flex gap-6 md:gap-8 items-center py-8 pr-6 md:pr-8"
            >
              {railA.map((partner, idx) => {
                const keyIndex = idx;
                return (
                  <PartnerCard
                    key={`a-${partner.name}-${idx}`}
                    partner={partner}
                    index={keyIndex}
                    isActive={hoveredIndex === keyIndex || clickedIndex === keyIndex}
                    onHover={() => setHoveredIndex(keyIndex)}
                    onLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      setClickedIndex(keyIndex);
                      pauseFor5sOrToggleResume();
                    }}
                  />
                );
              })}
            </div>

            {/* Rail B (clone) */}
            <div className="flex gap-6 md:gap-8 items-center py-8">
              {railB.map((partner, idx) => {
                const keyIndex = idx + partners.length;
                return (
                  <PartnerCard
                    key={`b-${partner.name}-${idx}`}
                    partner={partner}
                    index={keyIndex}
                    isActive={hoveredIndex === keyIndex || clickedIndex === keyIndex}
                    onHover={() => setHoveredIndex(keyIndex)}
                    onLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      setClickedIndex(keyIndex);
                      pauseFor5sOrToggleResume();
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="relative max-w-7xl mx-auto px-6 mt-12">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>
    </section>
  );
}

function PartnerCard({
  partner,
  index,
  isActive,
  onHover,
  onLeave,
  onClick,
}: {
  partner: { name: string; logo: string };
  index: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  const initials = React.useMemo(() => {
    const parts = partner.name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "P";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase();
  }, [partner.name]);

  return (
    <motion.div
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      onClick={onClick}
      className="relative flex-shrink-0 group cursor-pointer select-none"
      style={{ width: "200px" }}
    >
      {/* Glow effect on active */}
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-4 bg-[#2547D0]/10 rounded-2xl blur-xl"
      />

      {/* Main card */}
      <motion.div
        animate={{
          y: isActive ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative h-24 rounded-xl overflow-hidden border bg-black/20"
        style={{
          borderColor: isActive ? "rgba(37, 71, 208, 0.3)" : "rgba(161, 161, 170, 0.15)",
          boxShadow: isActive
            ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
            : "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Shimmer effect */}
        {isActive && <div className="absolute inset-0 partner-shimmer" />}

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-zinc-700/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-zinc-700/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-zinc-700/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-zinc-700/40" />

        {/* Logo container */}
        <div className="relative w-full h-full flex items-center justify-center p-3">
          {!imgError ? (
            <motion.div
              animate={{
                filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                opacity: isActive ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
                sizes="200px"
                placeholder="empty"
                onError={() => setImgError(true)}
                priority={index < 3}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800/60 bg-zinc-950/40">
                <span className="partner-mono text-sm font-semibold text-white tracking-wider">
                  {initials}
                </span>
                <span className="partner-mono text-[10px] text-zinc-400 tracking-wider">
                  logo
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scan line effect */}
        {isActive && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "200%" }}
            transition={{
              duration: 1.7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-x-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(37, 71, 208, 0.12) 50%, transparent 100%)",
              filter: "blur(8px)",
            }}
          />
        )}
      </motion.div>

      {/* Partner name tooltip */}
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 10,
        }}
        transition={{ duration: 0.2 }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-30"
      >
        <div className="px-3 py-1.5 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800/60 rounded-lg shadow-xl">
          <span className="partner-mono text-[10px] text-white font-medium tracking-wider">
            {partner.name}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
