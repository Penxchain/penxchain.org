"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  Search,
  Lock,
  Unlock,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Heart,
  CheckCircle,
  Clock,
  ChevronRight,
  Wallet,
  Mail,
  User,
  Eye,
  FileText,
  Share2,
  Repeat2,
  UserPlus,
  BadgeQuestionMark,
  Coins,
  Target,
  Crown,
  Search as SearchIcon,
  X,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { PXPHistoryModal } from "./components/PXPHistoryModal";
import { BannedIdentities } from "./components/BannedIdentities";
import WaitlistLayout from "../wallet-waitlist/components/WaitlistLayout";
import {
  FaXTwitter,
  FaLinkedin,
  FaDiscord,
  FaYoutube,
  FaTelegram,
  FaTiktok,
  FaInstagram,
  FaShareNodes,
  FaBookOpen,
} from "react-icons/fa6";

// --- Types ---
interface Stats {
  totalUsers: number;
  totalPoints: number;
  growthPercent?: number;
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
  banReason?: string;
  bannedAt?: string;
  dailyStreak: number;
  // Extended fields for specific tabs
  accountStatus?: string;
  reviewEndsAt?: string;
  deviceId?: string;
  count?: number; // for duplicates
  user_ids?: string[]; // for duplicates
  usernames?: string[]; // for duplicates
  created_ats?: string[]; // for duplicates
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: "SOCIAL" | "DAILY" | "ONE_TIME";
  points: number;
  link?: string;
  icon?: string;
  category?: string;
  isActive: boolean;
}

type TabType = 'users' | 'under_review' | 'duplicates' | 'no_device' | 'banned';
type SortField = 'pxpBalance' | 'createdAt' | 'dailyStreak';
type SortDir = 'asc' | 'desc';

