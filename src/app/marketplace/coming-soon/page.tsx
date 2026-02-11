"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Lock,
  ShoppingBag,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function MarketplaceComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvpgkwb";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        setEmail(""); // Clear input
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="relative w-full min-h-svh flex flex-col items-center justify-center overflow-hidden bg-[#030305] text-white selection:bg-indigo-500/30">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-[blue]/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-[black]/20 blur-[120px] rounded-full animate-pulse-slow delay-1000"></div>
      </div>

      <div className="absolute top-8 left-6 md:left-12 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full border border-white/10 bg-white/5 group-hover:bg-white/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium tracking-wide">
            Back to Website
          </span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-linear-to-tr from-indigo-900 to-[#030305] border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <ShoppingBag size={40} className="text-white" />
            <div className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock size={8} /> BETA
            </div>
          </div>
        </motion.div>

        {/* Text Headers */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-space font-bold text-4xl sm:text-6xl md:text-7xl mb-6 tracking-tight"
        >
          Commerce, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[blue]/20 via-grey-300 to-white">
            Decrypted.
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-jakarta text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We are building the first zero-knowledge marketplace. Trade digital
          goods and real-world assets without compromising your identity.
        </motion.p>

        {/*EMAIL CAPTURE FORM*/}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-md"
        >
          {status === "success" ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-2xl text-center backdrop-blur-sm"
            >
              <p className="font-semibold text-lg mb-1">You&apos;re on the list!</p>
              <p className="text-sm opacity-80">
                We&apos;ll ping you when the revolution starts.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-xs underline opacity-60 hover:opacity-100"
              >
                Register another email
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-black-300 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>

              <div className="relative flex items-center bg-[#0A0A12] border border-white/10 rounded-2xl p-2 pl-4">
                <Bell className="text-gray-500 mr-3" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  disabled={status === "submitting"}
                  placeholder="Enter your email for early access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 font-jakarta disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="bg-blue-100/20 hover:bg-blue-100/30 disabled:bg-indigo-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shrink-0 min-w-30 flex justify-center items-center"
                >
                  {status === "submitting" ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Notify Me"
                  )}
                </button>
              </div>

              {/* Error Message */}
              {status === "error" && (
                <div className="absolute -bottom-10 left-0 w-full flex items-center justify-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}

              {/* Status Note */}
              {status === "idle" && (
                <p className="mt-4 text-xs text-gray-600 flex items-center justify-center gap-2">
                  <Sparkles size={12} /> Priority access for early subscribers
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>

      {/* Buttom Stats */}
      <div className="absolute bottom-0 w-full border-t border-white/5 bg-black/20 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-6 text-sm text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>STATUS: IN DEVELOPMENT</span>
          </div>

          <div className="hidden md:block">{"/// ENCRYPTED CONNECTION"}</div>

          <div>EST. LAUNCH: Q2 2026</div>
        </div>
      </div>
    </main>
  );
}
