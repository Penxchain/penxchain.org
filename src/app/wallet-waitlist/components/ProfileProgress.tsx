"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProfileProgressProps {
  progress: number;
  nextLevelPoints: number | null;
  currentPoints: number;
}

export default function ProfileProgress({ progress, nextLevelPoints, currentPoints }: ProfileProgressProps) {
  // Penxchain Blue
  const brandBlue = "#2547D0";

  return (
    <div className="mt-8 pt-8 border-t border-white/5 w-full">
      {/* HUD Header */}
      <div className="flex items-end justify-between mb-4">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-[#2547D0] uppercase tracking-[0.2em] font-bold">
            Neural Sync Status
          </p>
          <h4 className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            {Math.round(progress)}
            <span className="text-xs text-white/30 font-normal">%</span>
          </h4>
        </div>
        
        <div className="text-right">
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">
            Next Tier Protocol
          </p>
          <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-white font-mono italic">
               {nextLevelPoints ? (nextLevelPoints - currentPoints).toLocaleString() : '0'}
             </span>
             <span className="text-[10px] text-[#2547D0] font-bold tracking-tighter">PXP REQ</span>
          </div>
        </div>
      </div>

      {/* THE MAIN PROGRESS TERMINAL */}
      <div className="relative h-4 w-full bg-[#0A0A0B] rounded-sm border border-white/5 overflow-hidden p-[2px]">
        {/* Subtle Background Grid Texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(0deg, #fff 1px, transparent 1px)`,
            backgroundSize: '20px 100%'
          }}
        />

        {/* The Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full rounded-sm overflow-hidden"
          style={{
            background: `linear-gradient(90deg, #1A36A8 0%, ${brandBlue} 50%, #4F6EF7 100%)`,
            boxShadow: `0 0 20px ${brandBlue}40`
          }}
        >
          {/* Animated Scanning Beam */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
          
          {/* Energy Pulse Stripes */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)`
            }}
          />
        </motion.div>

        {/* Marker Nodes (25%, 50%, 75%) */}
        {[25, 50, 75].map((pos) => (
          <div 
            key={pos}
            className={`absolute top-0 bottom-0 w-[1px] transition-colors duration-500 ${
                progress >= pos ? 'bg-white/40' : 'bg-white/10'
            }`}
            style={{ left: `${pos}%` }}
          />
        ))}
      </div>

      {/* Bottom Telemetry Data */}
      <div className="mt-3 flex justify-between items-center px-1">
        <div className="flex gap-4">
           <div className="flex flex-col">
              <span className="text-[8px] text-white/20 uppercase font-mono tracking-tighter">Current Balance</span>
              <span className="text-[10px] text-white/60 font-mono">{currentPoints.toLocaleString()} PXP</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] text-white/20 uppercase font-mono tracking-tighter">System Stability</span>
              <span className="text-[10px] text-[#0ce50c] font-mono tracking-tighter italic">NOMINAL</span>
           </div>
        </div>

        {/* "Live" Data Ping */}
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-[#2547D0] animate-ping" />
          <span className="text-[8px] text-[#2547D0] font-bold uppercase tracking-[0.2em]">Syncing...</span>
        </div>
      </div>
    </div>
  );
}