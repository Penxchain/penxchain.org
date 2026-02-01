"use client";

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getTimeUntilDailyReset } from '../lib/waitlist-tasks';

export default function DailyTaskTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchTime = async () => {
      const initialTime = await getTimeUntilDailyReset();
      setTimeLeft(initialTime);
      
      // Calculate countdown locally after initial sync to avoid spamming API
      // Total seconds
      let totalSeconds = initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds;

      interval = setInterval(() => {
        totalSeconds -= 1;
        if (totalSeconds < 0) {
           // Refetch or reset? Refetch to be safe with server
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

  return (
    <div className="flex items-center gap-3 p-4 bg-[#0052ff]/5 border border-[#0052ff]/10 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-[#0052ff]/10 flex items-center justify-center">
        <Clock className="w-5 h-5 text-[#0052ff]" />
      </div>
      <div className="flex-1">
        <p className="text-white font-medium text-sm mb-0.5">Daily Reset In</p>
        <div className="flex items-center gap-2 text-white/70">
          <span className="font-mono text-sm tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
