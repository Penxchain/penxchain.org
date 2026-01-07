"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  q: string;
  a: string;
}

const faqData: FaqItem[] = [
  {
    q: "Is PENXCHAIN legit?",
    a: "Yes. PENXCHAIN is built as a transparent, privacy-first blockchain ecosystem focused on user ownership and decentralization.",
  },
  {
    q: "What makes PENXCHAIN different?",
    a: "Unlike most transparent blockchains, PENXCHAIN prioritizes privacy while maintaining usability and security.",
  },
  {
    q: "Is PENXCHAIN a blockchain or a wallet?",
    a: "PENXCHAIN is a complete blockchain ecosystem that includes a privacy-focused wallet, payments infrastructure, and a decentralized marketplace.",
  },
];

export default function FaqAccordion() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="faq-container">
      {faqData.map((item, i) => (
        <div
          key={i}
          className="faq-item"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            marginBottom: "0.5rem",
          }}
        >
          <button
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              padding: "1rem 0",
              color: "white",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            <span>{item.q}</span>
            <motion.span
              animate={{ rotate: activeIdx === i ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ↓
            </motion.span>
          </button>

          <AnimatePresence>
            {activeIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                style={{ overflow: "hidden" }}
              >
                <p
                  style={{
                    paddingBottom: "1rem",
                    color: "rgba(255,255,255,0.7)",
                    margin: 0,
                  }}
                >
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
