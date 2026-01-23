"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Zap, Users, TrendingUp, Trophy, Activity, Wallet } from 'lucide-react';
import { FaListCheck, FaCalendarDay } from 'react-icons/fa6';
import WaitlistLayout from '../components/WaitlistLayout';
import TaskCard from '../components/TaskCard';
import ReferralCard from '../components/ReferralCard';
import DailyTaskTimer from '../components/DailyTaskTimer';
import LeaderboardTable from '../components/LeaderboardTable';
import PXPCoinMint from '../components/PXPCoinMint';
import { getCurrentUser } from '../lib/waitlist-auth';
import { getSocialTasks, getDailyTasks, completeTask } from '../lib/waitlist-tasks';
import { sampleUsers, getLevelInfo } from '../lib/waitlist-data';
import { User } from '../types/waitlist';
import type { LeaderboardEntry } from '../types/waitlist';
import PXPSpinner from '../components/PXPSpinner';
import BonusPXPModal from '../components/BonusPXPModal';
import { canClaimBonus, getHoursUntilNextBonus, getBonusAmount } from '../lib/bonus-pxp';
import { updateCurrentUser } from '../lib/waitlist-auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [socialTasks, setSocialTasks] = useState(getSocialTasks());
  const [dailyTasks, setDailyTasks] = useState(getDailyTasks());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBonusTooltip, setShowBonusTooltip] = useState(false);
  const [showBonusReward, setShowBonusReward] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/wallet-waitlist');
      return;
    }
    setUser(currentUser);
    updateLeaderboard(currentUser);
  }, [router]);

  const updateLeaderboard = (currentUser: User) => {
    const allUsers = [...sampleUsers];
    const currentUserIndex = allUsers.findIndex((u) => u.id === currentUser.id);
    
    if (currentUserIndex !== -1) {
      allUsers[currentUserIndex] = currentUser;
    } else {
      allUsers.push(currentUser);
    }

    const sorted = allUsers.sort((a, b) => b.points - a.points);
    const entries: LeaderboardEntry[] = sorted.map((u, index) => ({
      rank: index + 1,
      user: { ...u, rank: index + 1 },
    }));

    setLeaderboard(entries);
  };

  const handleTaskComplete = async (taskId: string) => {
    const result = completeTask(taskId);

    if (result.success && result.points) {
      setPointsEarned(result.points);
      setShowConfetti(true);

      const updatedUser = getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
        updateLeaderboard(updatedUser);
      }

      setSocialTasks(getSocialTasks());
      setDailyTasks(getDailyTasks());
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <PXPSpinner size={48} />
           <span className="text-[10px] font-mono tracking-[0.3em] text-white/50">INITIALIZING_SYSTEM</span>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(user.points);
  const completedSocialTasks = socialTasks.filter((t) => t.completed).length;
  const completedDailyTasks = dailyTasks.filter((t) => t.completed).length;

  return (
    <WaitlistLayout>
      {/* Regular task completion rewards */}
      {pointsEarned !== null && (
        <PXPCoinMint points={pointsEarned} onComplete={() => setPointsEarned(null)} />
      )}

      {/* Bonus PXP celebration */}
      {showBonusReward && (
        <BonusPXPModal 
          amount={getBonusAmount()}
          nextAvailableIn={24}
          onClose={() => setShowBonusReward(false)}
        />
      )}

      <div className="space-y-16">
        {/* IDENTITY NODE HEADER - HYPER MINIMALIST */}
        <section className="relative pt-6">
           {/* Technical Lines */}
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2547D0]/50 to-transparent" />
           <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5" />
           
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 items-end pb-8">
              {/* Left: User Identity */}
              <div className="lg:col-span-2">
                 <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 uppercase">
                    {user.username}
                 </h1>
                 <p className="font-mono text-[10px] text-white/30 tracking-widest break-all">
                    ID: {user.id.toUpperCase()} // HASH: {user.id.split('').reverse().join('').slice(0,12)}...
                 </p>
              </div>

              {/* Middle: Rank & Tier */}
              <div>
                 <div className="flex flex-col gap-6 border-l border-white/5 pl-8">
                    <div>
                         <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">Current Tier</p>
                         <p className="text-xl font-bold text-white uppercase">{levelInfo.title}</p>
                    </div>
                    <div>
                         <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">Global Rank</p>
                         <p className="text-xl font-bold text-white">#{user.rank}</p>
                    </div>
                 </div>
              </div>
              {/* RIGHT: PXP CORE SYNCHRONIZER */}
<div className="flex items-center justify-end">
  <div 
    className="relative w-28 h-28 cursor-pointer group/core"
    onClick={(e) => {
      const now = Date.now();
      if (now - lastClickTime < 500) {
        if (canClaimBonus(user)) {
          const bonusAmount = getBonusAmount();
          const updatedUser = {
            ...user,
            points: user.points + bonusAmount,
            lastBonusClaim: new Date().toISOString(),
          };
          setUser(updatedUser);
          updateCurrentUser({ points: updatedUser.points, lastBonusClaim: updatedUser.lastBonusClaim });
          setShowBonusReward(true);
          setShowBonusTooltip(false);
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
    {/* OUTER ROTATING AURA (Only visible when bonus is ready) */}
    {canClaimBonus(user) && (
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-2 border border-dashed border-[#2547D0]/30 rounded-full"
      />
    )}

    {/* THE CORE SVG */}
    <svg className="w-full h-full transform -rotate-90">
      <defs>
        <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2547D0" />
          <stop offset="100%" stopColor="#0ce50c" />
        </linearGradient>
        <filter id="coreGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* TRACK 1: Outer Technical Ring (Background) */}
      <circle cx="56" cy="56" r="50" className="stroke-white/5" strokeWidth="1" fill="none" strokeDasharray="4 4" />

      {/* TRACK 2: Main Progress (Segmented) */}
      <circle 
        cx="56" cy="56" r="46" 
        className="stroke-white/[0.03]" 
        strokeWidth="8" 
        fill="none" 
      />
      
      <motion.circle 
        initial={{ strokeDashoffset: 289 }}
        animate={{ strokeDashoffset: 289 - (289 * levelInfo.progress) / 100 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        cx="56" cy="56" r="46" 
        stroke="url(#coreGradient)"
        strokeWidth="8" 
        fill="none" 
        strokeDasharray="289"
        strokeLinecap="round"
        style={{ filter: 'url(#coreGlow)' }}
      />

      {/* TRACK 3: Inner Micro-Ticks */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="56" y1="18" x2="56" y2="22"
          transform={`rotate(${i * 30} 56 56)`}
          className={ (i / 12) * 100 <= levelInfo.progress ? "stroke-[#2547D0]/50" : "stroke-white/10"}
          strokeWidth="2"
        />
      ))}
    </svg>

    {/* CENTER DATA NODE */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <motion.span 
        key={levelInfo.progress}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-xl font-black text-white font-mono leading-none"
      >
        {Math.round(levelInfo.progress) + '%'}
      </motion.span>
      <span className="text-[7px] font-mono text-[#2547D0] font-bold tracking-widest mt-1">SYNC</span>
    </div>

    {/* STATUS PULSE (Bonus Ready Indicator) */}
    {canClaimBonus(user) && (
      <div className="absolute -top-1 right-2 flex items-center justify-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ce50c] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0ce50c]"></span>
        </span>
      </div>
    )}
    
    {/* TOOLTIP (Native Look) */}
    {showBonusTooltip && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="relative px-3 py-2 bg-black border border-[#2547D0]/50 rounded-md shadow-[0_0_20px_rgba(37,71,208,0.2)]">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-t border-l border-[#2547D0]/50 rotate-45" />
          <p className="text-[9px] font-mono text-white whitespace-nowrap uppercase tracking-tighter">
            {canClaimBonus(user) 
              ? <span className="text-[#0ce50c] animate-pulse">Ready: Double-Tap +{getBonusAmount()} PXP</span>
              : `Protocol cooldown: ${getHoursUntilNextBonus(user)}h`
            }
          </p>
        </div>
      </motion.div>
    )}
  </div>
</div>
            </div>
        </section>

        {/* DATA TICKER - REPLACED GRID */}
        <div className="flex flex-col md:flex-row border-y border-white/5 bg-[#050505]/50 backdrop-blur-sm">
           {[
              { label: "PXP Balance", value: user.points.toLocaleString(), unit: "PXP" },
              { label: "Tasks Completed", value: user.completedTasks.length.toString(), unit: "DONE" },
              { label: "Network Size", value: user.referralCount.toString(), unit: "REFERRALS" },
           ].map((stat, i) => (
             <div key={i} className="flex-1 py-6 px-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors border-b md:border-b-0 md:border-r border-white/5 last:border-0">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover:text-[#2547D0] transition-colors">
                   {stat.label}
                </span>
                <div className="text-right">
                   <div className="text-xl font-bold text-white group-hover:scale-105 transition-transform origin-right">
                      {stat.value}
                   </div>
                   <div className="text-[9px] font-mono text-white/20 text-right">{stat.unit}</div>
                </div>
             </div>
           ))}
           <div className="flex-1 py-6 px-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover:text-[#2547D0] transition-colors">
                 System Yield
              </span>
              <div className="text-right">
                  <div className="text-xl font-bold text-white flex items-center gap-2 justify-end">
                     +12.5% <TrendingUp className="w-3 h-3 text-[#2547D0]" />
                  </div>
                  <div className="text-[9px] font-mono text-white/20">APY (EST)</div>
              </div>
           </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* LEFT: TASKS (8 cols) */}
           <div className="lg:col-span-8 space-y-16">
              
              {/* Time-Sensitive Protocols */}
              <section>
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] border-l-2 border-[#2547D0] pl-4">
                       Priority Protocols
                    </h2>
                    <DailyTaskTimer />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-lg">
                    {dailyTasks.map((task, i) => (
                       <div key={task.id} className="bg-[#020202] p-1">
                          <TaskCard task={task} onComplete={handleTaskComplete} />
                       </div>
                    ))}
                 </div>
              </section>

              {/* Core Protocols */}
              <section>
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] border-l-2 border-white/20 pl-4">
                       Core Verification
                    </h2>
                    <span className="text-[10px] font-mono text-white/30">
                       {completedSocialTasks}/{socialTasks.length} EXECUTED
                    </span>
                 </div>
                 <div className="space-y-4">
                    {socialTasks.map((task, i) => (
                       <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                          <TaskCard task={task} onComplete={handleTaskComplete} />
                       </motion.div>
                    ))}
                 </div>
              </section>

           </div>

           {/* RIGHT: SIDEBAR (4 cols) */}
           <div className="lg:col-span-4 space-y-8">
              <ReferralCard user={user} />
              
              <div className="border border-white/5 rounded-xl p-0 overflow-hidden bg-[#030303]">
                 <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-white text-xs uppercase tracking-widest">Top Earners</h3>
                    <a href="/wallet-waitlist/leaderboard" className="text-[10px] text-[#2547D0] hover:text-white transition-colors font-mono">VIEW_ALL</a>
                 </div>
                 <div className="p-4">
                    <LeaderboardTable entries={leaderboard} currentUserId={user.id} compact />
                 </div>
              </div>

               {/* Locked Feature Card */}
               <div className="relative p-8 rounded-xl border border-white/5 bg-[#050505] overflow-hidden group">
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 bg-[#020202]/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 transition-all group-hover:backdrop-blur-none group-hover:bg-[#020202]/60">
                     <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10 group-hover:border-[#2547D0]/50 transition-colors">
                        <Target className="w-4 h-4 text-white/40 group-hover:text-[#2547D0]" />
                     </div>
                     <p className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em]">Access Restricted</p>
                     <p className="text-[9px] font-mono text-white/30 mt-1">COMING S.2026</p>
                  </div>
                  
                  {/* Blurred Content */}
                  <div className="opacity-30 blur-sm pointer-events-none">
                     <h4 className="font-bold text-lg text-white mb-2">Staking Multiplier</h4>
                     <p className="text-xs text-white/60 leading-relaxed">
                        Lock your PXP tokens to earn up to 15% APY compounding rewards.
                     </p>
                     <div className="mt-4 h-1 w-full bg-white/10 rounded-full" />
                  </div>
               </div>
           </div>

        </div>
      </div>
    </WaitlistLayout>
  );
}
