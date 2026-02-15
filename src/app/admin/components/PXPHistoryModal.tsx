"use client";

import React, { useEffect, useState } from "react";
import { X, Gift, AlertTriangle, ArrowUpRight, ShieldAlert, Award, UserPlus, FileText } from "lucide-react";
import { apiRequest } from "@/lib/api-client"; // Ensure this path is correct based on project structure
import { motion, AnimatePresence } from "framer-motion";

interface HistoryItem {
  id: string;
  type: "TASK" | "REFERRAL" | "BONUS" | "PENALTY" | "ADJUSTMENT";
  amount: number;
  description: string;
  timestamp: string;
}

interface PXPHistoryModalProps {
  userId: string;
  username: string;
  onClose: () => void;
}

export function PXPHistoryModal({ userId, username, onClose }: PXPHistoryModalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const res = await apiRequest<{ history: HistoryItem[] }>(`/admin/users/${userId}/history`);
        if (!res.ok) throw res.error;
        setHistory(res.data.history);
      } catch (err: any) {
        setError(err.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchHistory();
  }, [userId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "TASK": return <Award size={16} className="text-emerald-400" />;
      case "REFERRAL": return <UserPlus size={16} className="text-blue-400" />;
      case "BONUS": return <Gift size={16} className="text-purple-400" />;
      case "PENALTY": return <ShieldAlert size={16} className="text-red-500" />;
      default: return <FileText size={16} className="text-zinc-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#121214] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#2547D0]">PXP History:</span> @{username}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mono">User ID: {userId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-12 space-y-3">
               <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#2547D0] animate-spin" />
               <p className="text-xs text-zinc-500 mono animate-pulse">ANALYZING_LEDGER...</p>
             </div>
          ) : error ? (
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center text-sm">
               {error}
             </div>
          ) : history.length === 0 ? (
             <div className="text-center py-12 text-zinc-500 text-sm mono">
               NO_TRANSACTION_RECORDS_FOUND
             </div>
          ) : (
             <div className="space-y-2">
               {history.map((item) => (
                 <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-900/30 border border-white/5 rounded-lg hover:bg-white/[0.02] transition-colors group">
                   <div className="flex items-start gap-3">
                     <div className={`p-2 rounded-full bg-zinc-800 ${item.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                       {getTypeIcon(item.type)}
                     </div>
                     <div>
                       <div className="text-sm text-white font-medium">{item.description}</div>
                       <div className="text-[10px] text-zinc-500 mono mt-0.5">
                         {new Date(item.timestamp).toLocaleString()} • {item.type}
                       </div>
                     </div>
                   </div>
                   <div className={`mono font-bold text-sm ${item.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                     {item.amount > 0 ? "+" : ""}{item.amount} PXP
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
