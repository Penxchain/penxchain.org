"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Shield, Fingerprint, Lock, Zap, MousePointer2, DollarSign } from 'lucide-react';
import { FaXTwitter, FaTelegram, FaDiscord, FaGithub, FaCoins, FaLinkedin } from 'react-icons/fa6';
import MissionSection from './components/MissionSection';
import FinalCTA from './components/FinalCTA';
import AnimatedBackground from './components/AnimatedBackground';

// --- VISUAL ASSETS & UTILS ---
const GlitchText = ({ text }: { text: string }) => (
  <span className="relative inline-block group hover:text-[#2547D0] transition-colors duration-300">
    <span className="relative z-10">{text}</span>
    <span className="absolute top-0 left-0 -z-10 w-full h-full bg-[#2547D0]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </span>
);

export default function PenxProtocolRedesign() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Smart Navbar Logic
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const currentScrollY = latest;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    });
  }, [scrollY]);

  const yShard = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateShard = useTransform(scrollYProgress, [0, 1], [0, 45]);

  // Update cursor spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax Values
  const yTitle = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen bg-[#020202] text-[#E0E0E0] overflow-x-hidden font-sans selection:bg-[#2547D0] selection:text-white"
    >
      
      {/* --- AMBIENT NOISE & SPOTLIGHT (The "Aleo" Feel) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        {/* The Follow Cursor Light */}
        <div 
          className="absolute w-[600px] h-[600px] bg-[#2547D0] rounded-full blur-[150px] opacity-10 transition-transform duration-100 ease-out will-change-transform mix-blend-screen"
          style={{ 
            left: cursorPosition.x - 300, 
            top: cursorPosition.y - 300 
          }}
        />
      </div>


      {/* --- HUD NAVIGATION (No traditional navbar) --- */}
      {/* --- HUD NAVIGATION (Responsive Single Container) --- */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isNavVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start p-6 md:p-8 pointer-events-none"
      >
        {/* Left Side: Status */}
        <div className="flex flex-col gap-1 pointer-events-auto mix-blend-difference">
          <span className="font-space text-2xl tracking-tighter flex items-center">$PENX</span>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-gray-400">
             <div className="w-1.5 h-1.5 bg-[#FDDA0D] animate-pulse rounded-full" />
             <span className="font-jakarta hidden xs:inline">TGE Phase: UPCOMING</span>
             <span className="font-jakarta xs:hidden">UPCOMING</span>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          <button className="hidden md:block font-mono text-xs hover:text-[#2547D0] transition-colors">
            [ WHITEPAPER_V1 ]
          </button>
          <button 
            onClick={() => router.push('/wallet-waitlist/login')}
            className="px-4 py-2 md:px-5 md:py-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-500 font-medium text-xs md:text-sm rounded-none backdrop-blur-md whitespace-nowrap"
          >
            ACCESS TERMINAL
          </button>
        </div>
      </motion.nav>

      {/* Bottom Left: Socials */}
      {/* Bottom Left: Socials (Desktop) / Bottom Center (Mobile) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 md:bottom-8 z-50 flex flex-row md:flex-col gap-6 md:gap-4 text-gray-500 bg-black/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none px-6 py-3 md:p-0 rounded-full md:rounded-none border border-white/10 md:border-none">
        <a href="https://x.com/penxchain_?s=21" className="hover:text-white transition-colors"><FaXTwitter /></a>
        <a href="https://t.me/Officialpenxchain" className="hover:text-white transition-colors"><FaTelegram /></a>
        <a href="https://www.linkedin.com/company/penxchain/" className="hover:text-white transition-colors"><FaLinkedin /></a>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-24 pt-28 pb-12">

        <AnimatedBackground />
        {/* Decorative Grid Lines */}
        <div className="absolute top-0 bottom-0 left-24 w-[1px] bg-white/5 hidden md:block" />
        <div className="absolute top-0 bottom-0 right-24 w-[1px] bg-white/5 hidden md:block" />

        <motion.div 
          style={{ y: yTitle, opacity: opacityFade }}
          className="relative z-10 max-w-7xl"
        >
          {/* Tagline */}
          <div className="flex items-center gap-3 mb-6 overflow-hidden">
             <span className="font-mono text-[#2547D0] text-sm tracking-widest">[ PRIVACY LAYER ]</span>
             <div className="h-[1px] w-20 bg-gradient-to-r from-[#2547D0] to-transparent" />
          </div>
          
          {/* Massive Typography */}
          <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-white mix-blend-overlay opacity-90">
            SILENCE <br />
            IS VALUE.
          </h1>
          
          <div className="mt-12 max-w-xl">
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed font-jakarta">
              Penxchain is the privacy-first ecosystem built for the next era of <span className="text-white">Aleo</span>. 
              Wrap assets. Transact in silence. Earn <span className="font-space text-[#2547D0]">PXP</span> before the public knows we exist.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="mt-16 flex items-center gap-8">
            <button 
              onClick={() => router.push('/wallet-waitlist/signup')}
              className="group relative px-6 py-2 bg-[#003D82] text-white font-bold tracking-tight overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 font-space">
                EARN PENX POINTS (PXP)<ArrowUpRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-500 ease-out mix-blend-difference" />
            </button>
            
            <div className=" md:flex flex-col">
              <span className="font-mono text-xs text-gray-500">WALLET RELEASE </span>
              <span className="font-mono text-sm text-white">Q1 2026 [PENDING...]</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
            style={{ y: yShard, rotate: rotateShard }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-15 md:opacity-30 md:left-auto md:right-24 md:translate-x-0 pointer-events-none"
          >
             <img 
               src="/penx-icon-nobg.png" 
               alt="Penxchain Logo" 
               className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(37,71,208,0.3)] grayscale hover:grayscale-0 transition-all duration-700" 
             />
          </motion.div>
      </section>

      {/* --- TICKER STRIP --- */}
      <div className="border-y border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden py-4">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex whitespace-nowrap gap-16 font-mono text-sm text-gray-500"
        >
          {[...Array(5)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> ZK-ROLLUP INTEGRATION</span>
              <span className="flex items-center gap-2"><FaCoins className="w-3 h-3" /> PXP EMISSION</span>
              <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> ALEO NETWORK BRIDGE</span>
              <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> PRIVATE DEFI LAYER</span>
              <span className="flex items-center gap-2 text-[#2547D0]"><Fingerprint className="w-3 h-3" /> TGE PREPARATION</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* --- THE MISSION (High-End Editorial Layout) --- */}
      <MissionSection />
      {/* --- THE REWARDS (Minimalist List) --- */}
      <section className="py-40 px-6 md:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24">
           <div className="max-w-xl">
            <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="font-mono text-[10px] tracking-[0.4em] text-[#2547D0] mb-4 block uppercase font-bold"
                      >
                        02 / Global Incentives
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-[ -0.04em] mb-8 leading-[0.85]">
            Waitlist <span className="text-gray-500 italic font-light font-serif">Mining.</span>
          </h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed">
                The network is currently in <span className="font-space text-[#2547D0]">Stealth Mode</span>. 
                <span className="text-white"> PXP</span> is your proof of early support. Points collected during the waitlist phase will be 
                <span className="text-white"> converted to $PENX tokens</span> at TGE. 
                The earlier you join, the higher your allocation multiplier.
              </p>
           </div>
           <div className="mt-8 md:mt-0 flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#2547D0]/10 border border-[#2547D0]/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-[#2547D0]" />
                <span className="font-mono text-[10px] text-[#2547D0]">SYSTEM LIVE</span>
              </div>
              <p className="text-xs text-gray-600 font-mono text-right">
                SNAPSHOT DATE: [REDACTED]
              </p>
           </div>
        </div>

        <div className="space-y-0">
           {[
             { title: "Connect", desc: "Link your Web3 Identity", status: "ONLINE" },
             { title: "Refer", desc: "Build your circle of trust", status: "BOOST ACTIVE" },
             { title: "Engage", desc: "Daily privacy tasks", status: "x1.5 MULTIPLIER" },
             { title: "Waitlist", desc: "Secure your wallet spot", status: "LIMITED SLOTS" }
           ].map((item, idx) => (
             <div 
               key={idx} 
               className="group relative border-t border-white/10 py-12 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-[#080808] transition-colors cursor-default"
             >
               <div className="flex items-baseline gap-8">
                 <span className="font-mono text-xs text-[#2547D0]">0{idx + 1}</span>
                 <h3 className="text-3xl md:text-5xl font-light text-gray-500 group-hover:text-white transition-colors duration-500">{item.title}</h3>
               </div>
               <div className="flex items-center gap-12 mt-4 md:mt-0">
                  <span className="text-gray-500 font-light group-hover:text-gray-300">{item.desc}</span>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#2547D0]/10 border border-[#2547D0]/20 rounded-full">
                     <div className="w-1.5 h-1.5 bg-[#2547D0]" />
                     <span className="font-mono text-[10px] text-[#2547D0]">{item.status}</span>
                  </div>
               </div>
             </div>
           ))}
           <div className="border-t border-white/10" />
        </div>
      </section>

      {/* --- FOOTER CTA (The "Void" footer) --- */}
      <FinalCTA />

      {/* --- MINIMAL FOOTER --- */}
      <footer className="py-8 px-6 md:px-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-600">
        <div>© 2026 PENXCHAIN</div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <span className="text-[#2547D0]">System: Operational</span>
        </div>
      </footer>
    </div>
  );
}