// --- Main Component ---
export default function AdminPage() {
  const router = useRouter();
  
  // Data State
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [error, setError] = useState("");
  const [inactiveDays, setInactiveDays] = useState<number | "">("");
  
  // Auth State
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  
  // Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [historyUser, setHistoryUser] = useState<{ id: string; username: string } | null>(null);

  // --- Effects ---

  // Check Session
  useEffect(() => {
    const session = localStorage.getItem("penxchain_waitlist_user");
    if (session) {
      try {
        const { id, role } = JSON.parse(session);
        setCurrentUserId(id);
        setCurrentUserRole(role);
      } catch (e) {}
    }
  }, []);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, activeTab, sortBy, sortDir, inactiveDays]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: "20",
        page: page.toString(),
        sortBy,
        sortDir,
      });
      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch);
      }
      if (activeTab === 'users' && inactiveDays !== "") {
        queryParams.append("inactiveDays", inactiveDays.toString());
      }

      // 1. Always fetch stats and tasks (could optimize later)
      const statsPromise = apiRequest<Stats>("/admin/stats");
      const tasksPromise = apiRequest<{ tasks: Task[] }>("/admin/waitlist/tasks");

      // 2. Fetch users based on active tab
      let usersPromise;
      switch (activeTab) {
        case 'users':
          usersPromise = apiRequest<{ users: AdminUser[]; total: number }>(
            `/admin/users?${queryParams.toString()}`
          );
          break;
        case 'under_review':
          usersPromise = apiRequest<{ users: AdminUser[]; total: number }>(
            `/admin/penalty/under-review?${queryParams.toString()}`
          );
          break;
        case 'duplicates':
          usersPromise = apiRequest<{ duplicates: any[]; total: number }>(
            `/admin/devices/duplicates?${queryParams.toString()}`
          );
          break;
        case 'no_device':
          usersPromise = apiRequest<{ users: AdminUser[]; total: number }>(
            `/admin/devices/missing?${queryParams.toString()}`
          );
          break;
        case 'banned':
          usersPromise = apiRequest<{ users: AdminUser[]; total: number }>(
            `/admin/users/banned?${queryParams.toString()}`
          );
          break;
      }

      const [statsResult, usersResult, tasksResult] = await Promise.all([
        statsPromise,
        usersPromise,
        tasksPromise,
      ]);

      // Note: Re-using logic but ensuring all have total
      if (!statsResult.ok) throw statsResult.error;
      setStats(statsResult.data);

      if (!usersResult.ok) throw usersResult.error;
      
      // Normalize response data structure
      if (['users', 'under_review', 'no_device', 'banned'].includes(activeTab)) {
        const data = (usersResult.data as { users: AdminUser[]; total: number });
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
      } else if (activeTab === 'duplicates') {
        const data = (usersResult.data as { duplicates: any[]; total: number });
        setUsers(data.duplicates || []); 
        setTotalUsers(data.total || 0);
      }

      if (tasksResult.ok) setTasks(tasksResult.data.tasks);

    } catch (err: any) {
      console.error("[ADMIN_FETCH_ERROR]", err);
      setError(err.message || "Access Denied");
      if (err.message && (err.message.includes("Access") || err.message.includes("Denied"))) {
         router.push("/wallet-waitlist/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleBan = async (id: string) => {
    const reason = prompt("Enter ban reason (min 5 characters):");
    if (!reason || reason.trim().length < 5) {
      alert("Ban reason must be at least 5 characters.");
      return;
    }
    if (!confirm(`Ban user?\n\nReason: ${reason}`)) return;
    try {
      const result = await apiRequest(`/admin/users/${id}/ban`, { 
        method: "POST",
        body: { reason: reason.trim() }
      });
      if (!result.ok) throw result.error;
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to ban user");
    }
  };

  const handleUnban = async (id: string) => {
    if (!confirm("Unban this user?")) return;
    try {
      const result = await apiRequest(`/admin/users/${id}/unban`, { method: "POST" });
      if (!result.ok) throw result.error;
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to unban user");
    }
  };

  const handlePromote = async (id: string) => {
    if (!confirm("Promote to Admin?")) return;
    try {
      await apiRequest(`/admin/users/${id}/promote`, { method: "POST" });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Promotion failed");
    }
  };

  const handleDemote = async (id: string) => {
    if (!confirm("Remove Admin privileges?")) return;
    try {
      await apiRequest(`/admin/users/${id}/demote`, { method: "POST" });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Demotion failed");
    }
  };

  const handlePromoteSuper = async (id: string) => {
    if (!confirm("WARNING: Promote to SUPERADMIN? Full system control.")) return;
    try {
      await apiRequest(`/admin/users/${id}/promote-super`, { method: "POST" });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Super promotion failed");
    }
  };

  const handleTaskDelete = async (id: string) => {
    if (!confirm("Delete this task? Cannot be undone.")) return;
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const result = await apiRequest(`/admin/waitlist/tasks/${id}`, { method: 'DELETE' });
      if (!result.ok) {
        setTasks(originalTasks);
        alert('Failed to delete task: ' + (result.error?.message || 'Unknown error'));
        return;
      }
    } catch (err: any) {
      setTasks(originalTasks);
      alert('Failed to delete task: ' + (err?.message || 'Network error'));
      return;
    }
    fetchData(); // Refresh to be safe
  };

  const handleTaskToggle = async (task: Task) => {
    try {
      await apiRequest(`/admin/waitlist/tasks/${task.id}`, {
        method: "PUT",
        body: { isActive: !task.isActive },
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to toggle task");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc'); // Default to desc for new field
    }
  };

  const handleBanDevice = async (deviceId: string) => {
    const reason = prompt("Enter ban reason for ALL users on this device:");
    if (!reason) return;
    
    if (!confirm(`WARNING: This will BAN ALL accounts associated with device ID: ${deviceId}. Are you sure?`)) return;

    try {
      const res = await apiRequest<{ count: number; message: string }>(`/admin/devices/${deviceId}/ban`, {
        method: "POST",
        body: { reason },
      });
      if (!res.ok) throw res.error;
      alert(`Success: ${res.data.count} users banned.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to ban device users");
    }
  };

  const handleBanNoDevice = async () => {
    try {
      const res = await apiRequest<{ count: number; message: string }>("/admin/devices/no-device/ban", {
        method: "POST",
        body: { reason: "Security Hardening: Missing device fingerprint" }
      });
      if (!res.ok) throw res.error;
      alert(`Success: ${res.data.count} users banned. ${res.data.message}`);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to mass ban no-device users");
    }
  };

  const ICON_OPTIONS = [
    { id: "twitter", label: "X (Twitter)", icon: FaXTwitter, color: "text-white" },
    { id: "telegram", label: "Telegram", icon: FaTelegram, color: "text-blue-400" },
    { id: "discord", label: "Discord", icon: FaDiscord, color: "text-indigo-400" },
    { id: "linkedin", label: "LinkedIn", icon: FaLinkedin, color: "text-blue-600" },
    { id: "youtube", label: "YouTube", icon: FaYoutube, color: "text-red-500" },
    { id: "tiktok", label: "TikTok", icon: FaTiktok, color: "text-pink-500" },
    { id: "instagram", label: "Instagram", icon: FaInstagram, color: "text-pink-400" },
    { id: "blog", label: "Blog/Article", icon: FaBookOpen, color: "text-emerald-400" },
    { id: "like", label: "Like/Love", icon: Heart, color: "text-red-500" },
    { id: "verification", label: "Verification", icon: Shield, color: "text-blue-400" },
    { id: "wallet", label: "Wallet", icon: Wallet, color: "text-amber-400" },
    { id: "email", label: "Email", icon: Mail, color: "text-emerald-400" },
    { id: "profile", label: "User / Profile", icon: User, color: "text-white" },
    { id: "refresh", label: "Refresh", icon: RefreshCw, color: "text-gray-400" },
    { id: "link", label: "Link / Share", icon: FaShareNodes, color: "text-cyan-400" },
    { id: "eye", label: "View / Preview", icon: Eye, color: "text-sky-400" },
    { id: "document", label: "Document", icon: FileText, color: "text-emerald-300" },
    { id: "retweet", label: "Retweet", icon: Repeat2, color: "text-emerald-300" },
    { id: "follow", label: "Follow", icon: UserPlus, color: "text-blue-300" },
    { id: "question", label: "Question", icon: BadgeQuestionMark, color: "text-blue-300" },
  ];

  if (loading && !stats) return (
    <WaitlistLayout>
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <div className="relative w-16 h-16">
           <div className="absolute inset-0 rounded-full border-2 border-zinc-800 border-t-[#2547D0] animate-spin" />
           <div className="absolute inset-3 rounded-full border-2 border-zinc-800 border-b-[#2547D0] animate-spin-reverse" />
        </div>
        <p className="mono text-zinc-500 text-xs tracking-widest animate-pulse">
          INITIALIZING_ADMIN_PROTOCOLS
        </p>
      </div>
    </WaitlistLayout>
  );

  if (error) return (
    <WaitlistLayout>
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-full">
          <Shield className="w-12 h-12 text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-500 mono text-sm">{error}</p>
        </div>
      </div>
    </WaitlistLayout>
  );

  return (
    <WaitlistLayout>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
        .mono { font-family: 'JetBrains Mono', monospace; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }

        .glass-panel {
          background: rgba(18, 18, 20, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(37, 71, 208, 0.5);
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(37, 71, 208, 0.2); }
          50% { box-shadow: 0 0 20px rgba(37, 71, 208, 0.4); }
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
        
        {/* === HEADER === */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#2547D0]/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#2547D0] via-[#3B5FE0] to-[#2547D0]" 
                  style={{ boxShadow: '0 0 10px rgba(37, 71, 208, 0.4)' }}
                />
                <span className="mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Command Center
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400 tracking-tight leading-none mb-3">
                Admin Control 
              </h1>
              <p className="text-zinc-500 text-xs font-medium max-w-md leading-relaxed border-l border-[#2547D0]/30 pl-4 py-1 italic">
                Protocol Hub: Manage engagement tasks, oversee system growth, and maintain network integrity.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex flex-col">
                  <span className="mono text-[8px] text-zinc-600 uppercase tracking-[0.2em] mb-0.5">Network_Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sync_Active</span>
                  </div>
                </div>
                <div className="w-px h-6 bg-white/5" />
                <div className="flex flex-col">
                  <span className="mono text-[8px] text-zinc-600 uppercase tracking-[0.2em] mb-0.5">Control_Level</span>
                  <span className="mono text-[10px] text-[#2547D0] font-bold uppercase tracking-wider">{currentUserRole || "Restricted"}</span>
                </div>
                <div className="w-px h-6 bg-white/5" />
                <div className="flex flex-col">
                  <span className="mono text-[8px] text-zinc-600 uppercase tracking-[0.2em] mb-0.5">Station_ID</span>
                  <span className="mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">PX-OMEGA-01</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-700/50 hover:border-zinc-500 rounded-lg transition-all mono text-xs uppercase tracking-wider group hover:bg-zinc-800"
              >
                <RefreshCw className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-colors ${loading ? "animate-spin" : ""}`} />
                <span className="text-zinc-400 group-hover:text-white">Synch Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* === STATS GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Network Identities"
            value={stats?.totalUsers.toLocaleString() || "0"}
            icon={<Users className="w-6 h-6 text-[#2547D0]" />}
            trend={stats?.growthPercent !== undefined ? `${stats.growthPercent >= 0 ? '+' : ''}${stats.growthPercent}% this week` : "Loading..." }
          />
          <StatsCard
            title="Total PXP Volume"
            value={stats?.totalPoints.toLocaleString() || "0"}
            icon={<Coins className="w-6 h-6 text-amber-500" />}
            trend="High Activity"
          />
          <StatsCard
            title="Active Protocols"
            value={tasks.filter((t) => t.isActive).length.toString()}
            icon={<Target className="w-6 h-6 text-emerald-500" />}
            trend="Operational"
          />
        </div>

        {/* === PROTOCOL MANAGEMENT === */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                <Activity className="w-5 h-5 text-[#2547D0]" />
                Protocol Registry
              </h2>
              <p className="text-sm text-zinc-500">Active tasks and engagement protocols.</p>
            </div>
            
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2547D0] hover:bg-[#1a35a0] rounded-lg text-sm font-bold text-white transition-all shadow-lg shadow-[#2547D0]/20"
            >
              <Plus className="w-4 h-4" />
              New Protocol
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasks.length === 0 ? (
              <div className="col-span-full py-24 text-center glass-panel rounded-2xl border-dashed border-zinc-800">
                <Activity className="w-12 h-12 mx-auto mb-4 text-zinc-800" />
                <p className="mono text-sm text-zinc-600 uppercase">No active protocols initialized</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  iconOptions={ICON_OPTIONS}
                  onToggle={() => handleTaskToggle(task)}
                  onEdit={() => {
                    setEditingTask(task);
                    setShowTaskModal(true);
                  }}
                  onDelete={() => handleTaskDelete(task.id)}
                />
              ))
            )}
          </div>
        </section>

        {/* === USER DATABASE === */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                <Users className="w-5 h-5 text-[#2547D0]" />
                Identity Database
              </h2>
              <p className="text-sm text-zinc-500">
                Search, monitor, and manage user identities.
              </p>
            </div>

            {/* SEARCH BAR & TABS */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 p-1 bg-zinc-900/50 rounded-lg border border-white/5 self-start">
                {[
                  { id: 'users', label: 'All Users', icon: Users },
                  { id: 'under_review', label: 'Under Review', icon: AlertTriangle },
                  { id: 'duplicates', label: 'Duplicates', icon: Users },
                  { id: 'no_device', label: 'No Device', icon: Shield },
                  { id: 'banned', label: 'Terminated', icon: Lock },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as TabType); setPage(1); }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === tab.id
                        ? "bg-[#2547D0] text-white shadow-lg shadow-[#2547D0]/20"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'no_device' && (
                <button
                  onClick={() => {
                    if (confirm("MASS BAN AUTHORIZATION:\n\nThis will permanently ban ALL accounts listed here that are missing device fingerprints.\n\nContinue?")) {
                      handleBanNoDevice();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all self-start animate-fade-in"
                >
                  <AlertTriangle size={12} />
                  <span>Mass Ban All (No Device)</span>
                </button>
              )}

              {/* INACTIVE FILTER (Only for All Users) */}
              {activeTab === 'users' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-lg border border-white/5 animate-fade-in">
                   <Clock size={14} className="text-zinc-500" />
                   <span className="mono text-[10px] text-zinc-500 uppercase tracking-widest whitespace-nowrap">Inactive &gt;</span>
                   <input 
                     type="number" 
                     min="1"
                     placeholder="Days"
                     value={inactiveDays} 
                     onChange={(e) => {
                       const val = e.target.value ? parseInt(e.target.value) : "";
                       setInactiveDays(val);
                       setPage(1);
                     }}
                     className="w-12 bg-transparent border-b border-zinc-700 text-xs text-white text-center focus:outline-none focus:border-[#2547D0] mono"
                   />
                   <span className="mono text-[10px] text-zinc-500 uppercase tracking-widest">Days</span>
                </div>
              )}

              <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-zinc-500 group-focus-within:text-[#2547D0] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search by username, email, or ID..."
                  className="block w-full pl-10 pr-10 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#2547D0] focus:border-[#2547D0] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-zinc-500 hover:text-white transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
            {activeTab === 'banned' ? (
              <BannedIdentities
                users={users}
                loading={loading}
                onUnban={handleUnban}
                onShowHistory={(u: any) => setHistoryUser({ id: u.id, username: u.username })}
              />
            ) : (
              <UserTable
                users={users}
                loading={loading}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                activeTab={activeTab}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
                onBan={handleBan}
                onUnban={handleUnban}
                onBanDevice={handleBanDevice}
                onDemote={handleDemote}
                onPromoteSuper={handlePromoteSuper}
                onShowHistory={(u: any) => setHistoryUser({ id: u.id, username: u.username })}
                onBanNoDevice={handleBanNoDevice}
              />
            )}
            
            {/* PAGINATION */}
            <div className="px-6 py-4 border-t border-white/5 bg-zinc-900/40 flex items-center justify-between">
               <span className="mono text-xs text-zinc-500">
                 Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, totalUsers)} of {totalUsers}
               </span>
               <div className="flex items-center gap-2">
                 <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium text-white transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= Math.ceil(totalUsers / 20) || loading}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium text-white transition-colors"
                  >
                    Next
                  </button>
               </div>
            </div>
          </div>
        </section>

      </div>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => setShowTaskModal(false)}
          onSave={() => {
            setShowTaskModal(false);
            fetchData();
          }}
          iconOptions={ICON_OPTIONS}
        />
      )}
      {historyUser && (
        <PXPHistoryModal
          userId={historyUser.id}
          username={historyUser.username}
          onClose={() => setHistoryUser(null)}
        />
      )}
    </WaitlistLayout>
  );
}

