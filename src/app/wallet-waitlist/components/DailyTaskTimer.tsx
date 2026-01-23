"use client";

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getTimeUntilDailyReset } from '../lib/waitlist-tasks';

export default function DailyTaskTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(getTimeUntilDailyReset());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

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
