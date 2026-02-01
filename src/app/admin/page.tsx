"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, AlertTriangle, Search, Lock, Unlock, RefreshCw, Plus, Trash2, Edit3, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import WaitlistLayout from '../wallet-waitlist/components/WaitlistLayout';
import { FaXTwitter, FaLinkedin, FaDiscord, FaYoutube, FaTelegram, FaTiktok, FaInstagram, FaBookOpen } from "react-icons/fa6";

interface Stats {
  totalUsers: number;
  totalPoints: number;
  topReferrers: { username: string; count: number }[];
}

interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
  pxpBalance: number;
  createdAt: string;
  walletAddress: string | null;
  isBanned: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'SOCIAL' | 'DAILY' | 'ONE_TIME';
  points: number;
  link?: string;
  icon?: string;
  category?: string;
  isActive: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
     const session = localStorage.getItem('penxchain_waitlist_user');
      if (session) {
          try {
              const { id, role } = JSON.parse(session);
              setCurrentUserId(id);
              setCurrentUserRole(role);
          } catch (e) {}
      }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsResult, usersResult, tasksResult] = await Promise.all([
        apiRequest<Stats>('/admin/stats'),
        apiRequest<{ users: AdminUser[], total: number }>('/admin/users?limit=20&page=' + page),
        apiRequest<{ tasks: Task[] }>('/admin/waitlist/tasks')
      ]);

      if (!statsResult.ok) {
        throw statsResult.error;
      }
      setStats(statsResult.data);

      if (!usersResult.ok) {
        throw usersResult.error;
      }
      setUsers(usersResult.data.users);
      setTotalUsers(usersResult.data.total);

      if (!tasksResult.ok) {
        throw tasksResult.error;
      }
      setTasks(tasksResult.data.tasks);
    } catch (err: any) {
      console.error('[ADMIN_FETCH_ERROR]', err);
      setError(err.message || 'Access Denied');
      router.push('/wallet-waitlist/dashboard'); // Redirect if unauthorized
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleBan = async (id: string) => {
    if (!confirm('Are you sure you want to ban this user?')) return;
    try {
      await apiRequest(`/admin/users/${id}/ban`, { method: 'POST' });
      fetchData(); // Refresh
    } catch (err) {
      alert('Failed to ban user');
    }
  };

  const handlePromote = async (id: string) => {
    if (!confirm('Promote this user to Admin?')) return;
    try {
      await apiRequest(`/admin/users/${id}/promote`, { method: 'POST' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Promotion failed');
    }
  };

  const handleDemote = async (id: string) => {
    if (!confirm('Remove Admin privileges from this user?')) return;
    try {
      await apiRequest(`/admin/users/${id}/demote`, { method: 'POST' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Demotion failed');
    }
  };

  const handlePromoteSuper = async (id: string) => {
    if (!confirm('EXTREME WARNING: Promote this user to SUPERADMIN? They will have full system control.')) return;
    try {
      await apiRequest(`/admin/users/${id}/promote-super`, { method: 'POST' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Super promotion failed');
    }
  };

  const handleTaskDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this task? This cannot be undone.')) return;
      
      // Store original state for rollback
      const originalTasks = [...tasks];
      
      // Optimistic update - remove from UI immediately
      setTasks(prev => prev.filter(t => t.id !== id));
      
      try {
          const result = await apiRequest(`/admin/waitlist/tasks/${id}`, { method: 'DELETE' });
          if (!result.ok) {
            // Rollback to original state on failure
            setTasks(originalTasks);
            alert('Failed to delete task: ' + (result.error?.message || 'Unknown error'));
          }
      } catch (err: any) {
          // Rollback to original state
          setTasks(originalTasks);
          alert('Failed to delete task: ' + (err.message || 'Network error'));
      }
  };


  const handleTaskToggle = async (task: Task) => {
      try {
          await apiRequest(`/admin/waitlist/tasks/${task.id}`, { 
              method: 'PUT',
              body: { isActive: !task.isActive }
          });
          fetchData();
      } catch (err) {
          alert('Failed to toggle task');
      }
  };

  // ... imports

  const ICON_OPTIONS = [
    { id: "twitter", label: "X (Twitter)", icon: FaXTwitter, color: "text-white" },
    { id: "telegram", label: "Telegram", icon: FaTelegram, color: "text-blue-400" },
    { id: "discord", label: "Discord", icon: FaDiscord, color: "text-indigo-400" },
    { id: "linkedin", label: "LinkedIn", icon: FaLinkedin, color: "text-blue-600" },
    { id: "youtube", label: "YouTube", icon: FaYoutube, color: "text-red-500" },
    { id: "tiktok", label: "TikTok", icon: FaTiktok, color: "text-pink-500" },
    { id: "instagram", label: "Instagram", icon: FaInstagram, color: "text-pink-400" },
    { id: "blog", label: "Blog/Article", icon: Search, color: "text-emerald-400" }, // Fallback to Search/FileText
    { id: "like", label: "Like/Love", icon: CheckCircle, color: "text-red-500" },
    { id: "verification", label: "Verification", icon: Shield, color: "text-blue-400" },
  ];

  if (loading && !stats) return (
       <WaitlistLayout>
          <div className="flex items-center justify-center h-[50vh] font-mono text-white/50 animate-pulse">
              INITIALIZING ADMIN PROTOCOLS...
          </div>
       </WaitlistLayout>
  );

  if (error) return (
      <WaitlistLayout>
         <div className="flex items-center justify-center h-[50vh] text-red-500 font-mono uppercase font-bold">
            ACCESS DENIED: {error}
         </div>
      </WaitlistLayout>
  );

  return (
    <WaitlistLayout>
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Command Center</h1>
              <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">System Operations // PENXCHAIN</p>
            </div>
          </div>
          <button onClick={fetchData} className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
             <RefreshCw className={`w-5 h-5 text-gray-400 group-hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard 
            title="Total Identities" 
            value={stats?.totalUsers.toLocaleString() || '0'} 
            icon={<Users className="w-5 h-5 text-[#2547D0]" />}
            color="blue"
          />
          <StatsCard 
            title="Global PXP Volume" 
            value={stats?.totalPoints.toLocaleString() || '0'} 
            icon={<Activity className="w-5 h-5 text-green-500" />}
            color="green"
          />
           <StatsCard 
            title="Active Protocols" 
            value={tasks.filter(t => t.isActive).length.toString()} 
            icon={<Clock className="w-5 h-5 text-yellow-500" />}
            color="yellow"
          />
        </div>

        {/* TASK MANAGEMENT SECTION */}
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[#2547D0]" />
                    <h2 className="text-xl font-bold">Protocol Management</h2>
                </div>
                <button 
                    onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2547D0] hover:bg-[#2547D0]/80 rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(37,71,208,0.3)]"
                >
                    <Plus className="w-4 h-4" /> NEW PROTOCOL
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-500 font-mono border border-dashed border-white/10 rounded-2xl">
                 <Activity className="w-8 h-8 mx-auto mb-4 opacity-10" />
                 NO ACTIVE PROTOCOLS FOUND
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-red-500/30 transition-all group relative overflow-hidden">
                  {!task.isActive && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                       <span className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-mono border border-white/10 rounded-full font-bold">PROTOCOL_OFFLINE</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg">
                       {/* Dynamic Icon Rendering */}
                       {(() => {
                           const iconOpt = ICON_OPTIONS.find(o => o.id === task.icon) || ICON_OPTIONS[0];
                           const Icon = iconOpt.icon;
                           return <Icon className={`w-5 h-5 ${iconOpt.color}`} />;
                       })()}
                    </div>
                    <div className="flex gap-2 relative z-20">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTaskToggle(task); }}
                        className={`p-2 rounded-lg border transition-all ${task.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}
                        title={task.isActive ? "Deactivate" : "Activate"}
                      >
                         {task.isActive ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingTask(task); setShowTaskModal(true); }} 
                        className="p-2 hover:bg-blue-500/20 rounded-lg text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={(e) => { e.stopPropagation(); handleTaskDelete(task.id); }}
                         className="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-white mb-1 uppercase tracking-tight">{task.title}</h3>
                  <p className="text-xs text-gray-500 mb-6 line-clamp-2 leading-relaxed">{task.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Yield</span>
                      <span className="text-sm font-bold text-red-400">{task.points} PXP</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Type</span>
                      <span className="text-[10px] font-mono text-gray-300 font-bold px-1.5 py-0.5 bg-white/5 rounded border border-white/10 uppercase">{task.type}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
        </section>

        {/* Users Table */}
        <div className="bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden mb-20">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
             <h2 className="text-lg font-bold">Identity Database</h2>
             <div className="flex gap-2">
                 <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 disabled:opacity-50">Prev</button>
                 <span className="px-4 py-2 text-xs font-mono text-gray-500">PAGE {page}</span>
                 <button disabled={page >= Math.ceil(totalUsers/20)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 disabled:opacity-50">Next</button>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-white/[0.02] text-gray-500 font-mono uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">PXP</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-gray-500 font-mono text-sm">
                        <Users className="w-8 h-8 mx-auto mb-4 opacity-20" />
                        NO IDENTITIES DETECTED IN CLUSTER
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">{user.username || 'Anonymous'}</span>
                            <span className="text-[10px] text-gray-500 font-mono truncate max-w-[150px]">{user.id}</span>
                          </div>
                        </td>
                        <td className="py-4">
                           <div className="flex flex-col">
                             <span className="text-sm text-gray-300">{user.email}</span>
                             <span className="text-[10px] text-gray-500 font-mono">{user.walletAddress || 'NO_WALLET'}</span>
                           </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                            user.role === 'SUPERADMIN' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                            user.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-sm text-red-400 font-bold">
                          {user.pxpBalance?.toLocaleString() || 0}
                        </td>
                        <td className="p-4">
                         {user.isBanned ? (
                             <span className="text-red-500 flex items-center gap-1"><Lock className="w-3 h-3" /> BANNED</span>
                         ) : (
                             <span className="text-green-500 flex items-center gap-1"><Unlock className="w-3 h-3" /> ACTIVE</span>
                         )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {/* Role Management (Super Admin Only) */}
                             {currentUserRole === 'SUPERADMIN' && currentUserId !== user.id && (
                                <>
                                  {user.role === 'USER' && (
                                    <button onClick={() => handlePromote(user.id)} className="p-1.5 hover:bg-blue-500/20 rounded text-blue-500 border border-blue-500/10 hover:border-blue-500/30 transition-all" title="Promote to Admin">
                                      <Users className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {user.role === 'ADMIN' && (
                                    <div className="flex gap-1">
                                      <button onClick={() => handleDemote(user.id)} className="p-1.5 hover:bg-yellow-500/20 rounded text-yellow-500 border border-yellow-500/10 hover:border-yellow-500/30 transition-all" title="Demote to User">
                                        <Unlock className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => handlePromoteSuper(user.id)} className="p-1.5 hover:bg-red-500/20 rounded text-red-500 border border-red-500/10 hover:border-red-500/30 transition-all" title="Promote to SUPERADMIN">
                                        <Shield className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </>
                             )}
                             
                             <button 
                                onClick={() => handleBan(user.id)}
                                className={`p-1.5 rounded border transition-all ${
                                  user.isBanned 
                                    ? 'bg-red-500/20 text-red-500 border-red-500/30' 
                                    : 'hover:bg-red-500/20 text-gray-500 hover:text-red-500 border-transparent hover:border-red-500/30'
                                }`}
                                title={user.isBanned ? "Unban User" : "Ban User"}
                             >
                               <AlertTriangle className="w-3.5 h-3.5" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showTaskModal && (
          <TaskModal 
            task={editingTask} 
            onClose={() => setShowTaskModal(false)} 
            onSave={() => { setShowTaskModal(false); fetchData(); }} 
            iconOptions={ICON_OPTIONS}
          />
      )}
    </WaitlistLayout>
  );
}

function TaskModal({ task, onClose, onSave, iconOptions }: { task: Task | null, onClose: () => void, onSave: () => void, iconOptions: any[] }) {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        type: task?.type || 'SOCIAL',
        points: task?.points || 100,
        link: task?.link || '',
        icon: task?.icon || 'twitter',
        category: task?.category || 'engagement',
        isActive: task?.isActive !== undefined ? task.isActive : true,
        durationDays: (task as any)?.durationDays || 7, // Default 7 days for SOCIAL tasks
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = task ? `/admin/waitlist/tasks/${task.id}` : '/admin/waitlist/tasks';
            const method = task ? 'PUT' : 'POST';
            // Sanitize and prepare body
            const safeBody = {
                ...formData,
                points: Number.isNaN(formData.points) ? 0 : formData.points,
                // Only include durationDays for SOCIAL tasks
                durationDays: formData.type === 'SOCIAL' ? formData.durationDays : undefined,
            };
            const res = await apiRequest(url, { method, body: safeBody });
            if (!res.ok) throw res.error;
            onSave();
        } catch (err: any) {
            alert(err.message || 'Operation failed');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh]"
            >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#2547D0]" />
                    {task ? 'RECONFIGURE PROTOCOL' : 'INITIALIZE PROTOCOL'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-mono text-gray-500 mb-1 block">Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#2547D0] outline-none transition-colors"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-mono text-gray-500 mb-1 block">Description</label>
                        <textarea 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#2547D0] outline-none transition-colors h-24"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-mono text-gray-500 mb-1 block">Type</label>
                            <select 
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#2547D0] outline-none appearance-none"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value as any})}
                            >
                                <option value="SOCIAL">SOCIAL (Expires)</option>
                                <option value="DAILY">DAILY (Resets)</option>
                                <option value="ONE_TIME">ONE_TIME (Permanent)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-mono text-gray-500 mb-1 block">Points</label>
                            <input 
                                required
                                type="number" 
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#2547D0] outline-none"
                                value={Number.isNaN(formData.points) ? '' : formData.points}
                                onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    
                    {/* Duration Days - Only shown for SOCIAL tasks */}
                    {formData.type === 'SOCIAL' && (
                        <div>
                            <label className="text-[10px] uppercase font-mono text-gray-500 mb-1 block">
                                Duration (Days) <span className="text-yellow-500">- Auto-deletes after expiry</span>
                            </label>
                            <select 
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#2547D0] outline-none appearance-none"
                                value={formData.durationDays}
                                onChange={e => setFormData({...formData, durationDays: parseInt(e.target.value)})}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map(d => (
                                    <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {/* ICON PICKER */}
                    <div>
                        <label className="text-[10px] uppercase font-mono text-gray-500 mb-2 block">Protocol Icon</label>
                        <div className="grid grid-cols-5 gap-2">
                           {iconOptions.map((opt) => {
                               const Icon = opt.icon;
                               const isSelected = formData.icon === opt.id;
                               return (
                                   <button
                                     key={opt.id}
                                     type="button"
                                     onClick={() => setFormData({...formData, icon: opt.id})}
                                     className={`aspect-square flex items-center justify-center rounded-lg border transition-all ${
                                       isSelected 
                                         ? 'bg-[#2547D0] border-[#2547D0] text-white shadow-lg scale-105' 
                                         : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-500'
                                     }`}
                                     title={opt.label}
                                   >
                                     <Icon className="w-5 h-5" />
                                   </button>
                               )
                           })}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-mono text-gray-500 mb-1 block">Landing Link</label>
                        <input 
                            type="url" 
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#2547D0] outline-none"
                            value={formData.link}
                            onChange={e => setFormData({...formData, link: e.target.value})}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors"
                        >
                            CANCEL
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3 bg-[#2547D0] text-white rounded-xl text-xs font-bold hover:bg-[#2547D0]/80 transition-colors shadow-[0_0_20px_rgba(37,71,208,0.2)]"
                        >
                            {task ? 'UPDATE' : 'GENERATE'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function StatsCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
    const bgColors: Record<string, string> = {
        blue: 'bg-[#2547D0]/10 border-[#2547D0]/20',
        green: 'bg-green-500/10 border-green-500/20',
        yellow: 'bg-yellow-500/10 border-yellow-500/20',
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border backdrop-blur-md ${bgColors[color] || 'bg-white/5 border-white/10'}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                     <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{title}</p>
                     <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
                </div>
                {icon}
            </div>
        </motion.div>
    )
}
