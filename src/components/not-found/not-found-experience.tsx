"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpenText,
  Download,
  Radar,
  ShieldCheck,
  Waypoints,
} from "lucide-react";

import { getFeaturedBlogPosts } from "@/lib/blog-posts";
import { handleSmartDownload } from "@/lib/downloadHelper";
import ArchiveOracle from "./archive-oracle";
import MissingBlockScene from "./missing-block-scene";
import NetworkBackdrop from "./network-backdrop";

const SCAN_PHASES = [
  {
    title: "Scanning route",
    description: "Checking the link you opened.",
  },
  {
    title: "Checking network",
    description: "Looking for a matching page on the network.",
  },
  {
    title: "No match found",
    description: "No page exists for this address.",
  },
  {
    title: "404 Page Not Found",
    description: "The page you requested does not exist.",
  },
] as const;

type TimerListRef = MutableRefObject<number[]>;
type TimerRef = MutableRefObject<number | null>;

function clearTimerList(timerList: TimerListRef) {
  for (const timer of timerList.current) {
    window.clearTimeout(timer);
  }

  timerList.current = [];
}

function clearTimer(timerRef: TimerRef) {
  if (timerRef.current) {
    window.clearTimeout(timerRef.current);
  }
}

function runScanSequence(
  timerList: TimerListRef,
  setScanIndex: Dispatch<SetStateAction<number>>,
  setScanCycle: Dispatch<SetStateAction<number>>,
) {
  clearTimerList(timerList);
  setScanIndex(0);
  setScanCycle((current) => current + 1);

  [650, 1450, 2350].forEach((delay, index) => {
    const timer = window.setTimeout(() => {
      setScanIndex(index + 1);
    }, delay);

    timerList.current.push(timer);
  });
}

function triggerGlitchState(
  glitchTimer: TimerRef,
  setIsGlitching: Dispatch<SetStateAction<boolean>>,
) {
  clearTimer(glitchTimer);
  setIsGlitching(true);

  glitchTimer.current = window.setTimeout(() => {
    setIsGlitching(false);
  }, 420);
}

function getRouteFingerprint(pathname: string) {
  let hash = 0;

  for (const character of pathname) {
    hash = (hash * 33 + character.charCodeAt(0)) >>> 0;
  }

  return `0x${hash.toString(16).padStart(8, "0")}`;
}

function getCompactPath(pathname: string) {
  if (pathname.length <= 38) {
    return pathname;
  }

  return `${pathname.slice(0, 18)}...${pathname.slice(-14)}`;
}

