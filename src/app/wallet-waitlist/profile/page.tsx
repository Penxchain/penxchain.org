"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Users,
  CheckCircle2,
  Clock,
  Shield,
  Fingerprint,
} from "lucide-react";
import WaitlistLayout from "../components/WaitlistLayout";
import { getCurrentUser } from "../lib/waitlist-auth";
import { getLevelInfo } from "../lib/waitlist-data";
import { getTasks, getSocialTasks, getDailyTasks } from "../lib/waitlist-tasks";
import type { Task } from "../types/waitlist";
import { getAvatarStyle } from "../lib/avatars";
import type { User } from "../types/waitlist";

import PXPSpinner from "../components/PXPSpinner";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<(Task & { completed: boolean })[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (user?.id) {
      getTasks()
        .then((t) => {
          if (mounted) setTasks(t);
        })
        .catch((e) => console.warn("Failed to load tasks for profile", e));
    }
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Listen for session updates from other parts of the app
  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail) setUser(e.detail as User);
    };
    window.addEventListener("penxchain:user-updated", handler as EventListener);
    return () =>
      window.removeEventListener(
        "penxchain:user-updated",
        handler as EventListener,
      );
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <PXPSpinner size={48} />
      </div>
    );
  }

  const levelInfo = getLevelInfo(Number(user.points ?? 0));
  const joinDate = new Date(user.joinedAt ?? Date.now()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const completedTasks = Array.isArray(user.completedTasks)
    ? user.completedTasks
    : [];

  const socialTasksList = getSocialTasks(tasks);
  const dailyTasksList = getDailyTasks(tasks);
  const socialTaskIds = socialTasksList.map((t) => t.id);
  const dailyTaskIds = dailyTasksList.map((t) => t.id);

  const completedSocialTasksCount = completedTasks.filter((taskId) =>
    socialTaskIds.includes(taskId),
  ).length;
  const completedDailyTasksCount = completedTasks.filter((taskId) =>
    dailyTaskIds.includes(taskId),
  ).length;

  const safePoints = Number(user.points ?? 0);
  const safeReferralCount = Number(user.referralCount ?? 0);

  return (
    <WaitlistLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* IDENTITY CARD HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
        >
          {/* Aesthetic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2547D0]/10 via-transparent to-transparent opacity-50" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#2547D0] to-[#0ce50c] rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
                <div
                  className="relative w-32 h-32 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden"
                  style={getAvatarStyle(user.avatarId)}
                >
                  {/* Status Dot */}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#020202] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#0ce50c] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#2547D0]/20 text-[#2547D0] border border-[#2547D0]/20 uppercase tracking-widest">
                        Verified Identity
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">
                      {user.username}
                    </h1>
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Shield className="w-3 h-3" />
                      <span className="font-mono">
                        {user.id?.substring(0, 8) || "..."}...
                        {user.id?.substring((user.id?.length || 4) - 4) || "..."}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1">
                      Current Standing
                    </div>
                    <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                      <span className="text-[#2547D0]">
                        Lvl {levelInfo.level}
                      </span>
                      <span className="text-white/20">/</span>
                      <span>{levelInfo.title}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: "PXP Earned",
                      value: Number(user.points ?? 0).toLocaleString(),
                      color: "#2547D0",
                    },
                    {
                      label: "Global Rank",
                      value: `#${user.rank ?? 0}`,
                      color: "#ffffff",
                    },
                    {
                      label: "Referrals",
                      value: Number(user.referralCount ?? 0),
                      color: "#00a3ff",
                    },
                    { label: "Reputation", value: "High", color: "#0ce50c" },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-black/20 border border-white/5 rounded-lg backdrop-blur-sm"
                    >
                      <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider mb-1">
                        {stat.label}
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Level Progress */}

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-end justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2"></div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono leading-none">
                      {Math.round(levelInfo.progress)}
                    </span>
                    <span className="text-xs text-[#2547D0] font-mono font-bold">
                      % SYNCED
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.15em] mb-1">
                    Next Protocol Tier
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm font-bold text-white font-mono">
                      {levelInfo.nextLevelPoints
                        ? (
                            levelInfo.nextLevelPoints - user.points
                          ).toLocaleString()
                        : "MAXED"}
                    </span>
                    <span className="text-[10px] text-[#0ce50c] font-bold tracking-tighter">
                      PXP REQ
                    </span>
                  </div>
                </div>
              </div>

              {/* MAIN BAR CONTAINER */}
              <div className="relative h-6 w-full bg-black/40 rounded-lg border border-white/5 overflow-hidden backdrop-blur-sm p-1">
                {/* Inner Track Grid Texture */}
                <div
                  className="absolute inset-0 opacity-[0.05] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: "4% 100%",
                  }}
                />

                {/* The Progress Fill */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full rounded-md overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, #1A36A8 0%, #2547D0 50%, #0ce50c 100%)`,
                    boxShadow: `0 0 15px rgba(37, 71, 208, 0.3)`,
                  }}
                >
                  {/* High-Speed Scanning Glint */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                  />

                  {/* Glass Segment Overlays */}
                  <div className="absolute inset-0 flex justify-between px-1">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-[2px] h-full bg-black/20" />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* BOTTOM TELEMETRY */}
              <div className="mt-3 flex justify-between items-center text-[8px] font-mono tracking-[0.1em]">
                <div className="flex gap-4 text-white/30">
                  <span className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-[#2547D0] rounded-full" />
                    UPLINK: ACTIVE
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-[#0ce50c] rounded-full" />
                    INTEGRITY: 100%
                  </span>
                </div>
                <div className="text-[#2547D0] font-bold italic animate-pulse">
                  SYNCING SYSTEM DATA...
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-xl"
          >
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Fingerprint className="w-4 h-4 text-[#2547D0]" />
              Identity Details
            </h2>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email Uplink", value: user.email ?? "—" },
                {
                  icon: Calendar,
                  label: "Initialization Date",
                  value: joinDate,
                },
                {
                  icon: Award,
                  label: "Referral Code",
                  value: user.referralCode ?? "—",
                  mono: true,
                  copy: true,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <div className="mt-1 p-1.5 bg-white/5 rounded-md">
                    <item.icon className="w-3.5 h-3.5 text-white/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    <p
                      className={`text-white font-medium text-sm truncate ${item.mono ? "font-mono text-[#2547D0]" : ""}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Task Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-xl"
          >
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Target className="w-4 h-4 text-[#0ce50c]" />
              Protocol Data
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  label: "Total Completed",
                  value: String(completedTasks.length),
                  color: "#0ce50c",
                },
                {
                  icon: Users,
                  label: "Social Protocols",
                  value: `${completedSocialTasksCount}/${socialTasksList.length}`,
                  color: "#2547D0",
                },
                {
                  icon: Clock,
                  label: "Daily Streaks",
                  value: String(completedDailyTasksCount),
                  color: "#00a3ff",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/5 rounded-md">
                      <item.icon
                        className="w-3.5 h-3.5"
                        style={{ color: item.color }}
                      />
                    </div>
                    <span className="text-sm text-white/70">{item.label}</span>
                  </div>
                  <span className="text-white font-bold font-mono">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 bg-white/[0.02] border border-white/5 rounded-xl"
        >
          <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#eab308]" />
            Badges & Honors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Early Adopter",
                desc: "Joined the genesis waitlist",
                icon: Award,
                color: "#2547D0",
                achieved: true,
              },
              {
                title: "Task Master",
                desc: "Completed 5+ protocols",
                icon: CheckCircle2,
                color: "#0ce50c",
                achieved: completedTasks.length >= 5,
              },
              {
                title: "Influencer",
                desc: "Referred 3+ users",
                icon: Users,
                color: "#00a3ff",
                achieved: safeReferralCount >= 3,
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all ${
                  badge.achieved
                    ? `bg-${badge.color}/5 border-${badge.color}/10 bg-white/[0.02] border-white/10` // Fallback style if dynamic class fails, let's just use inline styles for reliability
                    : "bg-white/[0.01] border-white/5 opacity-40"
                }`}
                style={
                  badge.achieved
                    ? {
                        backgroundColor: `${badge.color}08`, // 08 is hex for low opacity
                        borderColor: `${badge.color}20`,
                      }
                    : {}
                }
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: badge.achieved
                      ? `${badge.color}15`
                      : "rgba(255,255,255,0.05)",
                    color: badge.achieved ? badge.color : "white",
                  }}
                >
                  <badge.icon className="w-5 h-5" />
                </div>
                <h3
                  className={`font-bold text-sm mb-1 ${badge.achieved ? "text-white" : "text-white/50"}`}
                >
                  {badge.title}
                </h3>
                <p className="text-[10px] text-white/40 uppercase tracking-wide">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </WaitlistLayout>
  );
}
