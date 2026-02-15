import React from 'react';
import { 
  Users, 
  Lock, 
  Clock, 
  Coins, 
  Unlock,
  ShieldAlert,
  Calendar,
  Search,
  CheckCircle,
  FileText
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  pxpBalance: number;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
  createdAt: string;
}

interface BannedIdentitiesProps {
  users: AdminUser[];
  loading: boolean;
  onUnban: (id: string) => void;
  onShowHistory: (user: AdminUser) => void;
}

export function BannedIdentities({ users, loading, onUnban, onShowHistory }: BannedIdentitiesProps) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-2 border-[#2547D0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="mono text-[10px] text-zinc-500 uppercase tracking-widest">Accessing Restricted Records...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-24 text-center">
        <CheckCircle className="w-10 h-10 mx-auto mb-4 text-emerald-500/20" />
        <p className="text-zinc-500 text-sm font-medium">No terminated identities found in the archive.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-zinc-900/60 border-b border-white/5">
            <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Terminated Identity</th>
            <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Last PXP Volume</th>
            <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Termination Breach</th>
            <th className="px-6 py-4 text-left mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Timeline</th>
            <th className="px-6 py-4 text-right mono text-[10px] text-zinc-500 uppercase tracking-widest font-normal">Control</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-red-500/[0.02] transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-xs font-black text-zinc-500 border border-white/5 shadow-inner">
                      {user.username ? user.username.slice(0, 2).toUpperCase() : "??"}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-zinc-950">
                      <Lock size={8} className="text-white" />
                    </div>
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
                   <Coins size={12} className="text-zinc-500" />
                   <span className="mono text-xs font-bold text-zinc-400 group-hover/pxp:text-white transition-colors">
                     {(user.pxpBalance || 0).toLocaleString()}
                   </span>
                </button>
              </td>

              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <span className="text-red-400/80 text-xs font-medium leading-relaxed">
                    {user.banReason || "Security Violation: Undefined"}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Calendar size={10} />
                    <span className="mono text-[10px] uppercase font-bold">
                      {user.bannedAt ? new Date(user.bannedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-600">
                    <Clock size={10} />
                    <span className="mono text-[9px] uppercase">
                      {user.bannedAt ? new Date(user.bannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => {
                    if (confirm(`ADMIN AUTHORIZATION REQUIRED:\n\nAre you sure you want to reinstate identity "${user.username}"?\n\nThis will revoke the current termination policy.`)) {
                      onUnban(user.id);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#2547D0]/10 hover:bg-[#2547D0]/20 text-[#2547D0] border border-[#2547D0]/20 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                >
                  Revoke Ban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