// --- SUB COMPONENTS ---

function StatsCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 60 })}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/5">
            {icon}
          </div>
          {trend && (
             <span className="mono text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
               {trend}
             </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-white mono tracking-tight">{value}</h3>
        </div>
      </div>
    </motion.div>
  );
}

function TaskCard({ task, iconOptions, onToggle, onEdit, onDelete }: {
  task: Task;
  iconOptions: any[];
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const iconOpt = iconOptions.find((o) => o.id === task.icon) || iconOptions[0];
  const Icon = iconOpt.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative p-5 rounded-2xl border transition-all group ${
        task.isActive 
          ? "bg-zinc-900/40 border-zinc-800/60 hover:border-[#2547D0]/30 hover:bg-zinc-900/60" 
          : "bg-zinc-950/40 border-zinc-800/40 opacity-70"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
          task.isActive 
            ? "bg-zinc-900 border-zinc-700 text-white" 
            : "bg-zinc-950 border-zinc-800 text-zinc-600"
        }`}>
          <Icon className={task.isActive ? iconOpt.color : ""} size={18} />
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={onEdit} className="p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white">
             <Edit3 size={14} />
           </button>
           <button onClick={onDelete} className="p-1.5 hover:bg-red-500/20 rounded-md text-zinc-400 hover:text-red-400">
             <Trash2 size={14} />
           </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-white text-sm mb-1 truncate">{task.title}</h3>
        <p className="text-xs text-zinc-500 line-clamp-2 min-h-[2.5em]">{task.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="mono text-sm font-bold text-white">{task.points} PXP</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
             {task.type}
          </span>
        </div>
        
        <button
          onClick={onToggle}
          className={`relative w-8 h-4 rounded-full transition-colors ${
            task.isActive ? "bg-[#2547D0]" : "bg-zinc-700"
          }`}
        >
          <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
            task.isActive ? "translate-x-4" : "translate-x-0"
          }`} />
        </button>
      </div>
    </motion.div>
  );
}

