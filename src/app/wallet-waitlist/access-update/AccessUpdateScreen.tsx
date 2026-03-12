"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Radar,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

const workstreams = [
  {
    title: "Access Flow Refresh",
    description:
      "We are refining the waitlist access sequence so returning users land in a cleaner, more stable experience.",
    icon: Wrench,
  },
  {
    title: "Telemetry Hardening",
    description:
      "Points, task state, and operational signals are being tuned so the interface reflects real activity with less noise.",
    icon: Radar,
  },
  {
    title: "Stability Pass",
    description:
      "We are smoothing edge cases across login, dashboard, and profile surfaces before reopening the full wallet waitlist terminal.",
    icon: Activity,
  },
];

const guarantees = [
  "Your existing waitlist data remains intact.",
  "No action is required from users right now.",
  "The main waitlist page is still available.",
];

const waitlistGridStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
  backgroundSize: "52px 52px",
  WebkitMaskImage: "radial-gradient(circle at center, black 52%, transparent 100%)",
  maskImage: "radial-gradient(circle at center, black 52%, transparent 100%)",
};

function StatusChip({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "accent";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${
        tone === "accent"
          ? "border-[#9E2235]/35 bg-[#9E2235]/14 text-rose-100"
          : "border-zinc-800/60 bg-zinc-950/55 text-zinc-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "accent" ? "bg-[#C4455C]" : "bg-emerald-400"
        }`}
      />
      {label}
    </span>
  );
}

export default function AccessUpdateScreen({
  requestedPath,
}: {
  requestedPath: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">
      <AnimatedBackground />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={waitlistGridStyle}
      />
      <div className="pointer-events-none absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[#7A1F2B]/24 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-24 h-96 w-96 rounded-full bg-[#C4455C]/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-4 border-b border-white/8 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-space text-2xl font-bold tracking-tight text-white">
              PENXCHAIN Access Update
            </p>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Wallet waitlist terminal access is temporarily narrowed while we
              make a structured adjustment pass.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusChip label="Main Waitlist Live" />
            <StatusChip label="Adjustment Mode" tone="accent" />
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >

            <h1 className="mt-6 max-w-4xl font-space text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">Wallet waitlist access</span>{" "}
              <span className="bg-gradient-to-r from-[#7A1F2B] via-[#9E2235] to-[#C4455C] bg-clip-text text-transparent">
                is being refined right now.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              We are making focused adjustments across dashboard, login,
              signup, profile, leaderboard, and connected waitlist flows. The
              public waitlist landing page remains open while these deeper
              surfaces are temporarily routed here.
            </p>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Requested Route
                  </p>
                  <p className="mt-2 break-all font-space text-xl font-bold text-white">
                    {requestedPath}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#9E2235]/25 bg-[#9E2235]/10 px-4 py-3 shadow-[0_0_24px_rgba(158,34,53,0.10)]">
                  <div className="flex items-center gap-2 text-rose-100">
                    <ShieldCheck className="h-4 w-4 text-[#C4455C]" />
                    <span className="text-sm font-semibold">Data preserved</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/wallet-waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#9E2235]/35 bg-gradient-to-r from-[#7A1F2B] via-[#9E2235] to-[#C4455C] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(122,31,43,0.28)] transition hover:brightness-110"
              >
                <ArrowLeft className="h-4 w-4" />
                Return To Waitlist
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/8"
              >
                Explore Docs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/65 p-5 backdrop-blur-2xl sm:p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(158,34,53,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(196,69,92,0.12),transparent_28%)]" />
            <div className="relative space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Status Board
                  </p>
                  <p className="mt-2 font-space text-3xl font-bold tracking-tight text-white">
                    Adjustment pass in motion
                  </p>
                </div>
                <div className="rounded-2xl border border-[#9E2235]/25 bg-[#9E2235]/10 p-3">
                  <Clock3 className="h-5 w-5 text-[#C4455C]" />
                </div>
              </div>

              <div className="space-y-3">
                {workstreams.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/8 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl border border-[#9E2235]/25 bg-[#9E2235]/10 p-3">
                          <Icon className="h-4 w-4 text-[#E28A98]" />
                        </div>
                        <div>
                          <p className="font-space text-lg font-bold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-zinc-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-4 border-t border-white/8 pt-6 md:grid-cols-3">
          {guarantees.map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-white/8 bg-zinc-950/55 p-4 backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-[#2547D0]" />
                <p className="text-sm leading-7 text-zinc-300">{item}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
