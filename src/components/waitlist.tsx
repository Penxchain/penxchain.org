"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdakqavv";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Tells Formspree to return JSON, not redirect
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail(""); // Clear the field
        // Optional: Reset to idle after 5 seconds so they can submit again if needed?
        // Or keep it success to show they are done.
      } else {
        setStatus("error");
        // Reset error after 3 seconds so they can try again
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section
      id="waitlist"
      className="relative w-full py-32 bg-[#020410] overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="font-space font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">
            Stay Updated with <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-500">
              the Community
            </span>
          </h2>
          <p className="font-jakarta text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Gain the peace of mind that comes from knowing your digital world is
            genuinely yours, free from centralized control.
          </p>
        </motion.div>

        {/* --- THE FORM --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-lg mx-auto"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-600 transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email" // Formspree looks for 'name="email"' or 'name="_replyto"'
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="w-full bg-[#E6E6E6] text-black font-jakarta font-medium placeholder:text-gray-500 py-4 pl-12 pr-6 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500/50 focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] focus:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={`
                relative w-full py-4 rounded-2xl font-space font-bold text-lg tracking-wide transition-all duration-300 overflow-hidden
                ${
                  status === "success"
                    ? "bg-green-800 text-white shadow-[0_0_30px_rgba(22,163,74,0.4)] cursor-default"
                    : status === "error"
                    ? "bg-red-900 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                    : "bg-[#131128] text-white hover:bg-[#1f1c3d] shadow-[0_0_20px_rgba(19,17,40,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                }
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {status === "loading" && <Loader2 className="animate-spin" />}

                {status === "idle" && "Subscribe"}

                {status === "loading" && "Joining..."}

                {status === "success" && (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Welcome to the Future</span>
                  </>
                )}

                {status === "error" && (
                  <>
                    <AlertCircle size={20} />
                    <span>Something went wrong. Try again.</span>
                  </>
                )}
              </div>

              {/* Button Shine Effect (Only when Idle) */}
              {status === "idle" && (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out" />
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <p className="mt-6 text-gray-600 text-sm font-jakarta">
            No spam. Only essential updates. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
