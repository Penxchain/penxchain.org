import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MissingBlockSceneProps = {
  isGlitching: boolean;
  isMining: boolean;
  scanCycle: number;
  statusMessage: string;
  onBrokenBlockHover: () => void;
  onMineAttempt: () => void;
};

type BlockNodeProps = {
  code: string;
  label: string;
  x: number;
  y: number;
  delay: number;
};

const BLOCKS = [
  { code: "00", label: "genesis", x: 14, y: 68, delay: 0.05 },
  { code: "91", label: "proof", x: 32, y: 48, delay: 0.15 },
  { code: "A4", label: "relay", x: 68, y: 48, delay: 0.25 },
  { code: "E9", label: "vault", x: 86, y: 68, delay: 0.35 },
] as const;

const CHAIN_SEGMENTS = [
  { x1: 14, y1: 68, x2: 32, y2: 48 },
  { x1: 32, y1: 48, x2: 44, y2: 38 },
  { x1: 56, y1: 38, x2: 68, y2: 48 },
  { x1: 68, y1: 48, x2: 86, y2: 68 },
  { x1: 10, y1: 32, x2: 24, y2: 44 },
  { x1: 76, y1: 44, x2: 92, y2: 32 },
] as const;

const TELEMETRY = [
  { label: "Page", value: "not found" },
  { label: "Status", value: "no match" },
  { label: "Latency", value: "< 12ms" },
  { label: "Network", value: "online" },
] as const;

function BlockNode({ code, label, x, y, delay }: BlockNodeProps) {
  return (
    <motion.div
      className="absolute h-22 w-22 -translate-x-1/2 -translate-y-1/2 sm:h-24 sm:w-24"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[30px] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(14,20,42,0.96),rgba(4,8,22,0.88))] shadow-[0_0_35px_rgba(37,71,208,0.22)] backdrop-blur-xl"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 6.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          delay,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-x-3 top-3 flex items-center justify-between text-[8px] uppercase tracking-[0.36em] text-cyan-100/60">
          <span>blk</span>
          <span>ok</span>
        </div>
        <div className="absolute inset-x-0 top-[50%] flex -translate-y-1/2 flex-col items-center gap-1">
          <span className="font-space text-3xl font-bold tracking-[0.12em] text-white">
            {code}
          </span>
          <span className="text-[9px] uppercase tracking-[0.34em] text-slate-300/70">
            {label}
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3 h-1 rounded-full bg-gradient-to-r from-cyan-300/0 via-cyan-300/75 to-cyan-300/0" />
      </motion.div>
    </motion.div>
  );
}

export default function MissingBlockScene({
  isGlitching,
  isMining,
  scanCycle,
  statusMessage,
  onBrokenBlockHover,
  onMineAttempt,
}: MissingBlockSceneProps) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,28,0.96),rgba(2,4,16,0.92))] p-4 shadow-[0_40px_120px_rgba(2,6,23,0.85)] sm:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_50%_65%,rgba(37,71,208,0.16),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%,transparent_76%,rgba(255,255,255,0.02))]" />

      <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-white/8 bg-black/20 p-4 sm:h-[470px] sm:p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_46%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />
        <div
          key={scanCycle}
          className="nf-scan-line absolute inset-y-[-15%] left-[-24%] w-[24%] bg-gradient-to-r from-transparent via-cyan-200/24 to-transparent blur-2xl"
        />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cyan-200/15 bg-black/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.34em] text-cyan-100/70 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
          404 route
        </div>

        <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.34em] text-slate-200/65 backdrop-blur-md">
          chain depth: 404
        </div>

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {CHAIN_SEGMENTS.map((segment, index) => (
            <motion.line
              key={`${segment.x1}-${segment.y1}-${segment.x2}-${segment.y2}`}
              x1={segment.x1}
              y1={segment.y1}
              x2={segment.x2}
              y2={segment.y2}
              stroke="rgba(103, 232, 249, 0.26)"
              strokeWidth="0.46"
              strokeLinecap="round"
              strokeDasharray="2 4"
              animate={{ opacity: [0.18, 0.75, 0.18] }}
              transition={{
                duration: 3.5 + index * 0.25,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                delay: index * 0.14,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        <motion.div
          className="absolute left-1/2 top-[38%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-[1px]"
          animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.24, 0.42, 0.24] }}
          transition={{
            duration: 4.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {BLOCKS.map((block) => (
          <BlockNode key={block.code} {...block} />
        ))}

        <motion.button
          type="button"
          aria-label="Attempt to mine the missing block"
          onClick={onMineAttempt}
          onFocus={onBrokenBlockHover}
          onMouseEnter={onBrokenBlockHover}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group absolute left-1/2 top-[38%] flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[30px] border border-dashed border-cyan-300/45 bg-[linear-gradient(180deg,rgba(9,13,31,0.92),rgba(2,4,16,0.78))] shadow-[0_0_40px_rgba(56,189,248,0.15)] backdrop-blur-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020410]",
            isGlitching && "nf-glitch-active border-rose-300/50 shadow-[0_0_44px_rgba(244,114,182,0.18)]",
            isMining && "border-emerald-300/55 shadow-[0_0_44px_rgba(16,185,129,0.22)]",
          )}
        >
          <div className="absolute inset-x-3 top-3 flex items-center justify-between text-[8px] uppercase tracking-[0.34em] text-cyan-100/65">
            <span>404</span>
            <span>null</span>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <AnimatePresence mode="wait">
            {isMining ? (
              <motion.div
                key="mining"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-3 rounded-[24px] border border-dashed border-emerald-300/45"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <span className="text-[9px] uppercase tracking-[0.38em] text-emerald-100/70">
                    mining
                  </span>
                  <span className="font-space text-xl font-bold text-white">
                    RECOVER
                  </span>
                </div>
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-1.5 origin-left bg-gradient-to-r from-emerald-300 via-cyan-200 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="missing"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="relative z-10 flex flex-col items-center justify-center gap-1.5"
              >
                <span className="font-space text-3xl font-bold tracking-[0.18em] text-white">
                  ??
                </span>
                <span className="text-[9px] uppercase tracking-[0.34em] text-slate-300/70">
                  click to mine
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isGlitching && !isMining ? (
              <>
                <motion.span
                  initial={{ opacity: 0, x: -4, y: -2 }}
                  animate={{ opacity: [0, 0.9, 0], x: [-4, 8, -2], y: [-2, 4, -3] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-space text-3xl font-bold tracking-[0.2em] text-cyan-200"
                >
                  404
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 6, y: 3 }}
                  animate={{ opacity: [0, 0.7, 0], x: [6, -9, 2], y: [3, -4, 2] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.42, ease: "easeInOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-space text-3xl font-bold tracking-[0.2em] text-rose-300/90"
                >
                  404
                </motion.span>
              </>
            ) : null}
          </AnimatePresence>

          <div className="absolute inset-x-4 bottom-3 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent opacity-80" />
        </motion.button>

        <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.34em] text-slate-300/65">
            <span>page status</span>
            <span>{isMining ? "trying recovery" : "not found"}</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-200/84">
            {statusMessage}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {TELEMETRY.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/7 bg-black/15 px-3 py-2"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400/75">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
