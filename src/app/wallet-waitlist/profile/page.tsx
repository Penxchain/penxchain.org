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
  Copy,
  Check,
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
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleCopyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

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
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Libre Franklin', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .mono {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
        
        .anodized {
          background: linear-gradient(145deg, 
            rgba(39, 39, 42, 0.4) 0%,
            rgba(24, 24, 27, 0.6) 50%,
            rgba(39, 39, 42, 0.4) 100%
          );
        }
        
        .brushed-metal::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 60%
          );
          pointer-events: none;
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* IDENTITY HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative anodized brushed-metal border border-zinc-800/40 rounded-lg overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#2547D0]/20 to-zinc-700/20 rounded-lg blur-md" />
                <div
                  className="relative w-32 h-32 rounded-lg border border-zinc-700/40 shadow-2xl overflow-hidden"
                  style={getAvatarStyle(user.avatarId)}
                >
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-700/40">
                    <div className="w-2.5 h-2.5 bg-[#2547D0] rounded-full" />
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded mono text-[9px] bg-zinc-900/60 border border-zinc-800/40 text-zinc-400 uppercase tracking-wider mb-2">
                      <Shield className="w-3 h-3" />
                      Verified Identity
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                      {user.username}
                    </h1>
                    <div className="flex items-center gap-2 text-zinc-600 mono text-xs">
                      <span>
                        {user.id?.substring(0, 8)}...
                        {user.id?.substring((user.id?.length || 4) - 4)}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="mono text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                      Current Tier
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      {levelInfo.title}
                    </div>
                    <div className="mono text-xs text-zinc-600 mt-1">
                      Level {levelInfo.level}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "PXP Balance",
                      value: safePoints.toLocaleString(),
                    },
                    {
                      label: "Global Rank",
                      value: `#${user.rank ?? 0}`,
                    },
                    {
                      label: "Network",
                      value: safeReferralCount,
                    },
                    { 
                      label: "Status", 
                      value: "Active",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-900/40 border border-zinc-800/40 rounded-lg"
                    >
                      <p className="mono text-[9px] text-zinc-600 uppercase tracking-wider mb-1">
                        {stat.label}
                      </p>
                      <p className="text-base font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 pt-8 border-t border-zinc-800/40">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white mono">
                      {Math.round(levelInfo.progress)}%
                    </span>
                    <span className="mono text-xs text-zinc-600 font-medium">
                      COMPLETED
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mono text-[9px] text-zinc-600 uppercase tracking-wider mb-1">
                    Remaining
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-white mono">
                      {levelInfo.nextLevelPoints
                        ? (levelInfo.nextLevelPoints - user.points).toLocaleString()
                        : "MAX"}
                    </span>
                    <span className="mono text-[10px] text-zinc-600">PXP</span>
                  </div>
                </div>
              </div>

              {/* Progress Track */}
              <div className="relative h-2 w-full bg-zinc-900/60 rounded-full border border-zinc-800/40 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full bg-gradient-to-r from-[#2547D0] to-[#3B5FE0] rounded-full"
                />
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
            className="anodized brushed-metal border border-zinc-800/40 rounded-lg p-6"
          >
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Fingerprint className="w-4 h-4 text-zinc-500" />
              Identity Details
            </h2>

            <div className="space-y-4">
              {[
                { 
                  icon: Mail, 
                  label: "Email", 
                  value: user.email ?? "—" 
                },
                {
                  icon: Calendar,
                  label: "Joined",
                  value: joinDate,
                },
                {
                  icon: Award,
                  label: "Referral Code",
                  value: user.referralCode ?? "—",
                  copyable: true,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-900/40 transition-colors group"
                >
                  <div className="mt-0.5 p-2 bg-zinc-900/60 border border-zinc-800/40 rounded-md">
                    <item.icon className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mono text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium text-sm truncate mono">
                        {item.value}
                      </p>
                      {item.copyable && user.referralCode && (
                        <button
                          onClick={handleCopyReferralCode}
                          className="p-1 hover:bg-zinc-800/60 rounded transition-colors"
                        >
                          {copiedCode ? (
                            <Check className="w-3.5 h-3.5 text-[#2547D0]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Protocol Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="anodized brushed-metal border border-zinc-800/40 rounded-lg p-6"
          >
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Target className="w-4 h-4 text-zinc-500" />
              Protocol Stats
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  label: "Total Completed",
                  value: String(completedTasks.length),
                },
                {
                  icon: Users,
                  label: "Social Protocols",
                  value: `${completedSocialTasksCount}/${socialTasksList.length}`,
                },
                {
                  icon: Clock,
                  label: "Daily Protocols",
                  value: String(completedDailyTasksCount),
                },
                {
                  icon: TrendingUp,
                  label: "Daily Streak",
                  value: `${user.dailyStreak || 0} Days`,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900/60 border border-zinc-800/40 rounded-md">
                      <item.icon className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <span className="text-sm text-zinc-400">{item.label}</span>
                  </div>
                  <span className="text-white font-bold mono text-sm">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ACHIEVEMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="anodized brushed-metal border border-zinc-800/40 rounded-lg p-8"
        >
          <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
            <Award className="w-4 h-4 text-zinc-500" />
            Achievements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Early Adopter",
                desc: "Joined genesis waitlist",
                icon: Award,
                achieved: true,
              },
              {
                title: "Task Master",
                desc: "Completed 5+ protocols",
                icon: CheckCircle2,
                achieved: completedTasks.length >= 5,
              },
              {
                title: "Influencer",
                desc: "Referred 3+ users",
                icon: Users,
                achieved: safeReferralCount >= 3,
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-lg border transition-all ${
                  badge.achieved
                    ? "bg-zinc-900/60 border-zinc-700/40"
                    : "bg-zinc-900/20 border-zinc-800/20 opacity-40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${
                    badge.achieved
                      ? "bg-[#2547D0]/10 border-[#2547D0]/30"
                      : "bg-zinc-900/40 border-zinc-800/40"
                  }`}
                >
                  <badge.icon
                    className={`w-5 h-5 ${
                      badge.achieved ? "text-[#2547D0]" : "text-zinc-700"
                    }`}
                  />
                </div>
                <h3
                  className={`font-bold text-sm mb-1 ${
                    badge.achieved ? "text-white" : "text-zinc-600"
                  }`}
                >
                  {badge.title}
                </h3>
                <p className="mono text-[10px] text-zinc-600 uppercase tracking-wide">
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