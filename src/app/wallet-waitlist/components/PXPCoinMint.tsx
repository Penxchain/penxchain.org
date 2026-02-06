"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { getTimeUntilDailyReset } from '../lib/waitlist-tasks';

export default function DailyTaskTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchTime = async () => {
      const initialTime = await getTimeUntilDailyReset();
      setTimeLeft(initialTime);
      
      let totalSeconds = initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds;

      interval = setInterval(() => {
        totalSeconds -= 1;
        if (totalSeconds < 0) {
           clearInterval(interval);
           fetchTime();
           return;
        }
        
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        setTimeLeft({ hours: h, minutes: m, seconds: s });
      }, 1000);
    };

    fetchTime();

    return () => clearInterval(interval);
  }, []);

  const totalSecondsLeft = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const isUrgent = totalSecondsLeft < 3600;
  
  // Calculate angles for analog clock
  const secondAngle = (timeLeft.seconds / 60) * 360;
  const minuteAngle = ((timeLeft.minutes + timeLeft.seconds / 60) / 60) * 360;
  const hourAngle = ((timeLeft.hours % 12 + timeLeft.minutes / 60) / 12) * 360;

  return (
    <div className="relative group w-full max-w-md">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
        .timer-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .urgent-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Outer urgent glow */}
      {isUrgent && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#2547D0]/30 via-[#2547D0]/20 to-[#2547D0]/30 rounded-lg blur-sm urgent-glow" />
      )}

      <div className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 bg-zinc-900/60 border rounded-lg transition-all ${
        isUrgent 
          ? 'border-[#2547D0]/50' 
          : 'border-zinc-800/60 hover:border-zinc-700/60'
      }`}>
        
        {/* Left: Analog Clock (Hidden on mobile) */}
        <div className="hidden md:flex items-center justify-center flex-shrink-0">
          <div className="relative w-16 h-16">
            {/* Clock face */}
            <div className={`absolute inset-0 rounded-full border-2 transition-colors ${
              isUrgent 
                ? 'bg-[#2547D0]/10 border-[#2547D0]/30' 
                : 'bg-zinc-900/60 border-zinc-800/60'
            }`}>
              {/* Hour markers */}
              {[0, 3, 6, 9].map((hour) => (
                <div
                  key={hour}
                  className="absolute w-0.5 h-1.5 bg-zinc-700 rounded"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${hour * 30}deg) translateY(-24px)`,
                  }}
                />
              ))}
              
              {/* Center dot */}
              <div className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 ${
                isUrgent ? 'bg-[#2547D0]' : 'bg-zinc-600'
              }`} />
              
              {/* Hour hand */}
              <div
                className={`absolute top-1/2 left-1/2 w-0.5 h-5 rounded-full origin-bottom transition-colors ${
                  isUrgent ? 'bg-[#2547D0]' : 'bg-zinc-500'
                }`}
                style={{
                  transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              
              {/* Minute hand */}
              <div
                className={`absolute top-1/2 left-1/2 w-0.5 h-7 rounded-full origin-bottom transition-colors ${
                  isUrgent ? 'bg-[#2547D0]' : 'bg-zinc-400'
                }`}
                style={{
                  transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              
              {/* Second hand */}
              <div
                className={`absolute top-1/2 left-1/2 w-[1px] h-8 rounded-full origin-bottom ${
                  isUrgent ? 'bg-[#2547D0]' : 'bg-zinc-600'
                }`}
                style={{
                  transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
                  transition: 'transform 0.1s linear',
                }}
              />
            </div>
          </div>
        </div>

        {/* Middle: Digital Display */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 md:hidden ${
                isUrgent
                  ? 'bg-[#2547D0]/20 border-[#2547D0]/40'
                  : 'bg-zinc-900/60 border-zinc-800/60'
              }`}>
                <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                  isUrgent ? 'text-[#2547D0]' : 'text-zinc-600'
                }`} />
              </div>
              
              <span className={`timer-mono text-[9px] sm:text-[10px] uppercase tracking-wider font-medium truncate ${
                isUrgent ? 'text-[#2547D0]' : 'text-zinc-600'
              }`}>
                Protocol Reset
              </span>
            </div>
            
            {isUrgent && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-[#2547D0]/20 border border-[#2547D0]/30 rounded text-[#2547D0] timer-mono text-[8px] uppercase tracking-wider font-bold flex-shrink-0">
                <Zap className="w-2.5 h-2.5" />
                <span className="hidden xs:inline">Urgent</span>
              </span>
            )}
          </div>
          
          {/* Time Segments */}
          <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5">
            {/* Hours */}
            <div className="flex items-center gap-0.5">
              <div className="flex gap-0.5">
                <div className="w-6 h-8 sm:w-7 sm:h-9 bg-zinc-950/60 border border-zinc-800/60 rounded flex items-center justify-center">
                  <span className="timer-mono text-base sm:text-lg font-bold text-white tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')[0]}
                  </span>
                </div>
                <div className="w-6 h-8 sm:w-7 sm:h-9 bg-zinc-950/60 border border-zinc-800/60 rounded flex items-center justify-center">
                  <span className="timer-mono text-base sm:text-lg font-bold text-white tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')[1]}
                  </span>
                </div>
              </div>
              <span className="timer-mono text-[10px] text-zinc-700 mx-0.5">h</span>
            </div>

            {/* Separator */}
            <div className="flex flex-col gap-1 mx-0.5">
              <div className="w-0.5 h-0.5 bg-zinc-600 rounded-full" />
              <div className="w-0.5 h-0.5 bg-zinc-600 rounded-full" />
            </div>

            {/* Minutes */}
            <div className="flex items-center gap-0.5">
              <div className="flex gap-0.5">
                <div className="w-6 h-8 sm:w-7 sm:h-9 bg-zinc-950/60 border border-zinc-800/60 rounded flex items-center justify-center">
                  <span className="timer-mono text-base sm:text-lg font-bold text-white tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')[0]}
                  </span>
                </div>
                <div className="w-6 h-8 sm:w-7 sm:h-9 bg-zinc-950/60 border border-zinc-800/60 rounded flex items-center justify-center">
                  <span className="timer-mono text-base sm:text-lg font-bold text-white tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')[1]}
                  </span>
                </div>
              </div>
              <span className="timer-mono text-[10px] text-zinc-700 mx-0.5">m</span>
            </div>

            {/* Separator */}
            <div className="flex flex-col gap-1 mx-0.5">
              <div className="w-0.5 h-0.5 bg-zinc-600 rounded-full" />
              <div className="w-0.5 h-0.5 bg-zinc-600 rounded-full" />
            </div>

            {/* Seconds */}
            <div className="flex items-center gap-0.5">
              <div className="flex gap-0.5">
                <div className={`w-6 h-8 sm:w-7 sm:h-9 border rounded flex items-center justify-center transition-colors ${
                  isUrgent 
                    ? 'bg-[#2547D0]/10 border-[#2547D0]/30' 
                    : 'bg-zinc-950/60 border-zinc-800/60'
                }`}>
                  <span className={`timer-mono text-base sm:text-lg font-bold tabular-nums ${
                    isUrgent ? 'text-[#2547D0]' : 'text-white'
                  }`}>
                    {String(timeLeft.seconds).padStart(2, '0')[0]}
                  </span>
                </div>
                <div className={`w-6 h-8 sm:w-7 sm:h-9 border rounded flex items-center justify-center transition-colors ${
                  isUrgent 
                    ? 'bg-[#2547D0]/10 border-[#2547D0]/30' 
                    : 'bg-zinc-950/60 border-zinc-800/60'
                }`}>
                  <span className={`timer-mono text-base sm:text-lg font-bold tabular-nums ${
                    isUrgent ? 'text-[#2547D0]' : 'text-white'
                  }`}>
                    {String(timeLeft.seconds).padStart(2, '0')[1]}
                  </span>
                </div>
              </div>
              <span className={`timer-mono text-[10px] mx-0.5 ${
                isUrgent ? 'text-[#2547D0]' : 'text-zinc-700'
              }`}>s</span>
            </div>
          </div>
        </div>

        {/* Right: Status */}
        <div className="hidden sm:flex flex-shrink-0 items-center gap-2 px-3 py-2 bg-zinc-950/40 border border-zinc-800/60 rounded-lg">
          <div className={`w-1.5 h-1.5 rounded-full ${
            isUrgent ? 'bg-[#2547D0] animate-pulse' : 'bg-zinc-700'
          }`} />
          <span className="timer-mono text-[9px] text-zinc-600 uppercase tracking-wider">
            {isUrgent ? 'Alert' : 'Sync'}
          </span>
        </div>
      </div>
    </div>
  );
}