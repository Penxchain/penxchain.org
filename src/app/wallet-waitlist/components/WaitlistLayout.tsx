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
  ShieldUser,
  Fingerprint,
  Globe,
  Lock,
  AlertTriangle,
  Mail,
  Coins,
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
    
    const handleUserUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserType>;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      }
    };
    window.addEventListener("penxchain:user-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("penxchain:user-updated", handleUserUpdate);
    };
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

  if (user.isBanned) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
          
          * {
            font-family: 'Libre Franklin', sans-serif;
          }
          
          .mono {
            font-family: 'JetBrains Mono', monospace;
          }
        `}</style>
        
        <AnimatedBackground opacity={0.1} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/60 rounded-xl p-8 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-zinc-900/60 border-2 border-zinc-700/60 flex items-center justify-center">
            <Lock className="w-10 h-10 text-zinc-500" />
          </div>
          
          <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
            Access Denied
          </h1>
          
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="mono text-xs text-zinc-600 uppercase mb-1 tracking-wider">Reason</p>
                <p className="text-white/90 text-sm">{user.banReason || "Account suspended."}</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-zinc-500 mb-4">
            Contact support if this is an error
          </p>
          
          <a 
            href="mailto:support@penxchain.org?subject=Ban Appeal"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-bold text-sm transition-all mb-6 border border-zinc-700/60"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
          
          <div className="pt-4 border-t border-zinc-800/60">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-zinc-500 hover:bg-zinc-900/60 rounded-lg transition-colors text-sm mono"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          
          {user.bannedAt && (
            <p className="mono text-[10px] text-zinc-700 mt-4">
              {new Date(user.bannedAt).toLocaleDateString()}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(user.points);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/wallet-waitlist/dashboard' },
    { icon: User, label: 'Profile', href: '/wallet-waitlist/profile' },
    { icon: Trophy, label: 'Leaderboard', href: '/wallet-waitlist/leaderboard' },
  ];

  if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
    navItems.push({ icon: ShieldUser, label: 'Admin', href: '/admin' });
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#2547D0]/30 relative overflow-x-hidden">
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
      `}</style>
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedBackground opacity={0.08} />
        <div className="absolute inset-0 fine-grid opacity-40" />
      </div>

      {/* Mobile Menu */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/60 rounded-lg text-white hover:border-zinc-700/60 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-zinc-950/95 backdrop-blur-2xl border-r border-zinc-800/60 p-6 z-40 flex flex-col transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-[#2547D0] rounded-full" />
            <span className="mono text-[9px] text-zinc-600 uppercase tracking-widest">PENXCHAIN</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black tracking-tight uppercase">
              Waitlist<span className="text-[#2547D0]">.IO</span>
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 hover:bg-zinc-900/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-600" />
            </button>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/60 text-xs text-zinc-500 hover:text-white transition-all w-full"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="mb-8 relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/40">
          <div className="relative p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative group/avatar">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden border-2 border-zinc-800/60"
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
                  className="absolute -bottom-1 -right-1 p-1 bg-[#2547D0] rounded-full text-white opacity-0 group-hover/avatar:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
                  title="Regenerate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{user.username}</p>
                <div className="flex items-center gap-2 mono text-xs text-zinc-600">
                  <span>RANK</span>
                  <span className="text-[#2547D0]">#{user.rank}</span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-800/60 rounded-lg">
                <span className="mono text-[10px] text-zinc-600 uppercase tracking-wider">Balance</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-white font-bold mono">{user.points?.toLocaleString() ?? '0'}</span>
                  <span className="mono text-[10px] text-zinc-700">PXP</span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mono text-[10px] text-zinc-600">
                  <span>TIER {levelInfo.level}</span>
                  <span>{Math.round(levelInfo.progress)}%</span>
                </div>
                <div className="relative h-1.5 bg-zinc-900 rounded-full border border-zinc-800/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#2547D0] to-[#3B5FE0]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative group flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-[#2547D0] text-white'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-800/60 space-y-4">
          <div className="flex items-center justify-center gap-3 opacity-40 hover:opacity-60 transition-opacity">
            <Shield className="w-3 h-3 text-zinc-600" />
            <Fingerprint className="w-3 h-3 text-zinc-600" />
            <Globe className="w-3 h-3 text-zinc-600" />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/60 transition-all w-full mono text-xs uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-72 relative z-10">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-800/60">
          <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="lg:hidden w-16" />
            
            <div className="flex items-center gap-4 ml-auto">
              {/* PXP Display */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/60 border border-zinc-800/60 rounded-lg">
                <Coins className="w-3.5 h-3.5 text-[#2547D0]" />
                <span className="mono text-sm font-bold text-white">{user.points?.toLocaleString() ?? '0'}</span>
                <span className="mono text-[10px] text-zinc-600">PXP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
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