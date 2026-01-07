"use client";

import Image from "next/image";
import { ShieldCheck, Hexagon, Store, Zap } from "lucide-react";
import SpotlightCard from "@/components/ui/spotlight-card";
import { motion } from "framer-motion";

const features = [
  {
    title: "ZK-Privacy Engine",
    description:
      "Private-by-default transactions powered by advanced zero-knowledge proofs.",
    icon: ShieldCheck,
    imageSrc: "/feature-zk.png",
    className: "md:col-span-7",
    imgPosition: "object-left",
  },
  {
    title: "DeFi + Utility Ecosystem",
    description: "Swap, stake, pay, and build on a secure economic layer.",
    icon: Hexagon,
    imageSrc: "/feature-defi.png",
    className: "md:col-span-5",
    imgPosition: "object-center",
  },
  {
    title: "Built for Real Commerce",
    description: "Seamless integration for payments and digital marketplaces.",
    icon: Store,
    imageSrc: "/feature-commerce.png",
    className: "md:col-span-5",
    imgPosition: "object-center",
  },
  {
    title: "Lightning-Fast Layer 1",
    description:
      "Low fees, high throughput, and EVM-compatible smart contracts.",
    icon: Zap,
    imageSrc: "/feature-l1.png",
    className: "md:col-span-7",
    imgPosition: "object-center",
  },
];

// --- THE MINTY FRESH ANIMATION ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: "blur(15px)", // Blur is kept exactly as requested
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.0,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export default function Features() {
  return (
    <section className="relative w-full py-32 bg-penx-bg overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-900/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          // FIX 1: Increased margin offset to trigger earlier on scroll
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <h2 className="font-space font-bold text-4xl md:text-5xl text-white mb-6 tracking-tight drop-shadow-lg">
            What Makes{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-700">
              PENXCHAIN
            </span>{" "}
            Different
          </h2>
          <p className="font-jakarta text-gray-400 text-lg md:text-xl leading-relaxed">
            A blazing-fast privacy chain engineered to secure your transactions.
          </p>
        </motion.div>

        {/* THE ANIMATED GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          // FIX 2: Relaxed viewport requirements.
          // 'amount: 0.1' ensures it triggers even if only 10% is visible (good for small screens)
          // 'margin' ensures it triggers slightly before the very bottom
          viewport={{ once: true, amount: 0.1, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              // FIX 3: Changed h-[500px] to min-h-[450px] md:h-[500px].
              // This makes it responsive. It won't overflow small screens, but keeps the look on desktop.
              // 'will-change-transform' optimizes the blur rendering performance.
              className={`flex min-h-112.5 md:h-125 ${feature.className} will-change-transform`}
            >
              <SpotlightCard className="w-full h-full flex flex-col justify-between group">
                {/* Top: Text Content */}
                <div className="p-8 md:p-10 z-20 relative transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="font-space font-bold text-2xl md:text-3xl text-white tracking-tight">
                      {feature.title}
                    </h3>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-blue-400 shadow-inner group-hover:bg-blue-500/20 transition-colors">
                      <feature.icon size={28} />
                    </div>
                  </div>
                  <p className="font-jakarta text-gray-400 text-lg leading-relaxed max-w-md">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom: Image Stage */}
                <div className="relative w-full h-60 md:h-70 mt-auto overflow-hidden rounded-b-3xl">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-[#0D0B24] via-transparent to-transparent opacity-90" />

                  <Image
                    src={feature.imageSrc}
                    alt={feature.title}
                    fill
                    quality={100}
                    className={`object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${feature.imgPosition}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
