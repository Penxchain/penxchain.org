"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, Lock, Clock } from 'lucide-react';
import * as ReactIcons from 'react-icons/fa6';
import * as LucideIcons from 'lucide-react';
import type { Task } from '../types/waitlist';

interface TaskCardProps {
  task: Task & { completed: boolean };
  onComplete: (taskId: string) => void;
  disabled?: boolean;
}

export default function TaskCard({ task, onComplete, disabled }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleComplete = async () => {
    if (task.completed || disabled || isCompleting) return;

    if (task.link && task.link !== '#') {
      window.open(task.link, '_blank');
    }

    setIsCompleting(true);
    
    const verificationTime = task.id === 'daily-blog' 
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

  let IconComponent: any;
  if (task.icon.startsWith('Fa')) {
    IconComponent = (ReactIcons as any)[task.icon] || LucideIcons.Star;
  } else {
    IconComponent = (LucideIcons as any)[task.icon] || LucideIcons.Star;
  }

  const isDisabled = task.completed || disabled;
  const isHint = task.id === 'daily-hint';

  const ClockSpinner = ({ progress }: { progress: number }) => {
    const radius = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-5 h-5 flex items-center justify-center">
        <svg className="absolute inset-0 transform -rotate-90 w-full h-full" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r={radius} stroke="currentColor" strokeWidth="2" fill="none" className="opacity-20" />
            <circle 
                cx="10" cy="10" r={radius} 
                stroke="currentColor" strokeWidth="2" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-100 ease-linear"
            />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '2s' }}>
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
        className="relative group h-full" // Added h-full
      >
        <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl opacity-70 group-hover:opacity-100 blur-md transition-opacity animate-pulse" />
        
        <div className="relative p-5 rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 backdrop-blur-md h-full flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center bg-yellow-500/10 text-yellow-400 animate-pulse">
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-yellow-400 font-bold mb-1 tracking-tight flex items-center gap-2">
                {task.title}
              </h3>
              <p className="text-yellow-400/70 text-sm font-medium leading-relaxed italic">
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
      className="relative group h-full flex flex-col" // Added h-full and flex
    >
      {/* Refined Web3 Hover Glow: Using a sleeker Indigo/Blue gradient */}
      {!isDisabled && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#2547D0]/40 via-[#2547D0]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
      )}

      <div
        className={`relative p-5 rounded-xl border backdrop-blur-md transition-all h-full flex flex-col justify-between ${
          task.completed
            ? 'bg-[#0ce50c]/5 border-[#0ce50c]/20'
            : 'bg-[#0A0A0B]/60 border-white/5 group-hover:border-[#2547D0]/40 group-hover:bg-[#2547D0]/5'
        }`}
      >
        {/* Header Section */}
        <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div
                className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${
                  task.completed
                    ? 'bg-[#0ce50c]/10 text-[#0ce50c]'
                    : 'bg-white/5 text-white/80 group-hover:text-[#2547D0] group-hover:bg-[#2547D0]/10 transition-colors'
                }`}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </div>

              <div
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                  task.completed
                    ? 'bg-[#0ce50c]/10 text-[#0ce50c]'
                    : 'bg-[#2547D0]/10 text-[#2547D0] border border-[#2547D0]/20'
                }`}
              >
                +{task.points} PXP
              </div>
            </div>

            <div className="mb-6">
                <h3 className="text-white font-bold mb-1 tracking-tight group-hover:text-[#2547D0] transition-colors">
                    {task.title}
                </h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                    {task.description}
                </p>
            </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {task.repeatable ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-white/40 text-[10px] uppercase tracking-wider font-mono">
                <Clock className="w-3 h-3" />
                Daily
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-white/40 text-[10px] uppercase tracking-wider font-mono">
                <Lock className="w-3 h-3" />
                Once
              </span>
            )}
          </div>

          <button
            onClick={handleComplete}
            disabled={isDisabled || isCompleting}
            className={`min-w-[110px] px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              task.completed
                ? 'bg-[#0ce50c]/10 text-[#0ce50c] cursor-default'
                : isCompleting 
                    ? 'bg-[#2547D0]/20 text-[#2547D0] border border-[#2547D0]/30'
                    : 'bg-[#2547D0] hover:bg-[#1e3ab3] text-white shadow-lg shadow-[#2547D0]/20 hover:shadow-[#2547D0]/40'
            }`}
          >
            {task.completed ? (
              <><CheckCircle2 className="w-3.5 h-3.5" /> Done</>
            ) : isCompleting ? (
              <div className="flex items-center gap-2">
                <ClockSpinner progress={timeLeft > 0 ? (timeLeft / (task.id === 'daily-blog' ? 300000 : 30000)) * 100 : 0} />
                <span className="font-mono tabular-nums">
                  {task.id === 'daily-blog' 
                    ? `${Math.floor(timeLeft / 60000)}:${String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0')}`
                    : `${(timeLeft / 1000).toFixed(1)}s`
                  }
                </span>
              </div>
            ) : (
              <><span className="mt-0.5">Execute</span> {task.link && task.link !== '#' && <ExternalLink className="w-3.5 h-3.5" />}</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}