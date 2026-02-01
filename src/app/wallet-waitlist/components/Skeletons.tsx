import React from 'react';

/**
 * THE ETHEREAL COMPONENT
 * * Concept: The "LightBeam". 
 * Instead of a gray block, it is a container of trapped light.
 * The animation is a slow, liquid flow (via-white/30) rather than a sharp line.
 */
const LightBeam = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <div 
    className={`relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5 ${className}`}
  >
    {/* The Internal Light Source - A slow moving aurora */}
    <div 
      className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite_ease-in-out] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent blur-xl" 
      style={{ animationDelay: `${delay}ms` }}
    />
    
    {/* The Surface Shine - Sharp but subtle glass reflection */}
    <div 
      className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite_linear] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" 
      style={{ animationDelay: `${delay}ms` }}
    />
  </div>
);

/**
 * The "Halo" Avatar
 * A circle that pulses with a ring of light
 */
const HaloAvatar = () => (
    <div className="relative w-14 h-14 shrink-0">
        <div className="absolute inset-0 bg-white/10 rounded-full blur-md animate-pulse" />
        <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-white/10 to-transparent border border-white/10 overflow-hidden">
             <div className="absolute inset-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.2)_360deg)] opacity-50" />
        </div>
    </div>
);

export const TaskSkeleton = () => {
  return (
    <div className="relative w-full">
      {/* The Container - "Glass Tablet" feel */}
      <div className="relative overflow-hidden rounded-3xl bg-[#030303] border border-white/5 p-6 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]">
        
        {/* Divine Background Glow - Adds depth behind the content */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* 1. The Avatar / Icon */}
        <HaloAvatar />

        {/* 2. The Content Flow */}
        <div className="flex-1 w-full space-y-5 relative z-10">
          <div className="flex items-center justify-between">
              {/* Title Beam */}
              <LightBeam className="h-6 w-48 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
              {/* Pill Badge */}
              <LightBeam className="h-6 w-24 rounded-full" delay={200} />
          </div>
          
          {/* Description - Liquid lines */}
          <div className="space-y-3">
              <LightBeam className="h-3 w-3/4 opacity-70" delay={400} />
              <LightBeam className="h-3 w-1/2 opacity-50" delay={600} />
          </div>
        </div>

        {/* 3. The Action Button */}
        <div className="w-full md:w-40 h-12 shrink-0 z-10">
          <LightBeam className="w-full h-full rounded-full border-white/10" delay={800} />
        </div>
      </div>
    </div>
  );
};

export const LeaderboardSkeleton = () => {
  return (
    <div className="relative flex items-center justify-between p-5 border-b border-white/[0.02] bg-gradient-to-r from-transparent via-white/[0.01] to-transparent">
        <div className="flex items-center gap-5 flex-1">
            {/* Soft Circle */}
            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse ring-1 ring-white/10" />
            
            <div className="space-y-2.5">
                <LightBeam className="h-4 w-32" />
                <LightBeam className="h-3 w-20 opacity-40" />
            </div>
        </div>
        
        {/* Rank Beam */}
        <LightBeam className="h-8 w-20 rounded-lg" delay={300} />
    </div>
  );
};