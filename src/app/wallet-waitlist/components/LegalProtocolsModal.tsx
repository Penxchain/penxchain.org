"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Scale, Globe } from 'lucide-react';

interface LegalProtocolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

type Tab = 'terms' | 'privacy';

const LegalProtocolsModal: React.FC<LegalProtocolsModalProps> = ({ isOpen, onClose, onAccept }) => {
  const [activeTab, setActiveTab] = useState<Tab>('terms');
  const [scrolledTabs, setScrolledTabs] = useState<{ terms: boolean; privacy: boolean }>({
    terms: false,
    privacy: false,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check scroll position
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    // Buffer of 20px to account for rounding/browser differences
    const isBottom = scrollTop + clientHeight >= scrollHeight - 20;

    if (isBottom && !scrolledTabs[activeTab]) {
      setScrolledTabs((prev) => ({ ...prev, [activeTab]: true }));
    }
  };

  // Reset scroll and check height on tab change
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: 0, behavior: 'auto' });
      // If content fits without scrolling, mark as read immediately
      if (el.scrollHeight <= el.clientHeight) {
        setScrolledTabs((prev) => ({ ...prev, [activeTab]: true }));
      }
    }
  }, [activeTab]);

  // Scroll Lock matching Admin Page implementation
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll and prevent layout shift
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      // Focus the modal for keyboard navigation
      modalRef.current?.focus();

      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollAmount = 50; // pixels to scroll
      const pageScrollAmount = container.clientHeight * 0.8; // 80% of visible height

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        
        case 'ArrowDown':
          e.preventDefault();
          container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          container.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
          break;
        
        case 'PageDown':
          e.preventDefault();
          container.scrollBy({ top: pageScrollAmount, behavior: 'smooth' });
          break;
        
        case 'PageUp':
          e.preventDefault();
          container.scrollBy({ top: -pageScrollAmount, behavior: 'smooth' });
          break;
        
        case 'Home':
          e.preventDefault();
          container.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        
        case 'End':
          e.preventDefault();
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          break;
        
        case 'Tab':
          // Allow tab navigation between tabs
          if (e.shiftKey) {
            // Shift+Tab logic handled by browser
          } else {
            // Tab logic handled by browser
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overscroll-none"
            onWheel={(e) => e.stopPropagation()}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] md:bottom-auto md:top-[10%] md:inset-x-auto md:w-full md:max-w-3xl h-[90vh] md:h-[80vh] z-[101] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden self-center justify-self-center mx-auto outline-none overscroll-contain"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2547D0]/20 flex items-center justify-center border border-[#2547D0]/30 shadow-[0_0_20px_rgba(37,71,208,0.2)]">
                  <Shield className="w-5 h-5 text-[#2547D0]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white uppercase">Legal Protocol</h2>
                  <p className="text-[10px] font-mono text-gray-500 tracking-[0.2em]">S/D: V1.0.26_STABLE</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 pt-6 gap-6 border-b border-white/5 bg-white/[0.01]">
              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-4 text-xs font-mono uppercase tracking-widest transition-all relative ${
                  activeTab === 'terms' ? 'text-[#2547D0]' : 'text-gray-500 hover:text-gray-300'
                }`}
                aria-label="Terms of Service"
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-3 h-3" />
                  Terms of Service
                </div>
                {activeTab === 'terms' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2547D0]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-4 text-xs font-mono uppercase tracking-widest transition-all relative ${
                  activeTab === 'privacy' ? 'text-[#2547D0]' : 'text-gray-500 hover:text-gray-300'
                }`}
                aria-label="Privacy Policy"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Privacy Policy
                </div>
                {activeTab === 'privacy' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2547D0]" />
                )}
              </button>
            </div>

            {/* Content Area with Custom Scrollbar */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar overscroll-contain outline-none touch-pan-y"
              tabIndex={0}
              onWheel={(e) => e.stopPropagation()}
              onScroll={handleScroll}
            >
              {activeTab === 'terms' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2547D0] rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">1. Protocol Engagement</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed pl-5 border-l border-white/5">
                      By initializing your identity on the Penxchain Network, you are entering a pre-alpha waitlist environment. 
                      This environment serves as a technical demonstration of the Penxchain privacy stack and is subject to updates, resets, and modifications without prior notice.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2547D0] rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">2. $PENX Points (PXP) & Streaks</h3>
                    </div>
                    <div className="space-y-3 pl-5 border-l border-white/5">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        • $PENX Points (PXP) are non-monetary digital markers used to track community engagement and platform activity.
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        • $PENX Points (PXP) do not represent equity, debt, or any financial claim on Penxchain or its affiliates.
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        • We reserve the unilateral right to reset $PENX Points (PXP) balances during protocol upgrades, migration phases, or if exploitation is detected.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2547D0] rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">3. Eligibility</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed pl-5 border-l border-white/5">
                      You must be 18 years or older (or the age of majority in your jurisdiction) to participate. 
                      Access is restricted for residents of sanctioned territories or jurisdictions where blockchain participation is prohibited by law.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500/50 rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">4. Prohibited Activity</h3>
                    </div>
                    <div className="space-y-3 pl-5 border-l border-white/5">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        • Users may not engage in "sybil attacks" (creating multiple fake accounts) to farm rewards or manipulate the network graph.
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        • Any attempt to reverse-engineer, exploit, or disrupt the ZK-Proof architecture is strictly prohibited.
                      </p>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2547D0] rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">1. Data Sovereignty</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed pl-5 border-l border-white/5">
                      Penxchain is built on the principle of data minimization and maximum user control. 
                      We only collect technical data strictly necessary to maintain your waitlist position and secure the network.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2547D0] rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">2. Information We Collect</h3>
                    </div>
                    <div className="space-y-3 pl-5 border-l border-white/5">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        • <span className="text-white font-mono text-[11px]">Identity Hash:</span> Your email and username are encrypted and hashed for secure authentication.
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        • <span className="text-white font-mono text-[11px]">Network Graph:</span> Referral links are used to architect the community network and distribute engagement markers.
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        • <span className="text-white font-mono text-[11px]">Security Logs:</span> Basic device metadata is temporarily logged to prevent automated bot intrusions.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2547D0] rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">3. ZK-Proof Privacy</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed pl-5 border-l border-white/5">
                      Unlike traditional blockchains where balances are public, Penxchain utilizes Zero-Knowledge Proofs. 
                      Your actual transaction history, specific balances, and private communications remain encrypted and invisible to us.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#2547D0] rounded-full" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">4. Third-Party Services</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed pl-5 border-l border-white/5">
                      We integrate Google reCAPTCHA v3 as a security firewall. Their privacy policies apply to the behavioral data 
                      collected during the validation of your session authenticity.
                    </p>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02]">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Acknowledgement required for identity initialization</span>
              <button 
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                disabled={!scrolledTabs.terms || !scrolledTabs.privacy}
                className={`w-full md:w-auto px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all transform ${
                  scrolledTabs.terms && scrolledTabs.privacy
                    ? "bg-white text-black hover:bg-[#2547D0] hover:text-white active:scale-95 cursor-pointer"
                    : "bg-white/10 text-gray-500 cursor-not-allowed opacity-50"
                }`}
              >
                {scrolledTabs.terms && scrolledTabs.privacy ? "Accept Protocol" : "Read All to Accept"}
              </button>
            </div>
          </motion.div>

          {/* Custom Scrollbar Styles */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.02);
              border-radius: 10px;
              margin: 8px 0;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, #2547D0 0%, #1a35a0 100%);
              border-radius: 10px;
              border: 2px solid rgba(10, 10, 10, 1);
              transition: all 0.3s ease;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, #2e56e8 0%, #2547D0 100%);
              box-shadow: 0 0 10px rgba(37, 71, 208, 0.5);
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:active {
              background: linear-gradient(180deg, #1a35a0 0%, #152b80 100%);
            }

            /* Firefox */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #2547D0 rgba(255, 255, 255, 0.02);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default LegalProtocolsModal;