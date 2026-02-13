"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Wallet, ArrowRight, Zap } from "lucide-react";
import { usePathname } from "next/navigation";

export default function WalletWaitlistPortal() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (
      pathname.startsWith("/wallet-waitlist") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/docs") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup")
    ) {
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-[100] pointer-events-none">
          <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
            
            .portal-mono {
              font-family: 'JetBrains Mono', monospace;
            }
            
            @keyframes border-trace {
              0% {
                clip-path: inset(0 100% 0 0);
              }
              25% {
                clip-path: inset(0 0 0 0);
              }
              50% {
                clip-path: inset(0 0 0 0);
              }
              75% {
                clip-path: inset(0 0 0 0);
              }
              100% {
                clip-path: inset(0 100% 0 0);
              }
            }

            @keyframes node-pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 0.6;
              }
              50% {
                transform: scale(1.5);
                opacity: 1;
              }
            }

            @keyframes scan {
              0% {
                transform: translateY(-100%);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              90% {
                opacity: 1;
              }
              100% {
                transform: translateY(100%);
                opacity: 0;
              }
            }

            .portal-scan::after {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(
                180deg,
                transparent 0%,
                rgba(37, 71, 208, 0.06) 50%,
                transparent 100%
              );
              animation: scan 4s ease-in-out infinite;
              pointer-events: none;
            }
          `}</style>

          <Link href="/wallet-waitlist" className="pointer-events-auto block" aria-label="Join Wallet Waitlist to participate in the PXP mining phase">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative"
            >
              {/* Outer glow - only on hover */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-3 bg-[#2547D0]/10 rounded-2xl blur-xl"
              />

              {/* Main container */}
              <motion.div
                animate={{ 
                  width: isHovered ? "auto" : "56px",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="relative overflow-hidden portal-scan"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  boxShadow: isHovered 
                    ? '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(37, 71, 208, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)' 
                    : '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(161, 161, 170, 0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                {/* Circuit grid texture */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                <div className="relative flex items-center h-14 px-3.5 gap-0">
                  
                  {/* Icon + Node indicator */}
                  <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {/* Rotating ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border border-dashed border-[#2547D0]/30"
                    />
                    
                    {/* Icon */}
                    <motion.div
                      animate={{ scale: isHovered ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(37, 71, 208, 0.3) 0%, rgba(37, 71, 208, 0.15) 100%)',
                        border: '1px solid rgba(37, 71, 208, 0.4)',
                        boxShadow: isHovered ? '0 0 12px rgba(37, 71, 208, 0.4)' : '0 0 6px rgba(37, 71, 208, 0.2)',
                      }}
                    >
                      <Wallet className="w-3.5 h-3.5 text-[#2547D0]" />
                    </motion.div>

                    {/* Live pulse dot */}
                    <div className="absolute -top-0.5 -right-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#2547D0] opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2547D0]"
                          style={{ boxShadow: '0 0 6px rgba(37, 71, 208, 0.8)' }}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 pl-3 pr-1 whitespace-nowrap">
                          {/* Divider */}
                          <div className="w-px h-7 bg-gradient-to-b from-transparent via-zinc-700/60 to-transparent flex-shrink-0" />
                          
                          {/* Text */}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-white font-semibold text-[13px] tracking-tight">
                                Join Wallet Waitlist
                              </span>
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                                style={{ background: 'rgba(37, 71, 208, 0.2)', border: '1px solid rgba(37, 71, 208, 0.3)' }}
                              >
                                <Zap className="w-2.5 h-2.5 text-[#2547D0]" />
                                <span className="portal-mono text-[8px] text-[#2547D0] uppercase tracking-wider font-bold">
                                  Live
                                </span>
                              </div>
                            </div>
                            <span className="portal-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                              Participate in the PXP mining
                            </span>
                          </div>

                          {/* Arrow */}
                          <motion.div
                            initial={{ x: -4, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ml-1"
                            style={{
                              background: 'linear-gradient(135deg, rgba(37, 71, 208, 0.3), rgba(37, 71, 208, 0.15))',
                              border: '1px solid rgba(37, 71, 208, 0.4)',
                            }}
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#2547D0]" />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </Link>
        </div>
      )}
    </AnimatePresence>
  );
}