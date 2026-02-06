"use client";

import React, { useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";
import { getTimeUntilDailyReset } from "../lib/waitlist-tasks";

export default function DailyTaskTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchTime = async () => {
      const initialTime = await getTimeUntilDailyReset();
      setTimeLeft(initialTime);

      let totalSeconds =
        initialTime.hours * 3600 +
        initialTime.minutes * 60 +
        initialTime.seconds;

      interval = setInterval(() => {
        totalSeconds -= 1;

        if (totalSeconds < 0) {
          clearInterval(interval);
          fetchTime();
          return;
        }

        setTimeLeft({
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        });
      }, 1000);
    };

    fetchTime();
    return () => clearInterval(interval);
  }, []);

  const totalSecondsLeft =
    timeLeft.hours * 3600 +
    timeLeft.minutes * 60 +
    timeLeft.seconds;

  const isUrgent = totalSecondsLeft < 3600;

  return (
    <div className="relative group w-full max-w-[220px]">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap");

        .timer-mono {
          font-family: "JetBrains Mono", monospace;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }

        .urgent-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {isUrgent && (
        <div className="absolute -inset-[1px] rounded-md bg-[#2547D0]/20 blur-sm urgent-glow" />
      )}

      <div
        className={`relative flex flex-col gap-1.5 p-1.5 bg-zinc-900/80 border rounded-md transition-all ${
          isUrgent
            ? "border-[#2547D0]/50"
            : "border-zinc-800/60 hover:border-zinc-700/60"
        }`}
      >
        {/* Header - More Compact */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1">
            <Clock
              className={`w-3 h-3 ${
                isUrgent ? "text-[#2547D0]" : "text-zinc-500"
              }`}
            />
            <span
              className={`timer-mono text-[8px] uppercase tracking-tighter font-medium ${
                isUrgent ? "text-[#2547D0]" : "text-zinc-500"
              }`}
            >
              Reset
            </span>
          </div>

          {isUrgent && (
            <div className="flex items-center gap-0.5 text-[#2547D0]">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span className="timer-mono text-[7px] uppercase font-bold">Live</span>
            </div>
          )}
        </div>

        {/* Timer - Optimized Space */}
        <div className="flex items-center justify-between bg-zinc-950/40 rounded py-1 px-1.5 border border-zinc-800/30">
          {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map(
            (val, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-baseline gap-0.5">
                  <span className={`timer-mono text-xs font-bold tabular-nums ${
                    isUrgent && idx === 2 ? "text-[#2547D0]" : "text-zinc-100"
                  }`}>
                    {String(val).padStart(2, "0")}
                  </span>
                  <span className="timer-mono text-[7px] text-zinc-600 font-bold uppercase">
                    {idx === 0 ? "h" : idx === 1 ? "m" : "s"}
                  </span>
                </div>
                
                {idx < 2 && (
                  <span className="text-zinc-800 text-[10px] font-bold mt-[-2px]">:</span>
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </div>
  );
}