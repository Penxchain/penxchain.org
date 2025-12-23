"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function MarketplaceOverview() {
  useEffect(() => {
    const slider = document.getElementById("marketplace-slider");
    const dots = document.querySelectorAll<HTMLElement>(".dot-indicators .dot");

    if (!slider) return;

    const handleScroll = (): void => {
      const scrollLeft = slider.scrollLeft;
      const slideWidth = slider.scrollWidth / dots.length;
      const activeIndex = Math.round(scrollLeft / slideWidth);

      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === activeIndex);
      });
    };

    slider.addEventListener("scroll", handleScroll);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const imgElement = slider.querySelector("img");
        if (imgElement) {
          const width = imgElement.clientWidth + 24;
          slider.scrollTo({ left: width * index, behavior: "smooth" });
        }
      });
    });

    return () => {
      slider.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="marketplace-overview">
      <h2>PENXCHAIN Marketplace Overview</h2>

      <div className="marketplace-slider" id="marketplace-slider">
        {[1, 2, 3].map((num) => (
          <Image
            key={num}
            src={`/img/mp${num}.png`}
            alt={`Marketplace View ${num}`}
            width={300}
            height={600}
          />
        ))}
      </div>

      <div className="dot-indicators">
        {[1, 2, 3].map((num) => (
          <span key={num} className={`dot ${num === 1 ? "active" : ""}`}></span>
        ))}
      </div>
    </section>
  );
}
