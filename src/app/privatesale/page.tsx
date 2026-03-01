"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Lock,
  Clock,
  TrendingUp,
  Wallet,
  ChevronRight,
  Info,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Database,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/api";

// Glass Card Component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={`relative overflow-hidden backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ${className}`}
    >
      {/* Subtle shine effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const StatBox = ({ label, value, icon: Icon, subtext }: { label: string; value: string; icon: any; subtext?: string }) => {
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-penx-primary/30 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-penx-primary/10 rounded-lg group-hover:bg-penx-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-penx-primary" />
        </div>
        {subtext && <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full">{subtext}</span>}
      </div>
      <div className="text-2xl font-bold text-white mb-1 font-space">{value}</div>
      <div className="text-sm text-gray-400 font-jakarta">{label}</div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
      <span className="text-gray-400 font-jakarta">{label}</span>
      <span className="text-white font-medium text-right font-space">{value}</span>
    </div>
  );
};

export default function PrivateSalePage() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [penxAmount, setPenxAmount] = useState("0");
  const [copied, setCopied] = useState(false);
  
  // Stats State
  const [stats, setStats] = useState({
    totalRaised: 0, // Default fallback
    participants: 0,
    progressPercentage: 0
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const RATE = 400; // 1 USDC = 400 PENX
  const DEPOSIT_ADDRESS = "0x99e790eF160690CC2ECA5B6CE08d2b2B353758f7";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await apiRequest<{ totalRaised: number; participants: number; progressPercentage: number }>("/privatesale/stats");
    if (res.ok) {
      setStats({
        totalRaised: res.data.totalRaised || 0,
        participants: res.data.participants || 0,
        progressPercentage: res.data.progressPercentage || 0
      });
    }
  };

  useEffect(() => {
    const val = parseFloat(amount);
    if (!isNaN(val)) {
      setPenxAmount((val * RATE).toLocaleString());
    } else {
      setPenxAmount("0");
    }
  }, [amount]);

  const copyAddress = () => {
    navigator.clipboard.writeText(DEPOSIT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!amount || !walletAddress || !txHash) {
      setSubmitStatus("error");
      setErrorMessage("Please fill in all fields including Transaction Hash");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const res = await apiRequest("/privatesale/order", {
        method: "POST",
        body: {
          walletAddress,
          usdtAmount: parseFloat(amount),
          txHash,
        },
      });

      if (res.ok) {
        setSubmitStatus("success");
        setAmount("");
        setWalletAddress("");
        setTxHash("");
        fetchStats(); // Refresh stats (though confirmed orders update stats, pending might not show yet depending on backend logic)
      } else {
        setSubmitStatus("error");
        setErrorMessage(res.error?.message || "Failed to submit order");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-penx-bg relative overflow-hidden pt-32 pb-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-penx-primary/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-penx-secondary/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
           <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-penx-primary/10 border border-penx-primary/20 text-penx-primary text-sm font-bold mb-6 backdrop-blur-sm"
           >
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-penx-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-penx-primary"></span>
             </span>
             ICO Live
           </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold font-space text-white mb-6 tracking-tight"
          >
            Invest in <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Privacy</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto font-jakarta leading-relaxed"
          >
            Join  PENXCHAIN ICO and secure your allocation at the lowest possible entry price before public listing.
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Stats & Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Progress Card */}
            <GlassCard className="p-8 border-t-4 border-t-penx-primary">
              <div className="flex justify-between items-end mb-4">
                <div>
                   <h3 className="text-2xl font-bold text-white flex items-center gap-2 font-space">
                    <TrendingUp className="text-penx-primary" /> Sale Progress
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Funds raised towards soft cap</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white font-space">${stats.totalRaised.toLocaleString()}</div>
                  <div className="text-sm text-penx-primary font-bold">{stats.progressPercentage.toFixed(1)}% Filled</div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative h-6 bg-white/5 rounded-full overflow-hidden mb-8 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progressPercentage}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-penx-primary via-blue-500 to-penx-secondary relative overflow-hidden"
                >
                   {/* Animated shine on progress bar */}
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>

              <div className="flex justify-between text-sm font-medium border-t border-white/5 pt-4">
                 <div className="text-center">
                    <div className="text-gray-400 mb-1">Soft Cap</div>
                    <div className="text-white font-bold">$80,000</div>
                 </div>
                 <div className="text-center">
                    <div className="text-gray-400 mb-1">Hard Cap</div>
                    <div className="text-white font-bold">$100,000</div>
                 </div>
                 <div className="text-center">
                    <div className="text-gray-400 mb-1">Participants</div>
                    <div className="text-white font-bold">{stats.participants}+</div>
                 </div>
              </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatBox label="Current Price" value="$0.0025" icon={Zap} subtext="+0%" />
              <StatBox label="Listing Price" value="$0.006" icon={Database} subtext="+200%" />
              <StatBox label="Min Allocation" value="$100" icon={Lock} />
              <StatBox label="Vesting" value="3 Months" icon={Clock} />
            </div>

            {/* Token Details */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-space">
                <Info className="text-penx-primary" /> Token Information
              </h3>
              <div className="space-y-1">
                <InfoRow label="Token Name" value="PENXCHAIN" />
                <InfoRow label="Symbol" value="PENX" />
                <InfoRow label="Network" value="Base" />
                <InfoRow label="Total Supply" value="1,000,000,000 PENX" />
                <InfoRow label="Private Sale Allocation" value="40,000,000 PENX (4%)" />
                <InfoRow 
                  label="Vesting Schedule" 
                  value={<span className="text-sm text-right block max-w-[200px]">25% at TGE, 1 month cliff, then linear monthly over 3 months</span>} 
                />
              </div>
            </GlassCard>

             {/* Why Join */}
            <GlassCard className="p-8 bg-gradient-to-br from-penx-primary/10 to-transparent border-penx-primary/20">
               <h3 className="text-xl font-bold text-white mb-4 font-space">Why Join Private Sale?</h3>
               <ul className="space-y-3">
                 {[
                   "Lowest entry price ($0.05 vs $0.15 listing)",
                   "Guaranteed allocation before public IDO",
                   "Early access to staking & governance",
                   "Priority access to mainnet beta"
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-gray-300">
                     <Check className="w-5 h-5 text-penx-primary shrink-0 mt-0.5" />
                     <span>{item}</span>
                   </li>
                 ))}
               </ul>
            </GlassCard>
          </motion.div>

          {/* Right Column: Contribution Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            <div className="sticky top-24">
              {/* Form Card */}
              <GlassCard className="p-8 border-penx-primary/30 shadow-[0_0_60px_-15px_rgba(37,71,208,0.3)] bg-gradient-to-b from-white/[0.05] to-black/40">
                <div className="text-center mb-8">
                   <h3 className="text-2xl font-bold text-white mb-2 font-space">Buy PENX Tokens</h3>
                   <p className="text-gray-400 text-sm">1 USDC = {RATE} PENX ($0.0025)</p>
                </div>
                
                {submitStatus === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2 font-space">Payment Submitted!</h4>
                    <p className="text-gray-400 mb-6 font-jakarta">
                      Thank you for your contribution. Your order has been recorded. 
                      Please ensure you have sent the USDC to the deposit address. 
                      Once confirmed, your PENX allocation will be updated.
                    </p>
                    <button 
                      onClick={() => setSubmitStatus("idle")}
                      className="text-penx-primary hover:text-white font-medium transition-colors"
                    >
                      Make another purchase
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {/* Deposit Address Info - Moved up for visibility */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
                       <div className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">Send USDC (Base) To This Address:</div>
                       <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/5 mb-2">
                          <code className="text-xs text-white font-mono break-all">{DEPOSIT_ADDRESS}</code>
                          <button 
                            onClick={copyAddress}
                            className="ml-2 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                       </div>
                       <p className="text-[10px] text-gray-500 text-center">
                         Send only USDC (BASE). Tokens will be airdropped to your sending address.
                       </p>
                    </div>

                    {/* Your Wallet Address Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-jakarta">Your Wallet Address</label>
                      <input 
                        type="text" 
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="0x..." 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-space focus:outline-none focus:border-penx-primary/50 focus:ring-1 focus:ring-penx-primary/50 transition-all placeholder:text-gray-600 text-sm" 
                      />
                      <p className="text-[10px] text-gray-500 mt-1 ml-1">This address will receive the PENX tokens.</p>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-jakarta">Amount Sent (USDC)</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00" 
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white text-lg font-space focus:outline-none focus:border-penx-primary/50 focus:ring-1 focus:ring-penx-primary/50 transition-all placeholder:text-gray-600" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          <span className="text-white font-bold text-sm">USDC</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Hash Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-jakarta">Transaction Hash (TXID)</label>
                      <input 
                        type="text" 
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        placeholder="0x..." 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-space focus:outline-none focus:border-penx-primary/50 focus:ring-1 focus:ring-penx-primary/50 transition-all placeholder:text-gray-600 text-sm" 
                      />
                      <p className="text-[10px] text-gray-500 mt-1 ml-1">The transaction ID from your wallet (e.g. MetaMask history).</p>
                    </div>

                    {/* Output */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-jakarta">You Receive (PENX)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          readOnly 
                          value={penxAmount}
                          placeholder="0.00" 
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white text-lg font-space focus:outline-none cursor-default" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          <span className="text-white font-bold text-sm">PENX</span>
                        </div>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errorMessage}
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-penx-primary to-penx-secondary hover:from-blue-600 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" /> 
                          I Have Made Payment
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-start gap-3 text-xs text-gray-400 mt-2 bg-blue-900/10 p-3 rounded-lg border border-blue-500/10">
                      <AlertCircle className="w-4 h-4 text-penx-primary shrink-0 mt-0.5" />
                      <p>By participating, you confirm you understand the risks involved with crypto investments.</p>
                    </div>
                  </div>
                )}
              </GlassCard>
              
              {/* Support Contact */}
              <div className="mt-6 text-center">
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                  Need help buying? Contact Support <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
