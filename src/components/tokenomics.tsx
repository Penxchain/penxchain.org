"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

// DATA SOURCE
const tokenData = [
  { value: "05%", label: "Staking Rewards", color: "#2563eb" },
  { value: "10%", label: "Liquidity", color: "#eab308" },
  { value: "10%", label: "Public IDO", color: "#0891b2" },
  { value: "15%", label: "Public IEO", color: "#ea580c" },
  { value: "15%", label: "Team & Advisors", color: "#0f172a" },
  { value: "20%", label: "Ecosystem Incentives", color: "#16a34a" },
  { value: "25%", label: "Treasury / DAO", color: "#4f46e5" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function Tokenomics() {
  const chartControls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = async () => {
    if (isSpinning) return; // Prevent double clicks
    setIsSpinning(true);

    await chartControls.start({
      rotate: 360 * 2,
      transition: {
        duration: 3, 
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    });

    chartControls.set({ rotate: 0 });
    setIsSpinning(false);
  };

  return (
    <section
      id="tokenomics"
      className="relative w-full py-24 bg-[#05091D] overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 md:mb-32 max-w-3xl mx-auto"
        >
          <h2 className="font-space font-bold text-3xl md:text-5xl text-white mb-6 tracking-tight">
            Tokenomics
          </h2>
          <p className="font-jakarta text-gray-400 text-lg md:text-xl leading-relaxed">
            The economic foundation powering transactions, incentives,
            governance, and value creation.
          </p>
        </motion.div>

        {/* MAIN CONTENT WRAPPER */}
        <div className="flex flex-col md:flex-row items-center justify-center relative">
          {/* THE CHART (Left/Top) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 w-70 h-70 md:w-112.5 md:h-112.5 -mb-16 md:mb-0 md:-mr-24 shrink-0 cursor-pointer"
            onClick={handleSpin}
          >
            {/* The Rotating Container */}
            <motion.div
              animate={chartControls}
              // Default "Levitation" when NOT spinning
              style={!isSpinning ? { y: 0 } : undefined}
              whileHover={!isSpinning ? { scale: 1.05 } : undefined}
              className="w-full h-full relative"
            >
              <Image
                src="/tokenomicschart.png"
                alt="Penxchain Token Distribution"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                priority
              />
            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] pointer-events-none">
              <Image
                src="/penx-icon.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* STATS CARD (Right/Bottom) */}
          <motion.div
            initial={{ opacity: 0, x: 50, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 w-full md:w-auto bg-[#13162D]/90 backdrop-blur-xl border border-[#3C3970] rounded-4xl p-8 pt-20 md:p-12 md:pl-32 shadow-2xl"
          >
            {/* The List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-5 min-w-62.5 md:min-w-87.5"
            >
              {tokenData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-4 group cursor-default"
                >
                  <div
                    className="w-1.5 h-8 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-space font-bold text-gray-300 text-lg md:text-xl group-hover:text-white transition-colors">
                      {item.value}
                    </span>
                    <span className="font-jakarta text-gray-500 text-base md:text-lg group-hover:text-gray-300 transition-colors">
                      - {item.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mesh Gradient */}
            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-blue-900/10 to-transparent rounded-4xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
