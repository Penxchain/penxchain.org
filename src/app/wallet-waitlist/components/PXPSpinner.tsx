"use client";

import React from "react";
import { motion } from "framer-motion";

interface PXPSpinnerProps {
  size?: number;
  className?: string;
}

export default function PXPSpinner({
  size = 64, // Slightly larger default for better detail
  className = "",
}: PXPSpinnerProps) {
  const thickness = size * 0.12; // Realistic thickness
  const segments = 12; // Number of side panels for the cylindrical edge
  const radius = size / 2;

  // Penxchain Branding Colors
  const brandBlue = "#2547D0";
  const darkNavy = "#0A0A0B";
  const highlight = "#4F6EF7";

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 1000,
      }}
    >
      {/* AMBIENT SHADOW ON FLOOR */}
      <div 
        className="absolute bottom-[-10%] w-[80%] h-[10%] bg-black/40 blur-lg rounded-[100%]" 
        style={{ transform: 'rotateX(90deg)' }}
      />

      {/* COIN CONTAINER */}
      <motion.div
        animate={{
          rotateY: [0, 360],
          y: [0, -4, 0], // Subtle hover bounce
        }}
        transition={{
          rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden border border-white/10"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${highlight}, ${brandBlue} 60%, ${darkNavy})`,
            transform: `translateZ(${thickness / 2}px)`,
            backfaceVisibility: "hidden",
          }}
        >
          {/* Shine Sweep Effect */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] blur-md"
          />
          
          <span
            className="font-black tracking-tighter select-none"
            style={{
              fontSize: size * 0.25,
              color: "#FFFFFF",
              textShadow: "0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(79,110,247,0.5)",
            }}
          >
            PXP
          </span>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center border border-white/5"
          style={{
            background: `radial-gradient(circle at 70% 70%, ${brandBlue}, ${darkNavy} 80%)`,
            transform: `rotateY(180deg) translateZ(${thickness / 2}px)`,
            backfaceVisibility: "hidden",
          }}
        >
          {/* Logo or secondary symbol on back */}
          <div className="w-1/2 h-1/2 rounded-full border-2 border-white/10 flex items-center justify-center">
            <div className="w-2 h-2 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* CYLINDRICAL EDGE (Milled Metal Effect) */}
        {[...Array(segments)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-brand-blue"
            style={{
              width: (Math.PI * size) / segments + 1, // Add 1px overlap to prevent gaps
              height: thickness,
              left: "50%",
              top: "50%",
              backgroundColor: i % 2 === 0 ? brandBlue : highlight, // Creates the "milled" ridges look
              backgroundImage: `linear-gradient(to bottom, ${darkNavy}, ${brandBlue}, ${darkNavy})`,
              transform: `
                translate(-50%, -50%) 
                rotateY(${(360 / segments) * i}deg) 
                translateZ(${radius - 1}px) 
                rotateX(90deg)
              `,
            }}
          />
        ))}
      </motion.div>

      {/* REACTIVE GLOW */}
      <div
        className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          width: size * 2,
          height: size * 2,
          background: `radial-gradient(circle, ${brandBlue}, transparent 70%)`,
        }}
      />
    </div>
  );
}