function UserTable({ users, loading, currentUserId, currentUserRole, activeTab, sortBy, sortDir, onSort, onBan, onBanDevice, onBanNoDevice, onUnban, onPromote, onDemote, onPromoteSuper, onShowHistory }: any) {
  if (loading) {
    return (
       <div className="p-12 text-center">
         <p className="text-zinc-600 mono animate-pulse">Scanning Identity Database...</p>
       </div>
    );
  }

  const SortHeader = ({ field, label, align = "left" }: { field: string, label: string, align?: "left" | "right" }) => (
    <th 
      onClick={() => onSort(field)}
      className={`px-6 py-4 text-${align} mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal cursor-pointer hover:text-white transition-colors group select-none`}
    >
      <div className={`flex items-center gap-1.5 ${align === "right" ? "justify-end" : ""}`}>
        {label}
        {sortBy === field && (
          <div className={`transition-transform duration-200 ${sortDir === 'asc' ? 'rotate-180' : ''}`}>
             <span className="text-[#2547D0]">▼</span>
          </div>
        )}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-900/60 border-b border-white/5">
            {activeTab === 'duplicates' ? (
              <>
                <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Hardware Signature</th>
                <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Density</th>
                <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Linked Identities</th>
                <th className="px-6 py-4 text-right mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Neutralization</th>
              </>
            ) : (
              <>
                <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Identity</th>
                <SortHeader field="pxpBalance" label="PXP Balance" /> 
                {activeTab === 'under_review' ? (
                  <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Review Ends In</th>
                ) : (
                  <SortHeader field="dailyStreak" label="Streak" />
                )}
                <SortHeader field="createdAt" label="Role / Status" />
                <th className="px-6 py-4 text-right mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Control</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-24 text-center">
                <Users className="w-10 h-10 mx-auto mb-4 text-zinc-800" />
                <p className="text-zinc-500 text-sm">No identities match your query.</p>
              </td>
            </tr>
          ) : (
            users.map((user: AdminUser) => (
              <tr key={user.id || user.deviceId} className="hover:bg-white/[0.02] transition-colors group">
                {activeTab === 'duplicates' ? (
                   // --- DUPLICATES ROW ---
                   <>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <Shield className="w-4 h-4 text-zinc-500" />
                         <span className="mono text-xs text-zinc-300 font-bold">{user.deviceId || "Unknown Device"}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-xs font-bold border border-red-500/20">
                          {user.count} Identit{user.count === 1 ? 'y' : 'ies'}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex flex-wrap gap-1.5 max-w-md">
                         {user.usernames?.map((u, i) => (
                           <div key={i} className="flex flex-col gap-0.5">
                             <span className={`px-2 py-0.5 rounded text-[10px] border ${
                               i === 0 
                                 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                                 : "bg-zinc-800 text-zinc-400 border-zinc-700"
                             }`}>
                               {u} {i === 0 && " (Original)"}
                             </span>
                           </div>
                         ))}
                       </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            if (confirm(`MASS BAN AUTHORIZATION:\n\nThis will ban ${user.count! - 1} duplicate accounts on this device.\n\nThe ORIGINAL account (${user.usernames![0]}) will be SPARED.\n\nContinue?`)) {
                              onBanDevice(user.deviceId!);
                            }
                          }}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-[1.02] shadow-sm shadow-red-500/10"
                        >
                          Clean Device
                        </button>
                     </td>
                   </>
                ) : (
                   // --- STANDARD USER ROW ---
                  <>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-xs font-black text-zinc-400 border border-white/5 shadow-inner">
                            {user.username ? user.username.slice(0, 2).toUpperCase() : "??"}
                          </div>
                          {user.isBanned && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-zinc-950">
                              <Lock size={8} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-white font-bold text-sm tracking-tight">{user.username}</p>
                          <p className="mono text-[10px] text-zinc-500 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                         onClick={() => onShowHistory(user)}
                         className="flex items-center gap-2 hover:bg-white/5 p-1 rounded transition-colors group/pxp text-left"
                      >
                         <Coins size={12} className="text-amber-500" />
                         <span className="mono text-xs font-bold text-white group-hover/pxp:underline decoration-[#2547D0]">{(user.pxpBalance || 0).toLocaleString()}</span>
                      </button>
                    </td>
                    
                    <td className="px-6 py-4">
                        {activeTab === 'under_review' ? (
                          <div className="flex items-center gap-2 text-amber-500">
                            <Clock size={12} />
                            <span className="mono text-xs">
                              {user.reviewEndsAt 
                                ? Math.max(0, Math.ceil((new Date(user.reviewEndsAt).getTime() - Date.now()) / 60000)) + " mins" 
                                : "N/A"}
                            </span>
                          </div>
                        ) : (
                           <div className="flex items-center gap-2">
                              <Activity size={12} className="text-zinc-600" />
                              <span className="mono text-[10px] text-zinc-600">{user.dailyStreak || 0} Days</span>
                           </div>
                        )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2 py-0.5 rounded mono text-[9px] font-black uppercase tracking-[0.1em] inline-flex items-center gap-1 ${
                          user.role === "SUPERADMIN"
                            ? "bg-[#2547D0] text-white shadow-[0_0_10px_rgba(37,71,208,0.3)]"
                            : user.role === "ADMIN"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-zinc-800/80 text-zinc-400 border border-white/5"
                        }`}>
                          {user.role === "SUPERADMIN" && <Crown size={9} />}
                          {user.role || "USER"}
                        </span>
                        
                        {user.isBanned ? (
                          <span className="inline-flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-wider bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">
                            <Lock size={10} /> BANNED
                          </span>
                        ) : user.accountStatus === 'UNDER_REVIEW' ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-500 text-[9px] font-black uppercase tracking-wider bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">
                            <FileText size={10} /> REVIEWING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase tracking-wider bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                            <CheckCircle size={10} /> ACTIVE
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        {/* User Actions - Only Superadmin can manage roles */}
                        {currentUserRole === "SUPERADMIN" && currentUserId !== user.id && (
                           <>
                             {/* Promote USER to ADMIN */}
                             {user.role === 'USER' && (
                               <button
                                 onClick={() => onPromote(user.id)}
                                 className="p-2 bg-zinc-800 hover:bg-[#2547D0]/20 rounded-lg text-zinc-400 hover:text-[#2547D0] transition-colors"
                                 title="Promote to Admin"
                                >
                                 <ArrowUpRight size={14} />
                                </button>
                             )}

                             {/* Demote ADMIN to USER */}
                             {user.role === 'ADMIN' && (
                               <button
                                 onClick={() => onDemote(user.id)}
                                 className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                 title="Demote to User"
                                >
                                 <ArrowUpRight size={14} className="rotate-180" />
                                </button>
                             )}
                              
                             {/* Promote ADMIN to SUPERADMIN */}
                             {user.role === 'ADMIN' && (
                                <button
                                  onClick={() => onPromoteSuper(user.id)}
                                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-amber-500 transition-colors"
                                  title="Promote to Superadmin"
                                >
                                  <Crown size={14} className="group-hover:text-amber-500 transition-colors" />
                                </button>
                             )}
                           </>
                        )}

                        {user.isBanned ? (
                          <button onClick={() => onUnban(user.id)} className="p-2 bg-zinc-800 hover:bg-emerald-900/50 rounded-lg text-zinc-400 hover:text-emerald-400 transition-colors" title="Unban">
                            <Unlock size={14} />
                          </button>
                        ) : (
                          <button onClick={() => onBan(user.id)} className="p-2 bg-zinc-800 hover:bg-red-900/50 rounded-lg text-zinc-400 hover:text-red-400 transition-colors" title="Ban">
                            <Lock size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

}


function TaskModal({ task, onClose, onSave, iconOptions }: {
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
  iconOptions: any[];
}) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    type: task?.type || "SOCIAL",
    points: task?.points || 100,
    link: task?.link || "",
    icon: task?.icon || "twitter",
    category: task?.category || "engagement",
    isActive: task?.isActive !== undefined ? task.isActive : true,
    durationDays: (task as any)?.durationDays || 7,
  });

  // Scroll Lock and Keyboard Interaction
  useEffect(() => {
    // Lock body scroll and prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === "Escape") onClose();
      
      // Prevent Arrow/Page keys from scrolling background 
      // when inside the modal if the target isn't already scrollable
      const scrollableKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (scrollableKeys.includes(e.key)) {
        const isTargetScrollable = (target: HTMLElement) => {
           return target.scrollHeight > target.clientHeight;
        };
        if (!isTargetScrollable(e.target as HTMLElement)) {
          // If the target itself isn't scrollable, we could prevent default 
          // or rely on overscroll-behavior: contain
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = task ? `/admin/waitlist/tasks/${task.id}` : "/admin/waitlist/tasks";
      const method = task ? "PUT" : "POST";
      const safeBody = {
        ...formData,
        points: Number.isNaN(formData.points) ? 0 : formData.points,
        durationDays: formData.type === "SOCIAL" ? formData.durationDays : undefined,
      };
      const res = await apiRequest(url, { method, body: safeBody });
      if (!res.ok) throw res.error;
      onSave();
    } catch (err: any) {
      alert(err.message || "Operation failed");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md overscroll-none"
      onWheel={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel border-zinc-800 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl overscroll-contain outline-none"
        tabIndex={-1} // Allow focus for keyboard events
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
             <div className="p-2 bg-[#2547D0] rounded-lg">
               <Shield className="w-5 h-5 text-white" />
             </div>
            {task ? "Edit Protocol" : "New Protocol"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
             <div>
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Title</label>
               <input
                 required
                 type="text"
                 className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#2547D0] outline-none"
                 value={formData.title}
                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                 placeholder="e.g., Follow us on Twitter"
               />
             </div>
             <div>
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Description</label>
               <textarea
                 required
                 className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#2547D0] outline-none min-h-[100px]"
                 value={formData.description}
                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                 placeholder="Explain what the user needs to do..."
               />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Type</label>
                  <select
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#2547D0] outline-none"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="SOCIAL">Social Interaction</option>
                    <option value="DAILY">Daily Check-in</option>
                    <option value="ONE_TIME">One-time Action</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Reward (PXP)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-[#2547D0] outline-none"
                    value={Number.isNaN(formData.points) ? "" : formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  />
               </div>
             </div>
             
             <div>
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Action Link</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                   <Share2 size={14} className="text-zinc-600" />
                 </div>
                 <input
                   type="url"
                   className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 p-3.5 text-sm text-white focus:border-[#2547D0] outline-none"
                   value={formData.link}
                   onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                   placeholder="https://..."
                 />
               </div>
             </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Iconography</label>
            <div 
              className="grid grid-cols-5 gap-3 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50 max-h-40 overflow-y-auto custom-scrollbar overscroll-contain focus:border-[#2547D0]/50 outline-none"
              tabIndex={0} // Make grid keyboard scrollable
              onWheel={(e) => e.stopPropagation()} // Stop wheel event from reaching backdrop
            >
              {iconOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.icon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: opt.id })}
                    className={`aspect-square flex items-center justify-center rounded-xl transition-all ${
                      isSelected
                        ? "bg-[#2547D0] text-white shadow-lg shadow-[#2547D0]/20 scale-105"
                        : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#2547D0] hover:bg-[#1e3aa0] text-white shadow-lg shadow-[#2547D0]/20 transition-all hover:scale-[1.02]"
            >
              {task ? "Save Changes" : "Create Protocol"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}