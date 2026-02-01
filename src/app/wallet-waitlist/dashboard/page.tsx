"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/api-client";
import {
  Target,
  Zap,
  Users,
  TrendingUp,
  Trophy,
  Activity,
  Wallet,
} from "lucide-react";
import { FaListCheck, FaCalendarDay } from "react-icons/fa6";
import WaitlistLayout from "../components/WaitlistLayout";
import TaskCard from "../components/TaskCard";
import { TaskSkeleton } from "../components/Skeletons";
import ReferralCard from "../components/ReferralCard";
import DailyTaskTimer from "../components/DailyTaskTimer";
import LeaderboardTable from "../components/LeaderboardTable";
import PXPCoinMint from "../components/PXPCoinMint";
import { getCurrentUser } from "../lib/waitlist-auth";
import {
  getSocialTasks,
  getDailyTasks,
  getOneTimeTasks,
  completeTask,
  getTasks,
} from "../lib/waitlist-tasks";
import { fetchLeaderboard, getLevelInfo } from "../lib/waitlist-data";
import { User, Task } from "../types/waitlist";
import type { LeaderboardEntry } from "../types/waitlist";
import PXPSpinner from "../components/PXPSpinner";
import BonusPXPModal from "../components/BonusPXPModal";
import {
  canClaimBonus,
  getHoursUntilNextBonus,
  getBonusAmount,
} from "../lib/bonus-pxp";
import { updateCurrentUser } from "../lib/waitlist-auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [socialTasks, setSocialTasks] = useState<
    (Task & { completed: boolean })[]
  >([]);
  const [dailyTasks, setDailyTasks] = useState<
    (Task & { completed: boolean })[]
  >([]);
  const [oneTimeTasks, setOneTimeTasks] = useState<
    (Task & { completed: boolean })[]
  >([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBonusTooltip, setShowBonusTooltip] = useState(false);
  const [showBonusReward, setShowBonusReward] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    const initData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/wallet-waitlist");
        return;
      }
      setUser(currentUser);

      try {
        const tasks = await getTasks();
        setSocialTasks(getSocialTasks(tasks));
        setDailyTasks(getDailyTasks(tasks));
        setOneTimeTasks(getOneTimeTasks(tasks));
        
        await updateLeaderboardData();
      } catch (err) {
        console.error("Failed to load tasks", err);
      } finally {
        setLoadingTasks(false);
      }
    };

    initData();
  }, [router]);

  useEffect(() => {
    const handleUserUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<User>;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      }
    };

    window.addEventListener("penxchain:user-updated", handleUserUpdate);
    return () => window.removeEventListener("penxchain:user-updated", handleUserUpdate);
  }, []);

  const updateLeaderboardData = async () => {
    try {
      const allUsers = await fetchLeaderboard();
      const entries: LeaderboardEntry[] = allUsers.map((u, index) => ({
        rank: index + 1,
        user: { ...u, rank: index + 1 },
      }));
      setLeaderboard(entries);
    } catch (error) {
      console.error("Failed to update leaderboard", error);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    const result = await completeTask(taskId);

    if (result.success && result.points) {
      setPointsEarned(result.points);
      setShowConfetti(true);

      const updatedUser = getCurrentUser();
      const tasks = await getTasks();
      setSocialTasks(getSocialTasks(tasks));
      setDailyTasks(getDailyTasks(tasks));

      if (updatedUser) {
        setUser(updatedUser);
        await updateLeaderboardData();
      }
    }
  };

  const handleBonusClaim = async () => {
    try {
       const result = await apiRequest<{ success: boolean; points: number; bonusEarned: number }>('/waitlist/bonus/claim', { method: 'POST' });
       if (result.ok && result.data.success) {
           const updatedUser = updateCurrentUser({
               points: result.data.points,
               lastBonusClaim: new Date().toISOString()
           });
           if (updatedUser) {
             setUser(updatedUser);
             window.dispatchEvent(new CustomEvent('penxchain:user-updated', { detail: updatedUser }));
           }
           setShowBonusReward(true);
           setShowBonusTooltip(false);
           await updateLeaderboardData();
       } else {
           console.log("Bonus claim not available:", result.ok ? result.data : result.error?.message);
       }
    } catch (e) {
        console.error("Bonus claim error:", e);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <PXPSpinner size={48} />
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/50">
            INITIALIZING_SYSTEM
          </span>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(Number(user.points ?? 0));
  const completedSocialTasks = socialTasks.filter((t) => t.completed).length;
  const completedDailyTasks = dailyTasks.filter((t) => t.completed).length;
  const safeCompletedTasks = Array.isArray(user.completedTasks)
    ? user.completedTasks
    : [];
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
        
        .fine-grid {
          background-image: 
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 50px 50px;
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

      {pointsEarned !== null && (
        <PXPCoinMint
          points={pointsEarned}
          onComplete={() => setPointsEarned(null)}
          trigger={true}
        />
      )}

      {showBonusReward && (
        <BonusPXPModal
          amount={getBonusAmount()}
          nextAvailableIn={24}
          onClose={() => setShowBonusReward(false)}
        />
      )}

      <div className="space-y-12 md:space-y-16">
        {/* IDENTITY HEADER */}
        <section className="relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="pt-8 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            {/* Identity */}
            <div className="lg:col-span-2">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-3 uppercase leading-none"
              >
                {user.username}
              </motion.h1>
              <div className="flex flex-wrap items-center gap-3 text-[10px] mono text-zinc-600 tracking-wider">
                <span className="px-2 py-1 bg-zinc-900/40 border border-zinc-800/40 rounded">
                  ID: {user.id?.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-zinc-800">×</span>
                <span>RANK #{user.rank}</span>
                <span className="text-zinc-800">×</span>
                <span className="uppercase">{levelInfo.title}</span>
              </div>
            </div>

            {/* Core */}
            <div className="flex justify-start lg:justify-end">
              <div
                className="relative w-32 h-32 cursor-pointer group"
                onClick={(e) => {
                  const now = Date.now();
                  if (now - lastClickTime < 500) {
                    if (canClaimBonus(user)) {
                       handleBonusClaim();
                    }
                    setClickCount(0);
                    setLastClickTime(0);
                  } else {
                    setClickCount(1);
                    setLastClickTime(now);
                  }
                }}
                onMouseEnter={() => setShowBonusTooltip(true)}
                onMouseLeave={() => setShowBonusTooltip(false)}
              >
                <svg className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2547D0" />
                      <stop offset="100%" stopColor="#3B5FE0" />
                    </linearGradient>
                  </defs>
                  
                  <circle cx="64" cy="64" r="58" className="stroke-zinc-900" strokeWidth="2" fill="none" />
                  <circle cx="64" cy="64" r="54" className="stroke-zinc-900/40" strokeWidth="8" fill="none" />
                  
                  <motion.circle
                    initial={{ strokeDashoffset: 339 }}
                    animate={{ strokeDashoffset: 339 - (339 * levelInfo.progress) / 100 }}
                    transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="url(#pg)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="339"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    key={levelInfo.progress}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-black text-white mono"
                  >
                    {Math.round(levelInfo.progress)}%
                  </motion.span>
                  <span className="text-[8px] mono text-zinc-600 font-medium tracking-widest mt-0.5">
                    SYNC
                  </span>
                </div>

                {canClaimBonus(user) && (
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2547D0] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2547D0]"></span>
                    </span>
                  </div>
                )}

                {showBonusTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap"
                  >
                    <div className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md">
                      <p className="mono text-[10px] text-white">
                        {canClaimBonus(user) ? (
                          <span className="text-[#2547D0]">
                            Double-tap: +{getBonusAmount()} PXP
                          </span>
                        ) : (
                          <span className="text-zinc-500">
                            Cooldown: {getHoursUntilNextBonus(user)}h
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </section>

        {/* STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-900/30">
          {[
            { label: "Balance", value: safePoints.toLocaleString(), unit: "PXP" },
            { label: "Completed", value: safeCompletedTasks.length, unit: "Tasks" },
            { label: "Network", value: safeReferralCount, unit: "Refs" },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative anodized brushed-metal p-6 group hover:bg-zinc-900/40 transition-colors"
            >
              <p className="mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2 font-medium">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white group-hover:text-zinc-100 transition-colors">
                  {stat.value}
                </p>
                <span className="mono text-xs text-zinc-700 font-medium">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* TASKS */}
          <div className="lg:col-span-8 space-y-12">
            {/* Daily */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                  Priority Protocols
                </h2>
                <DailyTaskTimer />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loadingTasks ? (
                  <>
                    <TaskSkeleton />
                    <TaskSkeleton />
                  </>
                ) : (
                  dailyTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} />
                  ))
                )}
              </div>
            </section>

            {/* One-time */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                  Core Verification
                </h2>
                <span className="mono text-[10px] text-zinc-600 font-medium">
                  {oneTimeTasks.filter(t => t.completed).length}/{oneTimeTasks.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {loadingTasks ? (
                  <>
                    <TaskSkeleton />
                    <TaskSkeleton />
                    <TaskSkeleton />
                  </>
                ) : (
                  oneTimeTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} />
                  ))
                )}
              </div>
            </section>

            {/* Social */}
            {(loadingTasks || socialTasks.length > 0) && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                    Ecosystem Expansion
                  </h2>
                  <span className="mono text-[10px] text-zinc-600 font-medium">
                    {socialTasks.filter(t => t.completed).length}/{socialTasks.length}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {loadingTasks ? (
                    <>
                      <TaskSkeleton />
                      <TaskSkeleton />
                    </>
                  ) : (
                    socialTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} />
                    ))
                  )}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <ReferralCard user={user} />

            <div className="anodized brushed-metal border border-zinc-800/40 rounded-lg overflow-hidden">
              <div className="p-5 border-b border-zinc-800/40 flex items-center justify-between">
                <h3 className="font-bold text-white text-xs uppercase tracking-widest">
                  Top Earners
                </h3>
                <a
                  href="/wallet-waitlist/leaderboard"
                  className="mono text-[10px] text-zinc-500 hover:text-white transition-colors font-medium"
                >
                  VIEW_ALL
                </a>
              </div>
              <div className="p-4">
                <LeaderboardTable
                  entries={leaderboard}
                  currentUserId={user.id}
                  compact
                />
              </div>
            </div>

            <div className="relative anodized brushed-metal border border-zinc-800/40 rounded-lg p-8 overflow-hidden group">
              <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
                <div className="w-12 h-12 rounded-lg bg-zinc-900/60 flex items-center justify-center mb-3 border border-zinc-800/40">
                  <Target className="w-5 h-5 text-zinc-700" />
                </div>
                <p className="mono text-xs font-bold text-white uppercase tracking-wider">
                  Restricted
                </p>
                <p className="mono text-[10px] text-zinc-700 mt-1">
                  Q2 2026
                </p>
              </div>

              <div className="opacity-20 blur-sm pointer-events-none">
                <h4 className="font-bold text-lg text-white mb-2">
                  Staking Protocol
                </h4>
                <p className="text-sm text-zinc-400 mb-4">
                  Lock PXP to earn 15% APY
                </p>
                <div className="h-1 w-full bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WaitlistLayout>
  );
}