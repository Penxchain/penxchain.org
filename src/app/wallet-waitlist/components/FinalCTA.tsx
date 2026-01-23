import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

const FinalCTA = () => {
  const router = useRouter();

  return (
    <section className="relative py-48 px-6 md:px-24 bg-[#020202] overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* --- BACKGROUND EFFECTS --- */}
      {/* The Void Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,71,208,0.08)_0%,transparent_70%)]" />
      
      {/* Animated Singularity Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
         {[...Array(3)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute inset-0 border border-[#2547D0]/5 rounded-full"
             animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
             transition={{ duration: 4, repeat: Infinity, delay: i * 1.5, ease: "easeOut" }}
           />
         ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* Editorial Index */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#2547D0]" />
          <span className="font-space text-xs tracking-[0.3em] text-[#2547D0] uppercase">03 / Initialization</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#2547D0]" />
        </motion.div>

        {/* Main Headline */}
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.85]"
        >
          Go <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#2547D0] to-blue-900">Dark.</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-500 font-jakarta font-light mb-16 max-w-2xl mx-auto leading-relaxed"
        >
          The public ledger sees everything. <br className="hidden md:block" />
          <span className="text-gray-300">Penxchain sees only you.</span> Secure your spot in the Genesis block.
        </motion.p>

        {/* Premium Button */}
        <motion.button 
          onClick={() => router.push('/wallet-waitlist/signup')}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black overflow-hidden hover:bg-[#2547D0] hover:text-white transition-colors duration-500"
        >
           <span className="relative z-10 font-space text-sm tracking-[0.2em] font-bold uppercase">Initialize Sequence</span>
           <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
           
           {/* Button Hover Shine */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </motion.button>

        {/* Meta Data Footer */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ duration: 1, delay: 1 }}
           className="mt-24 grid grid-cols-3 gap-8 text-[9px] font-mono text-gray-600 uppercase tracking-widest border-t border-white/5 pt-8"
        >
           <div className="text-left">Status: Pre-TGE</div>
           <div className="text-center text-[#2547D0]">Slots Remaining: Limited</div>
           <div className="text-right">Latency: 12ms</div>
        </motion.div>

      </div>
    </section>
  );
};

export default FinalCTA;