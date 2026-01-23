"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Trophy,
  User,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  Shield,
  Fingerprint,
  Globe
} from 'lucide-react';
import { getCurrentUser, logout, updateCurrentUser } from '../lib/waitlist-auth';
import { getLevelInfo } from '../lib/waitlist-data';
import type { User as UserType } from '../types/waitlist';
import AnimatedBackground from './AnimatedBackground';

import { getAvatarStyle, generateRandomAvatarSeed } from '../lib/avatars';
import PXPSpinner from './PXPSpinner';

interface WaitlistLayoutProps {
  children: ReactNode;
}

export default function WaitlistLayout({ children }: WaitlistLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/wallet-waitlist/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/wallet-waitlist/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <PXPSpinner size={48} />
      </div>
    );
  }

  const levelInfo = getLevelInfo(user.points);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/wallet-waitlist/dashboard' },
    { icon: User, label: 'Profile', href: '/wallet-waitlist/profile' },
    { icon: Trophy, label: 'Leaderboard', href: '/wallet-waitlist/leaderboard' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#2547D0] relative overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND STACK */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground opacity={0.15} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,71,208,0.08)_0%,transparent_50%)]" />
      </div>

      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-lg text-white hover:border-[#2547D0]/50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-[#020202]/90 backdrop-blur-2xl border-r border-white/5 p-6 z-40 flex flex-col transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Area */}
        <div className="mb-8">
           <div className="flex items-center gap-2 mb-2">
              <div className="h-[1px] w-6 bg-[#2547D0]" />
              <span className="text-[#2547D0] font-mono text-[10px] tracking-widest uppercase">PENXCHAIN</span>
           </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black tracking-tight uppercase">Waitlist<span className="text-[#2547D0]">.IO</span></h1>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs text-white/60 hover:text-white transition-all w-full"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Landing</span>
          </Link>
        </div>

        {/* User Card - Premium Style */}
        <div className="mb-8 relative group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2547D0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative group/avatar">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden bg-[#2547D0]/20 border border-white/10"
                  style={getAvatarStyle(user.avatarId)}
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    const newSeed = generateRandomAvatarSeed();
                    const updated = { ...user, avatarId: newSeed };
                    setUser(updated);
                    updateCurrentUser({ avatarId: newSeed });
                  }}
                  className="absolute -bottom-1.5 -right-1.5 p-1 bg-[#2547D0] rounded-full text-white opacity-100 md:opacity-0 md:group-hover/avatar:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
                  title="Generate New Avatar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate text-sm">{user.username}</p>
                <div className="flex items-center gap-2">
                   <p className="text-[#2547D0] text-[10px] tracking-wider font-mono">RANK #{user.rank}</p>
                </div>
              </div>
            </div>
            
            {/* Points */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-white/40 font-mono uppercase">PXP Balance</span>
              <span className="text-white font-bold">{user.points.toLocaleString()}</span>
            </div>

            {/* Level Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                <span>LVL {levelInfo.level}</span>
                <span>{Math.round(levelInfo.progress)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-[#2547D0]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative group flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-sm overflow-hidden ${
                  isActive
                    ? 'bg-[#2547D0] text-white shadow-[0_0_20px_rgba(37,71,208,0.3)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'group-hover:text-[#2547D0] transition-colors'}`} />
                <span className="font-medium tracking-wide">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/10 mix-blend-overlay"
                  />
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Meta */}
         <div className="mt-8 pt-6 border-t border-white/5">
           <div className="flex gap-4 items-center justify-center opacity-30 grayscale hover:grayscale-0 transition-opacity">
             <Shield className="w-3 h-3" />
             <Fingerprint className="w-3 h-3" />
             <Globe className="w-3 h-3" />
             <span className="text-[9px] font-mono">SECURE</span>
           </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-xs font-mono uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 relative z-10 transition-all duration-300">
        {/* Top Bar - Glassmorphic */}
        <div className="sticky top-0 z-30 bg-[#020202]/60 backdrop-blur-xl border-b border-white/5">
          <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="lg:hidden w-16" /> {/* Spacer for mobile */}
            
            {/* Top Bar Stats */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden md:flex flex-col items-end mr-4">
                  <span className="text-[10px] text-[#2547D0] font-mono uppercase tracking-wider">System Status</span>
                  <span className="text-[10px] text-white/40 font-mono">OPERATIONAL // V.1.0.0</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2547D0]/10 border border-[#2547D0]/20 rounded-lg">
                <span className="text-[#2547D0] text-xs font-bold font-mono">PXP</span>
                <span className="text-white text-sm font-bold">{user.points.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
