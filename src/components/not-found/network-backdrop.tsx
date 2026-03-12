import { motion } from "framer-motion";

const NODES = [
  { x: 8, y: 18, size: 10, delay: 0.2 },
  { x: 19, y: 30, size: 7, delay: 0.6 },
  { x: 34, y: 16, size: 9, delay: 1 },
  { x: 47, y: 34, size: 8, delay: 0.1 },
  { x: 59, y: 18, size: 11, delay: 1.4 },
  { x: 73, y: 31, size: 8, delay: 0.5 },
  { x: 88, y: 20, size: 10, delay: 1.2 },
  { x: 16, y: 68, size: 9, delay: 0.9 },
  { x: 30, y: 82, size: 8, delay: 1.6 },
  { x: 47, y: 64, size: 12, delay: 0.4 },
  { x: 66, y: 78, size: 7, delay: 1.1 },
  { x: 84, y: 66, size: 10, delay: 0.7 },
] as const;

const LINKS = [
  [0, 1],
  [1, 2],
  [1, 7],
  [2, 3],
  [3, 4],
  [3, 9],
  [4, 5],
  [5, 6],
  [7, 8],
  [7, 9],
  [9, 10],
  [10, 11],
  [5, 11],
] as const;

const FLOATING_GLYPHS = [
  { label: "zk-proof", x: "8%", y: "58%", delay: 0.2 },
  { label: "sealed route", x: "74%", y: "14%", delay: 1.1 },
  { label: "witness: null", x: "63%", y: "72%", delay: 0.6 },
  { label: "privacy mesh", x: "21%", y: "10%", delay: 1.5 },
] as const;

export default function NetworkBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,71,208,0.26),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(139,180,255,0.14),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(20,36,95,0.28),transparent_30%)]" />
      <div className="nf-network-grid absolute inset-0 opacity-65" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,20,0.2),rgba(3,7,20,0.78))]" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-50"
        aria-hidden="true"
      >
        {LINKS.map(([fromIndex, toIndex], index) => {
          const from = NODES[fromIndex];
          const to = NODES[toIndex];

          return (
            <motion.line
              key={`${fromIndex}-${toIndex}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(139, 180, 255, 0.22)"
              strokeWidth="0.22"
              strokeLinecap="round"
              initial={{ pathLength: 0.2, opacity: 0.16 }}
              animate={{ pathLength: [0.25, 1, 0.25], opacity: [0.14, 0.5, 0.14] }}
              transition={{
                duration: 7.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                delay: index * 0.18,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {NODES.map((node, index) => (
        <motion.div
          key={`${node.x}-${node.y}`}
          className="absolute rounded-full bg-[#8bb4ff]/90 shadow-[0_0_18px_rgba(37,71,208,0.42)]"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
          }}
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{
            opacity: [0.2, 0.92, 0.25],
            scale: [0.92, 1.5, 0.92],
          }}
          transition={{
            duration: 4.5 + (index % 3),
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            delay: node.delay,
            ease: "easeInOut",
          }}
        >
          <span className="absolute inset-[-12px] rounded-full bg-[#2547D0]/26 blur-xl" />
        </motion.div>
      ))}

      {FLOATING_GLYPHS.map((glyph, index) => (
        <motion.div
          key={glyph.label}
          className="absolute hidden rounded-full border border-white/8 bg-black/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#dbe7ff]/55 backdrop-blur-md sm:block"
          style={{ left: glyph.x, top: glyph.y }}
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.72, 0.2] }}
          transition={{
            duration: 8 + index,
            repeat: Number.POSITIVE_INFINITY,
            delay: glyph.delay,
            ease: "easeInOut",
          }}
        >
          {glyph.label}
        </motion.div>
      ))}
    </div>
  );
}