export default function NotFoundExperience() {
  const pathname = usePathname() || "/unknown-route";
  const router = useRouter();
  const [scanIndex, setScanIndex] = useState(0);
  const [scanCycle, setScanCycle] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const scanTimers = useRef<number[]>([]);
  const glitchTimer = useRef<number | null>(null);
  const miningTimer = useRef<number | null>(null);

  const playScanSequence = () => {
    runScanSequence(scanTimers, setScanIndex, setScanCycle);
  };

  const triggerGlitch = () => {
    triggerGlitchState(glitchTimer, setIsGlitching);
  };

  const handleMineAttempt = () => {
    triggerGlitch();

    clearTimer(miningTimer);

    setIsMining(true);
    setScanIndex(2);
    setScanCycle((current) => current + 1);

    miningTimer.current = window.setTimeout(() => {
      setIsMining(false);
      setScanIndex(3);
    }, 1800);
  };

  useEffect(() => {
    runScanSequence(scanTimers, setScanIndex, setScanCycle);

    return () => {
      clearTimerList(scanTimers);
      clearTimer(glitchTimer);
      clearTimer(miningTimer);
    };
  }, []);

  const fingerprint = getRouteFingerprint(pathname);
  const compactPath = getCompactPath(pathname);
  const activePhase = SCAN_PHASES[scanIndex];
  const featuredPosts = getFeaturedBlogPosts(3);
  const diagnosticCards = [
    {
      label: "Page status",
      value: "Not found",
      detail: "There is no page at this address.",
      icon: ShieldCheck,
    },
    {
      label: "Requested URL",
      value: compactPath,
      detail: "Check the link for mistakes or go back.",
      icon: Waypoints,
    },
    {
      label: "Network",
      value: "12 sentries online",
      detail: "The network is live. This route is the problem.",
      icon: Radar,
    },
  ] as const;

  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-[#020410] pt-28 pb-16 md:pt-32">
      <NetworkBackdrop />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/25 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-grid gap-3 text-left">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.38em] text-cyan-100/56">
                <span className="h-px w-10 bg-gradient-to-r from-cyan-300/85 to-transparent" />
                404 page not found
              </div>
              <div className="grid max-w-max gap-2 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-3 backdrop-blur-xl">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-[10px] uppercase tracking-[0.32em] text-slate-400/76">
                    request
                  </span>
                  <span className="font-mono text-sm text-white/92">
                    {compactPath}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-[10px] uppercase tracking-[0.32em] text-slate-400/76">
                    fingerprint
                  </span>
                  <span className="font-mono text-sm text-cyan-100/86">
                    {fingerprint}
                  </span>
                </div>
              </div>
            </div>

            <h1 className="mt-6 font-space text-5xl font-bold leading-[0.96] text-white sm:text-6xl md:text-7xl">
              404{" "}
              <span className="bg-gradient-to-r from-white via-cyan-200 to-[#8fb0ff] bg-clip-text text-transparent">
                Page Not Found
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200/78 sm:text-xl">
              The page you tried to open does not exist. It may have been moved,
              deleted, or the link is wrong.
            </p>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
              On PENXCHAIN, it looks like a missing block in the chain.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#2547D0] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(37,71,208,0.35)] transition-all duration-300 hover:bg-[#1e3a8a] hover:shadow-[0_22px_56px_rgba(37,71,208,0.42)]"
              >
                <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                Go Home
              </Link>

              <Link
                href="/docs"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/4 px-6 py-3.5 text-sm font-semibold text-white/88 backdrop-blur-md transition-all duration-300 hover:border-cyan-200/30 hover:bg-white/8 hover:text-white"
              >
                <BookOpenText size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                Explore Documentation
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={playScanSequence}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200/14 bg-cyan-200/5 px-4 py-2.5 text-sm font-medium text-cyan-100/82 backdrop-blur-md transition-all duration-300 hover:border-cyan-200/28 hover:bg-cyan-200/10 hover:text-white"
              >
                <Radar size={16} />
                Re-scan Network
              </button>

              <button
                type="button"
                onClick={() => handleSmartDownload(router)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-medium text-slate-200/80 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:text-white"
              >
                <Download size={16} />
                Download Wallet
              </button>
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.34em] text-cyan-100/62">
                    Page Status
                  </p>
                  <p className="mt-2 font-space text-2xl font-bold text-white">
                    {activePhase.title}
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.34em] text-slate-200/70">
                  {scanIndex + 1} / {SCAN_PHASES.length}
                </div>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300/80 sm:text-base">
                {activePhase.description}
              </p>

              <div className="mt-4 h-1.5 rounded-full bg-white/6">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-[#2547D0] to-fuchsia-400"
                  initial={{ width: "25%" }}
                  animate={{
                    width: `${((scanIndex + 1) / SCAN_PHASES.length) * 100}%`,
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.12 }}
          >
            <MissingBlockScene
              isGlitching={isGlitching}
              isMining={isMining}
              scanCycle={scanCycle}
              statusMessage={activePhase.description}
              onBrokenBlockHover={triggerGlitch}
              onMineAttempt={handleMineAttempt}
            />
          </motion.div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
          >
            <ArchiveOracle posts={featuredPosts} />
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {diagnosticCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.28 + index * 0.08 }}
                  className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/15 bg-cyan-200/8 text-cyan-100/82">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400/72">
                        {card.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {card.value}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300/72">
                    {card.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
