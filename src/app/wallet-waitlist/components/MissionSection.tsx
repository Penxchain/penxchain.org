import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MissionSection = () => {
  const [isVerified, setIsVerified] = useState(false);

  const handleCoreClick = () => {
    setIsVerified(true);
    setTimeout(() => setIsVerified(false), 2000); // Reset after 2s
  };

  return (
    <section className="py-40 px-6 md:px-24 border-b border-white/5 bg-[#030303] overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
        
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#2547D0] uppercase font-bold">01 / The Architecture</span>
            <div className="h-[1px] w-12 bg-white/10" />
            <span className="font-mono text-[10px] text-gray-600 uppercase italic">
              {isVerified ? "Status: Verified" : "Status: Encrypted"}
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white leading-[0.9]">
            Data belongs <br />
            <span className="text-[#2547D0] italic">in the Dark.</span>
          </h2>

          <div className="space-y-8 text-lg text-gray-400 font-light leading-relaxed">
            <p>
              In a world of transparent ledgers, your financial history is public property. 
              <span className="text-white font-medium"> Penxchain changes the rules.</span>
            </p>
            <p className="text-base border-l border-[#2547D0]/30 pl-6 py-2">
              Utilizing a wrapped private version of PENX on the Aleo network, we enable a truly decentralized economy 
              where transaction details are cryptographically obscured, yet mathematically verifiable.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-12 border-t border-white/5 pt-10">
             <div>
                <div className="text-2xl font-light text-white mb-2 tracking-tight italic">ZK-SNARKs</div>
                <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Privacy Proofs</div>
             </div>
             <div>
                <div className="text-2xl font-light text-white mb-2 tracking-tight italic">Hybrid-Core</div>
                <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Model Arch</div>
             </div>
          </div>
        </motion.div>

        {/* Right Side: The Cryptographic Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[500px] bg-[#080808] rounded-[40px] border border-white/10 flex items-center justify-center overflow-hidden group shadow-2xl cursor-pointer"
          onClick={handleCoreClick}
        >
          {/* Subtle Inner Glow - Intensifies on Hover */}
          <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_0_80px_rgba(37,71,208,0.05)] transition-opacity duration-500 group-hover:opacity-100" />
          
          {/* ZK-Lattice Background */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700" 
               style={{ backgroundImage: `radial-gradient(#2547D0 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />

          {/* The "Cryptographic Core" Interaction Wrapper */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-20 flex items-center justify-center"
          >
            {/* Spinning Geometric Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  rotate: 360,
                  borderColor: isVerified ? "rgba(37, 71, 208, 0.4)" : "rgba(255, 255, 255, 0.05)"
                }}
                transition={{ 
                  rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                  borderColor: { duration: 0.3 }
                }}
                className="absolute border rounded-xl transition-all duration-500"
                style={{
                  width: `${180 + i * 60}px`,
                  height: `${180 + i * 60}px`,
                  borderRadius: '38%',
                }}
              />
            ))}

            {/* Click Ripple Effect */}
            <AnimatePresence>
              {isVerified && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-32 h-32 border-2 border-[#2547D0] rounded-full z-10"
                />
              )}
            </AnimatePresence>

            {/* The Floating Proof Node */}
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                boxShadow: isVerified ? "0 0 50px rgba(37, 71, 208, 0.4)" : "0 0 20px rgba(37, 71, 208, 0.1)"
              }}
              transition={{ 
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-36 h-36 bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] flex flex-col items-center justify-center relative overflow-hidden group-hover:border-[#2547D0]/50 transition-colors duration-500"
            >
                {/* Internal Diamond */}
                <div className={`w-10 h-10 border border-[#2547D0] rotate-45 transition-all duration-500 ${isVerified ? 'bg-[#2547D0] scale-110 shadow-[0_0_20px_#2547D0]' : 'animate-pulse'}`} />
                
                {/* Dynamic Data Labels */}
                <div className="absolute top-3 left-0 w-full text-center font-mono text-[7px] text-[#2547D0]/60 tracking-widest uppercase">
                  {isVerified ? "Sequence.Auth" : "Locked.Core"}
                </div>
                
                <div className="mt-4 font-mono text-[8px] text-gray-500">
                  {isVerified ? "PROOF_VALID" : "0x74...E92"}
                </div>
            </motion.div>
          </motion.div>

          {/* Falling Data Streams */}
          <div className="absolute inset-0 flex justify-around opacity-[0.03] group-hover:opacity-10 transition-opacity">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [-100, 600] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#2547D0] to-transparent"
              />
            ))}
          </div>

          {/* Corner Metadata Details */}
          <div className="absolute top-10 left-10 font-mono text-[9px] text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${isVerified ? 'bg-green-500' : 'bg-[#2547D0]'}`} />
              <span>NODE_ID: P-442</span>
            </div>
            <div className="opacity-50 text-[8px]">LATENCY: 12MS</div>
          </div>

          <div className="absolute bottom-10 right-10 font-mono text-[9px] text-gray-600 text-right">
             <span className="block opacity-40">Penxchain V.1.0.0</span>
             <span className="block text-[#2547D0]">SECURE_TUNNEL: ACTIVE</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default MissionSection;