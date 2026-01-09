"use client";

import Image from "next/image";
import { Rocket, ShieldCheck, Lock, Code2 } from "lucide-react";
import { motion, easeOut } from "framer-motion";

// DATA
const features = [
  {
    title: "High-Speed Consensus",
    description:
      "Built on an optimized Layer-1 architecture that delivers fast finality, low fees, and reliable performance at scale.",
    icon: Rocket,
  },
  {
    title: "Secure & Compatible",
    description:
      "Deploy and run smart contracts in a secure, flexible environment designed for compatibility with existing Web3 tools.",
    icon: ShieldCheck,
  },
  {
    title: "Zero-Knowledge Protection",
    description:
      "Advanced zero-knowledge cryptography ensures transactions remain private, verifiable, and tamper-proof.",
    icon: Lock,
  },
  {
    title: "SDKs, APIs & Extensions",
    description:
      "A robust suite of developer tools, libraries, and extensions that simplify building and scaling dApps on PENXCHAIN.",
    icon: Code2,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

const iconVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delay: 0.2,
    },
  },
};


export default function HowItWorks() {
  return (
    <section className="relative w-full py-24 bg-penx-bg overflow-hidden">
      <div className="relative z-10 max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="font-space font-bold text-4xl md:text-5xl text-white mb-6">
            How{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-700">
              PENXCHAIN
            </span>{" "}
            Works
          </h2>
          <p className="font-jakarta text-slate-400 text-lg max-w-2xl mx-auto">
            A fast, safe, and private network.
          </p>
        </div>

        {/* MAIN */}
        <div className="flex flex-col md:flex-row rounded-[28px] bg-[#0f1021]/80 backdrop-blur-xl ring-1 ring-white/10 shadow-xl overflow-hidden">
          {/* IMAGE */}
          <div className="relative w-full md:w-[48%] h-90 md:h-auto">
            <Image
              src="/layers-diagram.png"
              alt="Penxchain Architecture"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* CONTENT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="w-full md:w-[52%] border-t md:border-l md:border-t-0 border-white/5"
          >
            {features.map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="relative p-6 md:p-6 2xl:p-7 border-b border-white/5 last:border-b-0 bg-white/1 hover:bg-white/3 transition-colors"
              >
                <motion.div
                  variants={iconVariants}
                  className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-[#131426] border border-white/10 flex items-center justify-center text-slate-400"
                  whileHover={{
                    rotate: 6,
                    scale: 1.08,
                  }}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                </motion.div>

                <h3 className="font-space font-bold text-lg md:text-xl text-slate-200 mb-2 pr-14">
                  {item.title}
                </h3>
                <p className="font-jakarta text-slate-400 text-sm md:text-[15px] leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
