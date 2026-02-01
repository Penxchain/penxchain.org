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
} from "lucide-react";
import WaitlistLayout from "../components/WaitlistLayout";
import LeaderboardTable from "../components/LeaderboardTable";
import { getCurrentUser } from "../lib/waitlist-auth";
import { fetchLeaderboard } from "../lib/waitlist-data";
import type { User } from "../types/waitlist";
import type { LeaderboardEntry, TimePeriod } from "../types/waitlist";
import { LeaderboardSkeleton } from "../components/Skeletons";

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<
    LeaderboardEntry[]
  >([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/wallet-waitlist");
      return;
    }
    setUser(currentUser);
    // Fetch remote leaderboard
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

    // Listen for user updates
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
  }, [searchQuery, timePeriod, leaderboard]);

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
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10"
        >
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2547D0]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#eab308] text-[10px] font-mono tracking-widest uppercase">
                <Crown className="w-3 h-3" />
                <span>Global Rankings</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Leaderboard
              </h1>
              <p className="text-white/40 max-w-lg">
                Compete with other identities. Increase your reputation score to
                climb the ranks and unlock higher tiers.
              </p>
            </div>

            {userEntry && (
              <div className="px-8 py-5 bg-black/40 border border-[#2547D0]/30 rounded-xl backdrop-blur-md shadow-lg shadow-[#2547D0]/10">
                <p className="text-[#2547D0] text-[10px] font-mono uppercase tracking-wider mb-1">
                  Your Current Position
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-white">
                    #{userEntry.rank}
                  </span>
                  <div className="h-8 w-[1px] bg-white/10" />
                  <div className="text-right">
                    <div className="text-xs text-white/50">
                      Top{" "}
                      {leaderboard.length
                        ? ((userEntry.rank / leaderboard.length) * 100).toFixed(
                            0,
                          )
                        : "0"}
                      %
                    </div>
                    <TrendingUp className="w-4 h-4 text-[#0ce50c]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* SEARCH & FILTER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#2547D0] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search identity..."
              className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/5 hover:border-white/10 focus:border-[#2547D0]/50 rounded-xl text-white placeholder:text-white/20 focus:outline-none transition-all text-sm"
            />
          </div>

          {/* Time Period Filter */}
          <div className="flex p-1 bg-white/[0.02] border border-white/5 rounded-xl">
            {(["all", "month", "week"] as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-6 py-3 rounded-lg font-medium text-xs uppercase tracking-wider transition-all ${
                  timePeriod === period
                    ? "bg-[#2547D0] text-white shadow-lg shadow-[#2547D0]/20"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {period === "all"
                  ? "All Time"
                  : period === "month"
                    ? "Month"
                    : "Week"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* STATS OVERVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: Target,
              label: "Total Identities",
              value: leaderboard.length,
              color: "#2547D0",
            },
            {
              icon: Crown,
              label: "Highest Score",
              value: Number(leaderboard[0]?.user.points ?? 0).toLocaleString(),
              color: "#eab308",
            },
            {
              icon: Medal,
              label: "Your Score",
              value: Number(user.points ?? 0).toLocaleString(),
              color: "#00a3ff",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/[0.04] transition-colors"
            >
              <div>
                <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: `${stat.color}10`,
                  color: stat.color,
                }}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </motion.div>

        {/* LEADERBOARD TABLE WRAPPER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2547D0]" />
              Rankings Data
            </h2>
            <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-1 rounded">
              {filteredLeaderboard.length} IDENTITIES FOUND
            </span>
          </div>

          <div className="p-2">
            {loading ? (
                <div className="space-y-4 p-4">
                    <LeaderboardSkeleton />
                    <LeaderboardSkeleton />
                    <LeaderboardSkeleton />
                    <LeaderboardSkeleton />
                    <LeaderboardSkeleton />
                </div>
            ) : filteredLeaderboard.length > 0 ? (
              <LeaderboardTable
                entries={filteredLeaderboard}
                currentUserId={user.id}
              />
            ) : (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-white/40">
                  No identities match your search parameters.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </WaitlistLayout>
  );
}
