"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import type { LeaderboardEntry } from "../types/waitlist";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  compact?: boolean;
}

export default function LeaderboardTable({
  entries,
  currentUserId,
  compact = false,
}: LeaderboardTableProps) {
  const displayEntries = compact ? entries.slice(0, 5) : entries;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "◆";
    if (rank === 2) return "◇";
    if (rank === 3) return "◈";
    return null;
  };

  const getRankGradient = (rank: number) => {
    if (rank === 1) return "from-amber-400/20 via-yellow-500/10 to-transparent";
    if (rank === 2) return "from-slate-300/20 via-zinc-400/10 to-transparent";
    if (rank === 3) return "from-orange-500/20 via-amber-700/10 to-transparent";
    return "from-white/5 via-white/2 to-transparent";
  };

  const getRankAccent = (rank: number) => {
    if (rank === 1) return "text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]";
    if (rank === 2) return "text-zinc-300 shadow-[0_0_20px_rgba(212,212,216,0.2)]";
    if (rank === 3) return "text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.25)]";
    return "text-white/30";
  };

  return (
    <div className="space-y-3 font-mono">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        
        .leaderboard-entry {
          font-family: 'Space Mono', monospace;
        }
        
        .rank-display {
          font-family: 'Orbitron', monospace;
        }
        
        .crypto-grid {
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .zkp-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
        }
        
        .hexagon-clip {
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }
        
        @keyframes pulse-ring {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        
        .pulse-ring {
          animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {displayEntries.map((entry, index) => {
        const isCurrentUser = entry.user.id === currentUserId;
        const isTopThree = entry.rank <= 3;
        const rankIcon = getRankIcon(entry.rank);

        return (
          <motion.div
            key={entry.user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.05,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="leaderboard-entry relative group"
          >
            {/* Outer glow for current user */}
            {isCurrentUser && (
              <>
                <div className="absolute -inset-[2px] bg-gradient-to-r from-[#2547D0] via-cyan-500 to-[#2547D0] rounded-2xl opacity-60 blur-xl pulse-ring" />
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#2547D0] via-cyan-500 to-[#2547D0] rounded-2xl opacity-80" />
              </>
            )}

            {/* Background gradient overlay for top 3 */}
            {isTopThree && !isCurrentUser && (
              <div className={`absolute inset-0 bg-gradient-to-r ${getRankGradient(entry.rank)} rounded-2xl opacity-40`} />
            )}

            <div
              className={`
                relative flex items-center gap-4 p-4 rounded-2xl backdrop-blur-md
                crypto-grid zkp-noise border transition-all duration-300
                ${
                  isCurrentUser
                    ? "bg-[#2547D0]/20 border-[#2547D0]/60 shadow-[0_0_30px_rgba(37,71,208,0.3)]"
                    : isTopThree
                    ? "bg-black/40 border-white/10 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                    : "bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/30"
                }
                overflow-hidden
              `}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Diagonal accent line */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${
                isCurrentUser 
                  ? "from-cyan-400/10 to-transparent" 
                  : "from-white/5 to-transparent"
              } transform translate-x-12 -translate-y-12 rotate-45`} />

              {/* Rank Section */}
              <div className="flex-shrink-0 relative">
                <div className="relative w-16 h-16">
                  {/* Hexagonal background */}
                  <div className={`
                    absolute inset-0 hexagon-clip
                    ${isTopThree ? "bg-gradient-to-br" : "bg-black/40"}
                    ${entry.rank === 1 && "from-amber-500/20 to-yellow-600/10"}
                    ${entry.rank === 2 && "from-zinc-400/20 to-slate-500/10"}
                    ${entry.rank === 3 && "from-orange-500/20 to-amber-700/10"}
                    border border-white/10
                  `} />
                  
                  {/* Rank content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rank-display">
                    {rankIcon ? (
                      <>
                        <div className={`text-2xl ${getRankAccent(entry.rank)} font-bold`}>
                          {rankIcon}
                        </div>
                        <div className={`text-[9px] mt-0.5 ${getRankAccent(entry.rank)} font-semibold tracking-widest`}>
                          #{entry.rank}
                        </div>
                      </>
                    ) : (
                      <div className="text-white/40 text-lg font-bold tracking-tight">
                        #{entry.rank}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 relative z-10">
                {/* Username row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className={`
                    font-bold text-sm tracking-wide truncate
                    ${isCurrentUser ? "text-cyan-300" : "text-white/95"}
                  `}>
                    {entry.user.username}
                  </h4>
                  
                  {isCurrentUser && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#2547D0] to-cyan-600 rounded-md">
                      <div className="w-1 h-1 rounded-full bg-cyan-300 animate-pulse" />
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                        You
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-[10px] text-white/50 uppercase tracking-widest">
                  {/* Level indicator */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded border border-white/30 flex items-center justify-center">
                      <TrendingUp className="w-2 h-2" />
                    </div>
                    <span className="font-semibold">L{entry.user.level ?? 0}</span>
                  </div>

                  {/* Divider */}
                  {(entry.user.referralCount ?? 0) > 0 && (
                    <>
                      <div className="w-[1px] h-3 bg-white/20" />
                      
                      {/* Referral count */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rotate-45 bg-white/30" />
                        <span className="font-semibold">
                          {Number(entry.user.referralCount ?? 0)} Refs
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Points Section */}
              <div className="flex-shrink-0 text-right relative z-10">
                <div className="relative">
                  {/* Points value */}
                  <p className={`
                    font-bold text-base tracking-tight mb-0.5 rank-display
                    ${isCurrentUser 
                      ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                      : isTopThree
                      ? "text-white"
                      : "text-white/90"
                    }
                  `}>
                    {Number(entry.user.points ?? 0).toLocaleString()}
                  </p>
                  
                  {/* PXP label with cryptographic styling */}
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-1 h-1 bg-white/30 rotate-45" />
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">
                      PXP
                    </p>
                    <div className="w-1 h-1 bg-white/30 rotate-45" />
                  </div>
                </div>
              </div>

              {/* Corner accent for top 3 */}
              {isTopThree && (
                <div className="absolute bottom-0 left-0 w-3 h-3">
                  <div className={`w-full h-full bg-gradient-to-tr ${
                    entry.rank === 1 && "from-amber-400/40"
                  } ${
                    entry.rank === 2 && "from-zinc-300/40"
                  } ${
                    entry.rank === 3 && "from-orange-500/40"
                  } to-transparent`} />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Compact view footer */}
      {compact && entries.length > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: displayEntries.length * 0.05 + 0.2 }}
          className="text-center pt-6 relative"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/20 border border-white/5 rounded-xl backdrop-blur-sm">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/20 rotate-45" />
              <div className="w-1 h-1 bg-white/20 rotate-45" />
              <div className="w-1 h-1 bg-white/20 rotate-45" />
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.25em]">
              +{entries.length - 5} Encrypted Identities
            </p>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/20 rotate-45" />
              <div className="w-1 h-1 bg-white/20 rotate-45" />
              <div className="w-1 h-1 bg-white/20 rotate-45" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}