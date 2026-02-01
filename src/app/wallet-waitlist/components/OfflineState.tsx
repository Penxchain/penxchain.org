"use client";

import React from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflineState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        {/* Pulsing ring */}
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
        
        <div className="relative w-24 h-24 bg-[#0a0a0a] border border-red-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.15)] group overflow-hidden">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute h-[2px] w-full bg-red-500/50 top-0 animate-[scan_2s_linear_infinite]" />
          
          <WifiOff className="w-10 h-10 text-red-500" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-black text-white tracking-tight uppercase mb-3 flex items-center gap-3"
      >
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        Connection Lost
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white/40 max-w-md font-mono text-sm leading-relaxed mb-8"
      >
        Signal lost from the mainnet. Local caching active. Please re-establish neural link to continue synchronization.
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-white transition-all group"
      >
        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        <span>RECONNECT_SYSTEM</span>
      </motion.button>
    </div>
  );
}
