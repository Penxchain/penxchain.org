"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hide success message after 3 seconds
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-red-950/40 backdrop-blur-xl border border-red-500/30 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
             <WifiOff className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-xs font-mono font-bold text-red-200 uppercase tracking-widest">
            Connection Lost
          </span>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/30 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        >
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-emerald-200 uppercase tracking-widest">
            System Reconnected
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
