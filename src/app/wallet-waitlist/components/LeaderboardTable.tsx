"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import type { LeaderboardEntry } from '../types/waitlist';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  compact?: boolean;
}

export default function LeaderboardTable({ entries, currentUserId, compact = false }: LeaderboardTableProps) {
  const displayEntries = compact ? entries.slice(0, 5) : entries;

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-white/60';
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400/10 border-yellow-400/20';
    if (rank === 2) return 'bg-gray-400/10 border-gray-400/20';
    if (rank === 3) return 'bg-amber-600/10 border-amber-600/20';
    return 'bg-white/5 border-white/10';
  };

  return (
    <div className="space-y-2">
      {displayEntries.map((entry, index) => {
        const isCurrentUser = entry.user.id === currentUserId;
        const isTopThree = entry.rank <= 3;

        return (
          <motion.div
            key={entry.user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`relative ${isCurrentUser ? 'z-10' : 'z-0'}`}
          >
             {isCurrentUser && (
                <div className="absolute -inset-[1px] bg-[#2547D0] rounded-xl opacity-30 blur-sm" />
             )}

            <div
              className={`relative flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all ${
                isCurrentUser
                  ? 'bg-[#2547D0]/10 border-[#2547D0]/50'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getRankBg(entry.rank)}`}>
                  {isTopThree ? (
                    <Trophy className={`w-4 h-4 ${getRankColor(entry.rank)}`} />
                  ) : (
                    <span className="text-white/40 font-mono text-sm">#{entry.rank}</span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-bold truncate text-sm ${isCurrentUser ? 'text-white' : 'text-white/90'}`}>
                     {entry.user.username}
                  </h4>
                  {isCurrentUser && (
                    <span className="px-1.5 py-0.5 bg-[#2547D0] rounded text-white text-[9px] font-bold uppercase tracking-wider">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono uppercase tracking-wider">
                  <TrendingUp className="w-3 h-3" />
                  <span>Lvl {entry.user.level}</span>
                  {entry.user.referralCount > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{entry.user.referralCount} Refs</span>
                    </>
                  )}
                </div>
              </div>

              {/* Points */}
              <div className="flex-shrink-0 text-right">
                <p className={`font-bold text-sm ${isCurrentUser ? 'text-[#0ce50c]' : 'text-white'}`}>
                   {entry.user.points.toLocaleString()}
                </p>
                <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">PXP</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      {compact && entries.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-white/30 text-xs font-mono uppercase tracking-widest">+ {entries.length - 5} OTHER IDENTITIES</p>
        </div>
      )}
    </div>
  );
}
