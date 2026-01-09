"use client";

import { useState } from "react"; // 1. Import useState
import Image from "next/image";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Emmanuel Brighton",
    role: "Founder & Product Visionary",
    image: "/team-brighton.png",
  },
  {
    name: "Nastasha Firdaus Khan",
    role: "Head of Ecosystem Growth and Partnerships",
    image: "/team-natasha.png",
  },
  {
    name: "Emmanuel Oluwafemi Joseph",
    role: "Co-founder and CTO",
    image: "/team-joseph.png",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: -80,
    scale: 0.9,
    filter: "blur(20px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.0,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export default function Team() {
  // 2. State for click interaction
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMemberClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-24 bg-penx-bg overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <h2 className="font-space font-bold text-3xl md:text-5xl text-white mb-6 tracking-tight">
            Meet The <span className="text-white">Team</span>
          </h2>
          <p className="font-jakarta text-gray-400 text-lg md:text-xl leading-relaxed">
            Meet the people behind PENXCHAIN — a team committed to transparency,
            innovation, and building secure decentralized infrastructure.
          </p>
        </motion.div>

        {/* TEAM GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          // 3. FIX: Changed lg:grid-cols-4 to lg:grid-cols-3 to center the 3 members perfectly
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {teamMembers.map((member, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                onClick={() => handleMemberClick(index)} // 4. Add click handler
                className="group flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div
                  className={`relative w-full aspect-4/5 rounded-4xl border-2 overflow-hidden bg-blue-900/10 mb-6 transition-all duration-500 ${
                    isActive
                      ? "shadow-[0_0_40px_rgba(37,71,208,0.5)] border-blue-300" // Active styles
                      : "border-[#2547D0] group-hover:shadow-[0_0_40px_rgba(37,71,208,0.5)] group-hover:border-blue-300" // Hover styles
                  }`}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className={`object-cover transition-transform duration-1000 ease-out ${
                      isActive ? "scale-105" : "group-hover:scale-105"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-t from-[#0A0D1F]/80 via-transparent to-transparent transition-opacity duration-500 ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>

                {/* TEXT CONTENT */}
                <div className="text-left px-2">
                  <h3
                    className={`font-space font-bold text-xl md:text-2xl mb-2 leading-tight transition-colors duration-300 ${
                      isActive
                        ? "text-blue-400"
                        : "text-white group-hover:text-blue-400"
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p
                    className={`font-jakarta text-sm md:text-base leading-relaxed font-medium transition-colors ${
                      isActive
                        ? "text-gray-200"
                        : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  >
                    {member.role}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}