"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function WalletOverview() {
  useEffect(() => {
    const slider = document.getElementById("wallet-slider");
    const dots = document.querySelectorAll<HTMLElement>(
      ".wallet-dot-indicators .dot"
    );

    if (!slider) return;

    const handleScroll = (): void => {
      const scrollLeft = slider.scrollLeft;
      const totalScroll = slider.scrollWidth - slider.clientWidth;
      const sectionCount = dots.length;
      const percent = scrollLeft / totalScroll;
      const activeIndex = Math.round(percent * (sectionCount - 1));

      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === activeIndex);
      });
    };

    slider.addEventListener("scroll", handleScroll);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const imgElement = slider.querySelector("img");
        if (imgElement) {
          const width = imgElement.clientWidth + 16;
          slider.scrollTo({ left: width * index, behavior: "smooth" });
        }
      });
    });

    return () => {
      slider.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="wallet-overview">
      <h2>PENXCHAIN Wallet Overview</h2>

      <div className="wallet-slider" id="wallet-slider">
        {[1, 2, 3, 4, 5].map((num) => (
          <Image
            key={num}
            src={`/img/wallet${num}.png`}
            alt={`Wallet View ${num}`}
            width={220}
            height={400}
          />
        ))}
      </div>

      <div className="wallet-dot-indicators">
        {[1, 2, 3, 4, 5].map((num) => (
          <span key={num} className={`dot ${num === 1 ? "active" : ""}`}></span>
        ))}
      </div>
    </section>
  );
}
