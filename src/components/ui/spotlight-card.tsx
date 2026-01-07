"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";

export default function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      // THE NEW GRADIENT: from-[#0D0B24] to-[#3C3970]
      className={`relative overflow-hidden rounded-3xl border border-white/10
bg-[#010238b4]
before:absolute before:inset-0
before:bg-[radial-gradient(circle_at_bottom_right,rgba(60,57,112,0.45),transparent_50%)]
after:absolute after:inset-0
after:bg-[radial-gradient(circle_at_100%_50%,rgba(255,255,255,0.35),transparent_40%)]
transition-all hover:border-white/30
${className}`}
    >
      {/* 1. THE STATIC TOP-RIGHT FLASHLIGHT 
          This creates that permanent light source you asked for.
      */}
      <div
        className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"
        aria-hidden="true"
      />

      {/* 2. THE MOUSE SPOTLIGHT (Interactive) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(100, 150, 255, 0.15), transparent 40%)`,
        }}
      />

      {/* Content Container */}
      <div className="relative h-full z-20">{children}</div>
    </div>
  );
}
