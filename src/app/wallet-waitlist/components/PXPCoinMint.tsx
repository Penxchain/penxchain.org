"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PXPCoinMintProps {
  points: number;
  onComplete?: () => void;
}

export default function PXPCoinMint({ points, onComplete }: PXPCoinMintProps) {
  const [visible, setVisible] = useState(true);

  const coins = Math.min(8, Math.max(3, Math.floor(points / 50)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-64 h-64">
            {/* Core glow */}
            <div className="absolute inset-0 rounded-full bg-[#0ce50c]/20 blur-3xl" />

            {/* Coins */}
            {Array.from({ length: coins }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2"
                initial={{
                  x: 0,
                  y: -120,
                  scale: 0.6,
                  rotateY: 0,
                  opacity: 0,
                }}
                animate={{
                  x: (i - coins / 2) * 18,
                  y: 20,
                  scale: 1,
                  rotateY: 720,
                  opacity: 1,
                }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.9,
                  ease: "easeOut",
                }}
              >
                <PXPCoin />
              </motion.div>
            ))}

            {/* Amount label */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 90 }}
              transition={{ delay: 0.6 }}
              className="absolute left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-xs font-mono text-white/50 tracking-wider">
                PXP MINTED
              </p>
              <p className="text-3xl font-bold text-[#0ce50c]">
                +{points}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PXPCoin() {
  return (
    <div className="relative w-16 h-16 rounded-full">
      {/* Weight shadow */}
      <div className="absolute inset-0 rounded-full bg-black shadow-[0_16px_45px_rgba(0,0,0,0.9)]" />

      {/* Obsidian rim */}
      <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-[#05070d] to-[#01030a] border border-white/10" />

      {/* Metallic ring */}
      <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-[#0b1630] to-[#020815] border border-[#0ce50c]/20" />

      {/* Core */}
      <div className="absolute inset-[8px] rounded-full bg-gradient-to-br from-[#0a1f44] to-[#040b18] flex items-center justify-center relative">

        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-full bg-[#0ce50c]/10 blur-lg" />

        {/* Engraved PXP */}
        <span
          className="relative z-10 text-[14px] tracking-[0.35em] font-semibold text-white"
          style={{
            fontFamily: "Cinzel, serif",
            textShadow:
              "0 1px 2px rgba(0,0,0,0.9), 0 -1px 2px rgba(255,255,255,0.15)",
          }}
        >
          PXP
        </span>
      </div>
    </div>
  );
}
