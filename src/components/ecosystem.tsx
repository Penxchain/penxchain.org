"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { handleSmartDownload } from "@/lib/downloadHelper";

// DATA
const showcaseItems = [
  {
    id: "wallet",
    title: "PENXCHAIN WALLET",
    subtitle: "Your Gateway to Private Web3",
    description:
      "A non-custodial wallet built for secure storage, private transactions, and seamless interaction with the PENXCHAIN ecosystem.",
    buttonText: "Download Wallet",
    icon: ArrowDownToLine,
    images: ["/wallet-1.png", "/wallet-2.png", "/wallet-3.png"],
    bgColor: "bg-[#13142e]",
    glow: "bg-blue-500/40",
    actionType: "download",
  },
  {
    id: "marketplace",
    title: "PENXCHAIN MARKETPLACE",
    subtitle: "Decentralized Commerce, Reimagined",
    description:
      "A privacy-first marketplace enabling secure peer-to-peer transactions, digital goods, and real-world commerce powered by PENXCHAIN.",
    buttonText: "Download Marketplace",
    icon: ShoppingBag,
    images: ["/market-1.png", "/market-2.png", "/market-3.png"],
    bgColor: "bg-[#05050A]",
    glow: "bg-indigo-500/30",
    actionType: "internal",
    url: "/marketplace/coming-soon",
  },
];

// ANIMATION VARIANTS
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const blurUpVariant = {
  hidden: { opacity: 0, y: 60, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// --- COMPONENT: FRAMELESS INTERACTIVE DECK ---
function InteractiveDeck({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className="relative w-full h-112.5 sm:h-137.5 flex items-center justify-center perspective-1000">
      <div className="relative w-[320px] sm:w-105 h-full flex items-center">
        {images.map((src, index) => {
          const isActive = activeIndex === index;
          const leftPositions = ["0%", "25%", "50%"];

          return (
            <motion.div
              key={index}
              onHoverStart={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              animate={{
                zIndex: isActive ? 100 : index * 10,
                scale: isActive ? 1.05 : 0.95,
                filter: isActive
                  ? "brightness(1.05) contrast(1) blur(0px)"
                  : "brightness(0.6) contrast(0.9) blur(2px)",
                y: isActive ? -15 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 25,
              }}
              className="absolute top-1/2 -translate-y-1/2 w-50 sm:w-62.5 cursor-pointer origin-center"
              style={{ left: leftPositions[index] }}
            >
              <motion.div
                animate={{
                  boxShadow: isActive
                    ? "0 25px 50px -12px rgba(0,0,0,0.7)"
                    : "0 10px 30px -10px rgba(0,0,0,0.5)",
                }}
                className="relative aspect-9/19 rounded-3xl overflow-hidden bg-black/20 transition-shadow"
              >
                <Image
                  src={src}
                  alt={`Screen ${index}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, 25vw"
                  priority={index === 1}
                />
                <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/30 pointer-events-none mix-blend-overlay" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// MAIN COMPONENT
export default function Ecosystem() {
  const router = useRouter(); // <--- 2. INITIALIZE ROUTER

  return (
    <div className="w-full text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')] bg-repeat z-50"></div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="pt-32 pb-16 text-center px-6 relative z-10"
      >
        <motion.h2
          variants={blurUpVariant}
          className="font-space font-bold text-4xl md:text-6xl mb-6 tracking-tight"
        >
          Ecosystem Showcase
        </motion.h2>
        <motion.p
          variants={blurUpVariant}
          className="font-jakarta text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
        >
          A growing suite of products built on PENXCHAIN, designed to deliver
          secure, private, and real-world decentralized experiences.
        </motion.p>
      </motion.div>

      {showcaseItems.map((item, index) => {
        const isReversed = index % 2 !== 0;

        return (
          <section
            key={item.id}
            className={`relative w-full py-24 md:py-32 px-6 md:px-12 ${item.bgColor}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className={`absolute top-1/2 ${
                isReversed ? "left-[-20%]" : "right-[-20%]"
              } -translate-y-1/2 w-150 h-150 md:w-200 md:h-200 ${
                item.glow
              } blur-[180px] rounded-full pointer-events-none`}
            />

            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-16 lg:gap-24`}
              >
                {/* TEXT CONTENT */}
                <motion.div
                  variants={blurUpVariant}
                  className="w-full lg:w-1/2 text-center lg:text-left"
                >
                  <h3 className="font-jakarta font-bold text-3xl  text-blue-400 uppercase mb-6 opacity-80">
                    {item.title}
                  </h3>

                  <h4 className="font-space font-bold sm:text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-[1.1]">
                    {item.subtitle}
                  </h4>

                  <p className="font-jakarta text-gray-300 text-lg leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0">
                    {item.description}
                  </p>

                  <button
                    onClick={() => {
                      if (item.actionType === "download") {
                        handleSmartDownload(router);
                      } else if (item.actionType === "internal" && item.url) {
                        router.push(item.url);
                      }
                    }}
                    className="group relative inline-flex items-center gap-3 bg-[#2547D0] hover:bg-[#1d38a8] text-white px-10 py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_-10px_rgba(37,71,208,0.6)] hover:-translate-y-1"
                  >
                    <item.icon
                      size={20}
                      className="transition-transform group-hover:scale-110"
                    />
                    {item.buttonText}
                  </button>
                </motion.div>

                {/* IMAGE CONTENT */}
                <motion.div
                  variants={blurUpVariant}
                  className="w-full lg:w-1/2 flex justify-center"
                >
                  <InteractiveDeck images={item.images} />
                </motion.div>
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
