"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Trophy,
  Search,
  TrendingUp,
  Target,
  Users,
  Crown,
  Medal,
  Shield,
  Activity,
} from "lucide-react";
import WaitlistLayout from "../components/WaitlistLayout";
import LeaderboardTable from "../components/LeaderboardTable";
import { getCurrentUser } from "../lib/waitlist-auth";
import { fetchLeaderboard } from "../lib/waitlist-data";
import type { User } from "../types/waitlist";
import type { LeaderboardEntry } from "../types/waitlist";
import { LeaderboardSkeleton } from "../components/Skeletons";

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<
    LeaderboardEntry[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/wallet-waitlist");
      return;
    }
    setUser(currentUser);
    
    (async () => {
      try {
        const remote = await fetchLeaderboard();
        updateLeaderboardWith(remote, currentUser);
      } catch (e) {
        updateLeaderboardWith([], currentUser);
      } finally {
        setLoading(false);
      }
    })();

    const handler = (e: any) => {
      if (e?.detail) setUser(e.detail as User);
    };
    window.addEventListener("penxchain:user-updated", handler as EventListener);
    return () =>
      window.removeEventListener(
        "penxchain:user-updated",
        handler as EventListener,
      );
  }, [router]);

  useEffect(() => {
    filterLeaderboard();
  }, [searchQuery, leaderboard]);

  const updateLeaderboardWith = (allUsersRaw: User[], currentUser: User) => {
    const allUsers = Array.isArray(allUsersRaw) ? [...allUsersRaw] : [];
    const currentUserIndex = allUsers.findIndex((u) => u.id === currentUser.id);

    if (currentUserIndex !== -1) {
      allUsers[currentUserIndex] = currentUser;
    } else {
      allUsers.push(currentUser);
    }

    const sorted = allUsers.sort(
      (a, b) => Number(b.points ?? 0) - Number(a.points ?? 0),
    );
    const entries: LeaderboardEntry[] = sorted.map((u, index) => ({
      rank: index + 1,
      user: { ...u, rank: index + 1 },
    }));

    setLeaderboard(entries);
    setFilteredLeaderboard(entries);
  };

  const filterLeaderboard = () => {
    let filtered = [...leaderboard];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((entry) => {
        const username = (entry.user.username || "").toString().toLowerCase();
        const email = (entry.user.email || "").toString().toLowerCase();
        return username.includes(q) || email.includes(q);
      });
    }

    setFilteredLeaderboard(filtered);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2547D0]/20 border-t-[#2547D0] rounded-full animate-spin" />
      </div>
    );
  }

  const userEntry = filteredLeaderboard.find(
    (entry) => entry.user.id === user.id,
  );

  return (
    <WaitlistLayout>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Libre Franklin', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .mono {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
        
        .circuit-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-b from-zinc-900/40 to-zinc-950/40 border border-zinc-800/60 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 circuit-pattern opacity-30" />
          
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-zinc-700/60" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-zinc-700/60" />

          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-[#2547D0] rounded-full" />
                  <span className="mono text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                    Global Rankings
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight leading-none">
                  Leaderboard
                </h1>
                <p className="text-zinc-500 max-w-lg text-sm leading-relaxed">
                  Compete with verified identities across the network. 
                  Climb the ranks and establish your reputation.
                </p>
              </div>

              {userEntry && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="px-8 py-6 bg-zinc-900/60 border border-zinc-700/60 rounded-xl relative"
                >
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#2547D0] rounded-full animate-pulse" />
                  
                  <p className="mono text-[9px] text-zinc-600 uppercase tracking-wider mb-2 font-medium">
                    Your Position
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-white mono">
                      #{userEntry.rank}
                    </span>
                    <div className="h-10 w-px bg-zinc-700/60" />
                    <div>
                      <div className="mono text-xs text-zinc-500 mb-1">
                        Top{" "}
                        {leaderboard.length
                          ? ((userEntry.rank / leaderboard.length) * 100).toFixed(0)
                          : "0"}%
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-[#2547D0]" />
                        <span className="mono text-[10px] text-zinc-600">Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#2547D0] transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search identities..."
              className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/60 focus:border-[#2547D0]/50 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none transition-all mono text-sm"
            />
          </div>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: Users,
              label: "Total Identities",
              value: leaderboard.length,
            },
            {
              icon: Trophy,
              label: "Top PXP",
              value: Number(leaderboard[0]?.user.points ?? 0).toLocaleString(),
            },
            {
              icon: Shield,
              label: "Your PXP",
              value: Number(user.points ?? 0).toLocaleString(),
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="relative p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-lg group hover:border-zinc-700/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mono text-[9px] text-zinc-600 uppercase tracking-wider mb-2 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white mono">{stat.value}</p>
                </div>
                <div className="w-10 h-10 bg-zinc-900/60 border border-zinc-800/60 rounded-lg flex items-center justify-center group-hover:border-zinc-700/60 transition-all">
                  <stat.icon className="w-5 h-5 text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* LEADERBOARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative bg-gradient-to-b from-zinc-900/40 to-zinc-950/40 border border-zinc-800/60 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 circuit-pattern opacity-20" />

          {/* Header */}
          <div className="relative p-6 border-b border-zinc-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900/60 border border-zinc-800/60 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#2547D0]" />
              </div>
              <div>
                <h2 className="mono text-xs font-bold text-white uppercase tracking-wider">
                  Network Rankings
                </h2>
                <p className="mono text-[9px] text-zinc-600 mt-0.5">
                  Real-time protocol standings
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/60 border border-zinc-800/60 rounded-md">
              <div className="w-1.5 h-1.5 bg-[#2547D0]" />
              <span className="mono text-[10px] text-zinc-500 uppercase tracking-wider">
                {filteredLeaderboard.length} Found
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="relative p-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <LeaderboardSkeleton key={i} />
                ))}
              </div>
            ) : filteredLeaderboard.length > 0 ? (
              <LeaderboardTable
                entries={filteredLeaderboard}
                currentUserId={user.id}
              />
            ) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-zinc-900/60 border border-zinc-800/60 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-zinc-700" />
                </div>
                <p className="text-zinc-500 mono text-sm">
                  No identities match your search
                </p>
                <p className="text-zinc-700 mono text-xs mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </WaitlistLayout>
  );
}