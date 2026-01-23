    "use client";

    import React, { useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Sparkles } from 'lucide-react';

    interface BonusPXPModalProps {
      amount: number;
      onClose: () => void;
      nextAvailableIn?: number; // hours
    }

    export default function BonusPXPModal({ amount, onClose, nextAvailableIn = 24 }: BonusPXPModalProps) {
      useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
      }, [onClose]);

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={onClose}
          >
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: '50%', 
                    y: '50%',
                    scale: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-[#0ce50c] rounded-full"
                  style={{
                    boxShadow: '0 0 10px #0ce50c'
                  }}
                />
              ))}
            </div>

            {/* Main card */}
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient border */}
              <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-[#2547D0] via-[#00a3ff] to-[#0ce50c] shadow-2xl">
                <div className="relative bg-[#020202] rounded-2xl px-16 py-12">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2547D0]/20 to-[#0ce50c]/20 rounded-2xl blur-xl" />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center space-y-6">
                    {/* Icon */}
                    <motion.div
                      animate={{ 
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 0.6,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                      }}
                      className="flex justify-center"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#0ce50c]/30 blur-2xl rounded-full" />
                        <Sparkles className="w-16 h-16 text-[#0ce50c] relative" strokeWidth={1.5} />
                      </div>
                    </motion.div>

                    {/* Amount */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2547D0] via-[#00a3ff] to-[#0ce50c] mb-2">
                        +{amount}
                      </div>
                      <div className="text-sm font-mono text-white/40 uppercase tracking-[0.3em]">
                        PXP Bonus
                      </div>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <p className="text-xl font-bold text-white">
                        🎉 You found the hidden PXP! 🎉
                      </p>
                      <p className="text-sm text-white/60">
                        Come back in {nextAvailableIn} hours for more
                      </p>
                    </motion.div>

                    {/* Dismiss hint */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-xs text-white/30 font-mono"
                    >
                      Click anywhere to continue
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    }
