"use client";

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
    name: "God’swill Akpan",
    role: "Founder & Product Visionary",
    image: "/team-godswill.png",
  },
  {
    name: "Emmanuel Oluwafemi Joseph",
    role: "Co-founder and CMO",
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
          viewport={{ once: true, margin: "-50px" }} // Triggers slightly before element hits screen center
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group flex flex-col"
            >
              <div className="relative w-full aspect-4/5 rounded-4xl border-2 border-[#2547D0] overflow-hidden bg-blue-900/10 mb-6 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(37,71,208,0.5)] group-hover:border-blue-300">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#0A0D1F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* TEXT CONTENT */}
              <div className="text-left px-2">
                <h3 className="font-space font-bold text-xl md:text-2xl text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="font-jakarta text-gray-400 text-sm md:text-base leading-relaxed font-medium group-hover:text-gray-200 transition-colors">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
