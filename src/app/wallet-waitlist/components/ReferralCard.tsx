"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Users } from "lucide-react";
import { FaLink } from "react-icons/fa6";
import type { User } from "../types/waitlist";

interface ReferralCardProps {
  user: User;
}

export default function ReferralCard({ user }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/wallet-waitlist/signup?ref=${user.referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative bg-[#050505] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#2547D0]/10 flex items-center justify-center border border-[#2547D0]/20 group-hover:border-[#2547D0]/50 transition-colors">
          <Users className="w-4 h-4 text-[#2547D0]" />
        </div>
        <div>
          <h3 className="text-white font-bold tracking-tight text-sm uppercase">
            Invite Protocols
          </h3>
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider">
            +150 PXP REWARD
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
          <p className="text-white/30 text-[9px] uppercase tracking-wider mb-1 font-mono">
            Referrals
          </p>
          <p className="text-white text-lg font-bold">
            {Number(user.referralCount ?? 0)}
          </p>
        </div>
        <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
          <p className="text-white/30 text-[9px] uppercase tracking-wider mb-1 font-mono">
            Earned
          </p>
          <p className="text-[#2547D0] text-lg font-bold">
            {(Number(user.referralCount ?? 0) * 150).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mb-4">
        <label className="block text-white/30 text-[9px] uppercase tracking-wider mb-2 font-mono">
          Your Referral Code
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-lg text-white font-mono text-sm tracking-widest text-center uppercase">
            {user.referralCode || "—"}
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-white transition-all"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#2547D0]" />
            ) : (
              <Copy className="w-4 h-4 text-white/50" />
            )}
          </button>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-4">
        <label className="block text-white/30 text-[9px] uppercase tracking-wider mb-2 font-mono">
          Uplink Address
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-3 py-3 bg-white/[0.02] border border-white/5 rounded-lg text-white/40 text-[10px] truncate focus:outline-none font-mono"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-[#2547D0] hover:bg-[#2547D0]/90 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#2547D0]/20"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Bonus Info */}
      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg mt-6">
        <div className="flex items-start gap-3">
          <FaLink className="w-3 h-3 text-[#2547D0] flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="text-white font-bold mb-1 uppercase tracking-wider text-[10px]">
              Multiplier Active
            </p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-white/40 text-[9px] font-mono">
                5 REFS → +750 PXP
              </span>
              <span className="text-white/40 text-[9px] font-mono">
                10 REFS → +1500 PXP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
