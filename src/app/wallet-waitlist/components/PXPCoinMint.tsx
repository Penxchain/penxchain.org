"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface PXPEarnedAnimationProps {
  points: number;
  onComplete?: () => void;
  trigger: boolean;
}

// --- REALISTIC 3D COIN COMPONENT ---
// We build a cylinder using layers to simulate thickness without lagging the browser.
const PXPCoin = ({ delay = 0, x = "50%" }) => {
  return (
    <motion.div
      initial={{ y: -600, x, opacity: 0, rotateY: 0, rotateX: 0, scale: 0.5 }}
      animate={{ 
        y: [null, 100, 1200], // Physics drop
        opacity: [0, 1, 1, 0],
        rotateY: [0, 1080, 2160], // High speed spin
        rotateX: [0, 45, 180], // Slight wobble for realism
        scale: [0.5, 1.1, 1], // Impact squash/stretch feel
      }}
      transition={{ 
        duration: 2.5, 
        delay, 
        ease: "easeInOut",
        times: [0, 0.6, 1] // Gravity curve
      }}
      className="absolute z-[210]"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div className="relative w-24 h-24 preserve-3d">
        {/* Front Face */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FBF5B7] to-[#AA771C] border-[2px] border-[#FFFFE0] shadow-lg flex items-center justify-center backface-hidden z-10">
          <div className="absolute inset-1 rounded-full border border-[#B8860B]/30 dashed" />
          <span className="text-[#783C00] font-black text-2xl tracking-tight drop-shadow-sm font-serif">
            PXP
          </span>
          {/* Metallic Shine Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent w-full h-full" />
        </div>

        {/* Thickness/Edge (The "Side" of the coin) */}
        {/* We stack a few layers behind to simulate 3D thickness cheaply */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full bg-[#B8860B]"
            style={{ transform: `translateZ(-${i * 1.5}px)` }}
          />
        ))}

        {/* Back Face */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#AA771C] to-[#FFD700] border-[2px] border-[#FFFFE0] flex items-center justify-center backface-hidden"
          style={{ transform: "rotateY(180deg) translateZ(-10px)" }}
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
             <span className="text-[#5C2E00] font-bold text-lg">PENX</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PXPEarnedAnimation({ points, onComplete, trigger }: PXPEarnedAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger && points > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [trigger, points, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none overflow-hidden font-sans">
          
          {/* 1. HEAVENLY LIGHT BEAM */}
          {/* This is the "Dropped from Heaven" ray. Soft, ethereal, high-end. */}
          <motion.div
            initial={{ opacity: 0, height: "0%" }}
            animate={{ opacity: [0, 0.6, 0], height: ["0%", "150%", "150%"] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 w-[400px] bg-gradient-to-b from-white via-indigo-200/30 to-transparent blur-3xl"
          />

          {/* 2. THE PREMIUM REWARD BOX */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scale: 1.1, opacity: 0, y: -20, filter: "blur(20px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative z-[220] p-[1px] rounded-3xl bg-gradient-to-b from-white/60 to-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]"
          >
            {/* The Glass Container */}
            <div className="relative px-12 py-10 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-inner overflow-hidden flex flex-col items-center gap-4">
              
              {/* Shimmer Effect on Box */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
              />

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/50 shadow-sm">
                 
                 <span className="text-[10px] font-bold tracking-widest text-indigo-900 uppercase">PXP Reward</span>
              </div>

              <div className="text-center relative">
                 <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-indigo-900 to-indigo-600 drop-shadow-sm tracking-tighter">
                   +{points}
                 </h2>
                 <p className="text-sm font-semibold text-indigo-900/60 mt-1">PXP Token Received</p>
              </div>

              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-indigo-300 via-indigo-500 to-indigo-300 rounded-full w-full" 
              />
            </div>
          </motion.div>

          {/* 3. FALLING 3D COINS */}
          {/* We generate more coins for a richer feel, with randomized X positions */}
          {[...Array(12)].map((_, i) => (
            <PXPCoin 
                key={i} 
                delay={i * 0.1} // Staggered drop
                x={`${30 + Math.random() * 40}vw`} // Random spread near center
            />
          ))}

        </motion.div>
      )}
    </AnimatePresence>
  );
}