"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, Lock, Clock } from "lucide-react";
import * as ReactIcons from "react-icons/fa6";
import * as LucideIcons from "lucide-react";
import type { Task } from "../types/waitlist";

interface TaskCardProps {
  task: Task & { completed: boolean };
  onComplete: (taskId: string) => void;
  disabled?: boolean;
}

export default function TaskCard({
  task,
  onComplete,
  disabled,
}: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleComplete = async () => {
    if (task.completed || disabled || isCompleting) return;

    if (task.link && task.link !== "#") {
      window.open(task.link, "_blank");
    }

    setIsCompleting(true);

    const verificationTime =
      task.id === "daily-blog"
        ? 5 * 60 * 1000
        : Math.floor(Math.random() * (30000 - 20000 + 1) + 20000);
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, verificationTime - elapsed);
      setTimeLeft(remaining);

      if (remaining > 0) {
        requestAnimationFrame(tick);
      } else {
        onComplete(task.id);
        setIsCompleting(false);
      }
    };

    tick();
  };

  // Icon ID to Component mapping (matches admin ICON_OPTIONS)
  const ICON_MAP: Record<string, any> = {
    twitter: ReactIcons.FaXTwitter,
    telegram: ReactIcons.FaTelegram,
    discord: ReactIcons.FaDiscord,
    linkedin: ReactIcons.FaLinkedin,
    youtube: ReactIcons.FaYoutube,
    tiktok: ReactIcons.FaTiktok,
    instagram: ReactIcons.FaInstagram,
    blog: LucideIcons.BookOpen,
    like: LucideIcons.Heart,
    verification: LucideIcons.Shield,
    wallet: LucideIcons.Wallet,
    email: LucideIcons.Mail,
    profile: LucideIcons.User,
    refresh: LucideIcons.RefreshCw,
    link: ReactIcons.FaShareNodes,
    eye: LucideIcons.Eye,
    document: LucideIcons.FileText,
    retweet: ReactIcons.FaRetweet,
  };

  // Resolve icon: admin ID → component, or fallback chain
  let IconComponent: any = LucideIcons.Zap;
  const iconName = task.icon || "";

  if (iconName) {
    if (ICON_MAP[iconName]) {
      IconComponent = ICON_MAP[iconName];
    } else if (iconName.startsWith("Fa")) {
      IconComponent = (ReactIcons as any)[iconName] || LucideIcons.Zap;
    } else {
      const lucideIcon =
        (LucideIcons as any)[iconName] ||
        (LucideIcons as any)[
          iconName.charAt(0).toUpperCase() + iconName.slice(1)
        ];
      if (lucideIcon) {
        IconComponent = lucideIcon;
      }
    }
  }

  const isDisabled = task.completed || disabled;
  const isHint = task.id === "daily-hint";

  const ClockSpinner = ({ progress }: { progress: number }) => {
    const radius = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
        <svg
          className="absolute inset-0 transform -rotate-90 w-full h-full"
          viewBox="0 0 20 20"
        >
          <circle
            cx="10"
            cy="10"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="opacity-20"
          />
          <circle
            cx="10"
            cy="10"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-100 ease-linear"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center animate-spin"
          style={{ animationDuration: "2s" }}
        >
          <div className="w-[1px] h-2 bg-current -mt-1 origin-bottom rounded-full" />
        </div>
      </div>
    );
  };

  if (isHint) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group h-full font-mono"
      >
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap");

          .hint-card {
            font-family: "JetBrains Mono", monospace;
          }

          .metallic-shine {
            background: linear-gradient(
              135deg,
              rgba(212, 212, 216, 0.1) 0%,
              rgba(161, 161, 170, 0.15) 50%,
              rgba(212, 212, 216, 0.1) 100%
            );
          }
        `}</style>

        {/* Subtle metallic glow */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-zinc-400/20 via-zinc-500/10 to-zinc-600/20 rounded-xl blur-md" />

        <div className="hint-card relative p-4 sm:p-5 rounded-xl border border-zinc-500/30 bg-gradient-to-br from-zinc-900/60 via-zinc-800/40 to-zinc-900/60 backdrop-blur-xl h-full flex flex-col justify-center">
          {/* Metallic overlay */}
          <div className="absolute inset-0 metallic-shine rounded-xl opacity-40" />

          <div className="relative flex items-start gap-3 sm:gap-4">
            {/* Icon container */}
            <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-zinc-700/50 to-zinc-800/50 border border-zinc-500/30 flex items-center justify-center">
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-zinc-200 font-semibold text-sm sm:text-base mb-1.5 tracking-tight">
                {task.title}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isDisabled ? { y: -2 } : {}}
      className="relative group h-full flex flex-col font-mono"
    >
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap");

        .task-card {
          font-family: "JetBrains Mono", monospace;
        }

        .metallic-border {
          background: linear-gradient(
            135deg,
            rgba(161, 161, 170, 0.3) 0%,
            rgba(212, 212, 216, 0.2) 50%,
            rgba(161, 161, 170, 0.3) 100%
          );
        }

        .metallic-bg {
          background: linear-gradient(
            135deg,
            rgba(24, 24, 27, 0.95) 0%,
            rgba(39, 39, 42, 0.9) 50%,
            rgba(24, 24, 27, 0.95) 100%
          );
        }

        .chrome-shine {
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 45%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 55%,
            transparent 100%
          );
          background-size: 200% 100%;
          transition: background-position 0.6s ease;
        }

        .group:hover .chrome-shine {
          background-position: -100% 0;
        }

        .steel-texture {
          background-image:
            linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
        }
      `}</style>

      {/* Completion state - silver glow */}
      {task.completed && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-zinc-400/40 via-zinc-300/30 to-zinc-400/40 rounded-xl blur-sm" />
      )}

      {/* Hover glow - PENXCHAIN blue accent */}
      {!isDisabled && !task.completed && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#2547D0]/30 via-zinc-400/20 to-[#2547D0]/30 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
      )}

      <div
        className={`task-card relative p-4 sm:p-5 rounded-xl border backdrop-blur-xl transition-all h-full flex flex-col justify-between steel-texture overflow-hidden ${
          task.completed
            ? "metallic-bg border-zinc-400/40 shadow-[0_4px_20px_rgba(161,161,170,0.15)]"
            : "metallic-bg border-zinc-700/40 group-hover:border-zinc-500/50 group-hover:shadow-[0_4px_24px_rgba(113,113,122,0.12)]"
        }`}
      >
        {/* Chrome shine effect on hover */}
        {!task.completed && <div className="absolute inset-0 chrome-shine" />}

        {/* Header Section */}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-lg border transition-all ${
                task.completed
                  ? "bg-gradient-to-br from-zinc-600/40 to-zinc-700/40 border-zinc-400/40"
                  : "bg-gradient-to-br from-zinc-800/60 to-zinc-900/60 border-zinc-700/40 group-hover:border-zinc-500/50 group-hover:from-zinc-700/60 group-hover:to-zinc-800/60"
              } flex items-center justify-center`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300" />
              ) : (
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 group-hover:text-[#2547D0] transition-colors" />
              )}
            </div>

            {/* Points Badge */}
            <div
              className={`flex-shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md border transition-all ${
                task.completed
                  ? "bg-zinc-700/40 border-zinc-500/40 text-zinc-300"
                  : "bg-zinc-800/50 border-zinc-700/40 text-zinc-400 group-hover:bg-[#2547D0]/10 group-hover:border-[#2547D0]/30 group-hover:text-[#2547D0]"
              }`}
            >
              <span className="text-[10px] sm:text-xs font-bold tracking-wider">
                +{task.points} PXP
              </span>
            </div>
          </div>

          {/* Task Info */}
          <div className="mb-4 sm:mb-6">
            <h3
              className={`font-semibold text-sm sm:text-base mb-1.5 tracking-tight transition-colors ${
                task.completed
                  ? "text-zinc-200"
                  : "text-zinc-300 group-hover:text-[#2547D0]"
              }`}
            >
              {task.title}
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-auto">
          {/* Task Type Badge */}
          <div className="flex items-center gap-2">
            {task.repeatable ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/40 border border-zinc-700/40 rounded-md">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">
                  Daily
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/40 border border-zinc-700/40 rounded-md">
                <Lock className="w-3 h-3 text-zinc-500" />
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">
                  Once
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleComplete}
            disabled={isDisabled || isCompleting}
            className={`w-full sm:w-auto min-w-[110px] px-4 py-2.5 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              task.completed
                ? "bg-gradient-to-r from-zinc-700/60 to-zinc-600/60 border border-zinc-500/40 text-zinc-300 cursor-default"
                : isCompleting
                  ? "bg-zinc-800/60 border border-zinc-600/40 text-zinc-400"
                  : "bg-gradient-to-r from-[#2547D0] to-[#1e3ab3] hover:from-[#1e3ab3] hover:to-[#2547D0] border border-[#2547D0]/50 text-white shadow-lg shadow-[#2547D0]/20 hover:shadow-[#2547D0]/40"
            }`}
          >
            {task.completed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete</span>
              </>
            ) : isCompleting ? (
              <div className="flex items-center gap-2">
                <ClockSpinner
                  progress={
                    timeLeft > 0
                      ? (timeLeft /
                          (task.id === "daily-blog" ? 300000 : 30000)) *
                        100
                      : 0
                  }
                />
                <span className="font-mono tabular-nums text-xs">
                  {task.id === "daily-blog"
                    ? `${Math.floor(timeLeft / 60000)}:${String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0")}`
                    : `${(timeLeft / 1000).toFixed(1)}s`}
                </span>
              </div>
            ) : (
              <>
                <span>Execute</span>
                {task.link && task.link !== "#" && (
                  <ExternalLink className="w-3.5 h-3.5" />
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
