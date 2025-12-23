"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedProducts() {
  const [isExploding, setIsExploding] = useState<boolean>(false);

  const handleImageClick = (): void => {
    setIsExploding(true);
    // Reset after animation completes
    setTimeout(() => setIsExploding(false), 1000);
  };

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".penx-card");

    function revealCards(): void {
      cards.forEach((card) => {
        if (card.getBoundingClientRect().top < window.innerHeight - 100) {
          card.classList.add("visible");
        }
      });
    }

    window.addEventListener("scroll", revealCards);
    revealCards();

    return () => window.removeEventListener("scroll", revealCards);
  }, []);

  return (
    <section className="penx-featured">
      <h2 className="penx-title">Featured Products</h2>

      <div className="penx-container">
        <div className="penx-image-box">
          <div className="glow-ring"></div>

          {/* Shockwave Rings */}
          <AnimatePresence>
            {isExploding && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="shockwave-ring"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 3.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                  className="shockwave-ring blue"
                />
              </>
            )}
          </AnimatePresence>

          <motion.div
            whileTap={{ scale: 0.9, rotate: -2 }}
            onClick={handleImageClick}
            className="image-wrapper"
            style={{ cursor: "pointer", zIndex: 10 }}
          >
            <Image
              src="/img/featured.png"
              alt="PENXCHAIN"
              className="penx-img"
              width={550}
              height={550}
              onContextMenu={(e: React.MouseEvent<HTMLImageElement>) =>
                e.preventDefault()
              }
            />
          </motion.div>
        </div>

        <div className="penx-content">
          <div className="penx-card">
            <div className="icon-circle">
              <i className="fas fa-wallet"></i>
            </div>
            <h3>PENXCHAIN DeFi Wallet</h3>
            <p>
              A <strong style={{ color: "#0ce50c" }}>non-custodial</strong>,
              privacy-preserving decentralized wallet designed to give users
              full control of their digital assets.
            </p>
          </div>

          <div className="penx-card">
            <div className="icon-circle">
              <i className="fas fa-store"></i>
            </div>
            <h3>E-commerce Marketplace</h3>
            <p>
              A <strong style={{ color: "#0ce50c" }}>decentralized</strong>,
              secure marketplace where merchants can trade using crypto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
