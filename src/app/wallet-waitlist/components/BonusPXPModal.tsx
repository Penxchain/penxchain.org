"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface BonusPXPModalProps {
  amount: number;
  onClose: () => void;
  nextAvailableIn?: number; // hours
}

export default function BonusPXPModal({ amount, onClose, nextAvailableIn = 24 }: BonusPXPModalProps) {
  
  // Auto-close timer with a slightly longer duration to enjoy the animation
  useEffect(() => {
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      >
        {/* 1. The Backdrop - Dark & blurred, but with a spotlight effect */}
        <div 
            className="absolute inset-0 bg-[#020202]/80 backdrop-blur-xl" 
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.2)_0%,transparent_70%)]" />
        </div>

        {/* 2. The Main Card */}
        <motion.div
          initial={{ scale: 0.5, y: 100, rotateX: 20 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            mass: 0.8 
          }}
          className="relative w-full max-w-sm group cursor-pointer"
          onClick={onClose}
        >
            {/* The "Glow" behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-[2rem] blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            
            {/* The Card Container */}
            <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0a0a0a] shadow-2xl">
                
                {/* Background Noise/Grid Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Cyber Corner Accents */}
                <div className="absolute top-4 left-4 w-2 h-2 border-l border-t border-white/40" />
                <div className="absolute top-4 right-4 w-2 h-2 border-r border-t border-white/40" />
                <div className="absolute bottom-4 left-4 w-2 h-2 border-l border-b border-white/40" />
                <div className="absolute bottom-4 right-4 w-2 h-2 border-r border-b border-white/40" />

                <div className="relative px-8 py-10 flex flex-col items-center text-center z-10">
                    
                    {/* Animated Icon Container */}
                    <div className="relative mb-6">
                        {/* Spinning Rings */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-10px] rounded-full border border-dashed border-white/20"
                        />
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-4px] rounded-full border border-white/10"
                        />
                        
                        {/* Central Glow Orb */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-xl opacity-40 absolute inset-0" />
                        
                        {/* The Icon */}
                        <motion.div
                             animate={{ scale: [1, 1.2, 1] }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="relative w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md"
                        >
                            <Sparkles className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </motion.div>
                    </div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-1"
                    >
                        <h2 className="text-sm font-mono tracking-[0.2em] text-indigo-400 uppercase">System Reward</h2>
                        
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-bold text-white tracking-tighter drop-shadow-lg">
                                +{amount}
                            </span>
                            <span className="text-lg font-bold text-white/40">PXP</span>
                        </div>
                    </motion.div>

                    {/* Divider Line */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                    {/* Footer Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-3"
                    >
                        <p className="text-white/80 font-medium">Hidden Artifact Decrypted</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs text-white/40 font-mono uppercase">
                                Cooldown: {nextAvailableIn}H
                            </span>
                        </div>
                    </motion.div>

                </div>

                {/* Progress Bar Loader at bottom (visual flair for auto-close) */}
                <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4.5, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
                />
            </div>

            {/* Close Button Floating Outside */}
            <button className="absolute -top-12 right-0 p-2 text-white/40 hover:text-white transition-colors">
                <span className="sr-only">Close</span>
                <X className="w-6 h-6" />
            </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}