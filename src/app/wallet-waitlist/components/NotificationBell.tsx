"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellDot, X, AlertCircle, Gift, Target, Info, CheckCheck } from 'lucide-react';
import { Notification } from '../types/waitlist';
import { apiRequest } from '@/lib/api-client';

interface NotificationBellProps {
  notifications: Notification[];
}

export default function NotificationBell({ notifications = [] }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      const response = await apiRequest('/waitlist/notifications/read', { method: 'POST' });
      if (response.ok) {
        // Trigger a user stats refresh to update the local session
        window.dispatchEvent(new CustomEvent('penxchain:request-stats-refresh'));
      }
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'REFERRAL_PENALTY': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'REFERRAL_REWARD_CREDITED': return <Gift className="w-4 h-4 text-emerald-500" />;
      case 'TASK_COMPLETED': return <Target className="w-4 h-4 text-[#2547D0]" />;
      default: return <Info className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg border transition-all ${
          isOpen 
            ? 'bg-[#2547D0]/10 border-[#2547D0]/50 text-white shadow-[0_0_20px_rgba(37,71,208,0.2)]' 
            : 'bg-zinc-900/60 border-zinc-800/60 text-zinc-500 hover:text-white hover:border-zinc-700/60'
        }`}
      >
        <AnimatePresence mode="wait">
          {unreadCount > 0 ? (
            <motion.div
              key="bell-dot"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <BellDot className="w-5 h-5 text-[#2547D0]" />
            </motion.div>
          ) : (
            <motion.div
              key="bell"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Bell className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-[#2547D0] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-[#2547D0]/40 border-2 border-[#020202]"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 mt-3 w-80 bg-zinc-950/95 backdrop-blur-3xl border border-white/5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2547D0]" />
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/50">Notifications</h3>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="p-1.5 hover:bg-[#2547D0]/10 rounded-lg text-zinc-500 hover:text-[#2547D0] transition-all group"
                      title="Clear All"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center px-8">
                    <div className="w-12 h-12 rounded-full bg-zinc-900/50 flex items-center justify-center mb-4 border border-white/5">
                      <Bell className="w-5 h-5 text-zinc-800" />
                    </div>
                    <p className="font-bold text-xs text-zinc-500 uppercase tracking-widest mb-1">No active uplink</p>
                    <p className="text-[10px] text-zinc-700 mono">All systems nominal</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.03]">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-4 hover:bg-white/[0.03] transition-all relative group/item ${!notif.isRead ? 'bg-[#2547D0]/[0.03]' : ''}`}
                      >
                        {!notif.isRead && (
                          <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-[#2547D0] rounded-r-full shadow-[0_0_10px_#2547D0]" />
                        )}
                        <div className="flex gap-4">
                          <div className="mt-0.5 w-8 h-8 rounded-lg bg-zinc-900/80 border border-white/5 flex items-center justify-center group-hover/item:border-[#2547D0]/30 transition-colors">
                            {getIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-[11px] font-black uppercase tracking-wider ${!notif.isRead ? 'text-white' : 'text-zinc-500'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[8px] mono text-zinc-700">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className={`text-[11px] leading-relaxed mb-2 font-medium ${!notif.isRead ? 'text-zinc-300' : 'text-zinc-600'}`}>
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="mono text-[8px] text-zinc-800 uppercase tracking-tighter">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </p>
                              {!notif.isRead && (
                                <span className="text-[8px] font-bold text-[#2547D0] opacity-0 group-hover/item:opacity-100 transition-opacity uppercase tracking-widest">New Signal</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-white/[0.01] border-t border-white/5 text-center">
                <button className="text-[9px] mono text-zinc-600 hover:text-white uppercase tracking-[0.3em] transition-all py-1">
                  View_Archive_Logs
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
