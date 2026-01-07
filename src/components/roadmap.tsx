"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const roadmapItems = [
  {
    quarter: "Quarter 1",
    number: "1",
    items: [
      "Foundation and Core Functionality",
      "Wallet MVP and Bridge Integration",
      "Private Marketplace Development",
    ],
    colSpan: "md:col-span-5",
    gradient: "from-[#1e1b4b]/40 to-[#0A0D1F]",
  },
  {
    quarter: "Quarter 2",
    number: "2",
    items: [
      "Marketplace Launch and PENXPAY Development",
      "Private Marketplace Release on Aleo",
      "PENXPAY Development",
    ],
    colSpan: "md:col-span-7",
    gradient: "from-[#312e81]/40 to-[#0A0D1F]",
  },
  {
    quarter: "Quarter 3",
    number: "3",
    items: [
      "PENXPAY Launch and Governance Activation",
      "Governance Activation",
      "PENXPAY Iteration and Governance Refinement",
    ],
    colSpan: "md:col-span-7",
    gradient: "from-[#1e3a8a]/40 to-[#0A0D1F]",
  },
  {
    quarter: "Quarter 4",
    number: "4",
    items: [
      "Merchant Onboarding",
      "Ecosystem Expansion",
      "Community Growth and Roadmap Review",
    ],
    colSpan: "md:col-span-5",
    gradient: "from-[#4c1d95]/40 to-[#0A0D1F]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: "blur(20px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export default function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative w-full py-24 bg-penx-bg overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <h2 className="font-space font-bold text-3xl md:text-5xl text-white mb-6 tracking-tight">
            Road<span className="text-white">Map</span>
          </h2>
          <p className="font-jakarta text-gray-400 text-lg md:text-xl leading-relaxed">
            A clear development path outlining PENXCHAIN’s progress.
          </p>
        </motion.div>

        {/* Assymetrical Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
        >
          {roadmapItems.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className={`relative overflow-hidden rounded-4xl border border-[#3C3970]/50 bg-[#0A0D1F]/60 backdrop-blur-md p-8 md:p-10 min-h-80 flex flex-col justify-between group ${item.colSpan}`}
            >
              {/* Watermark Number */}
              <div className="absolute -right-8 -bottom-20 font-space font-bold text-[240px] md:text-[280px] leading-none text-[#3C3970] select-none pointer-events-none group-hover:text-[#3C3970]/20 group-hover:-translate-x-4 transition-all duration-700 ease-out">
                {item.number}
              </div>

              <div
                className={`absolute inset-0 bg-linear-to-br ${item.gradient} opacity-50 z-0`}
              />

              <div className="relative z-10">
                <div className="mb-6">
                  <span className="inline-block bg-[#3C3970]/30 border border-[#3C3970] text-blue-100 px-5 py-2 rounded-lg text-sm font-bold tracking-wider uppercase backdrop-blur-sm shadow-[0_0_15px_rgba(60,57,112,0.2)]">
                    {item.quarter}
                  </span>
                </div>

                {/* Checklist Items */}
                <div className="flex flex-col gap-4">
                  {item.items.map((text, i) => (
                    <div key={i} className="flex items-start gap-3 group/item">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 group-hover/item:text-blue-300 transition-colors" />
                      <span className="font-jakarta text-gray-300 text-base md:text-lg leading-snug group-hover/item:text-white transition-colors">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
