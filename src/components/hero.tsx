"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, FileText, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { handleSmartDownload } from "@/lib/downloadHelper";

export default function Hero() {
  const [showIndicator, setShowIndicator] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setShowIndicator(window.scrollY <= 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full min-h-svh flex flex-col overflow-y-auto pt-24 md:pt-28 pb-16 transition-all">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-image-penxchain.png"
          alt="Penxchain Background"
          fill
          priority
          className="object-cover opacity-80"
          quality={100}
        />
        <div className="absolute inset-0 bg-linear-to-b from-penx-bg/80 via-transparent to-penx-bg/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center my-auto">
        <h1 className="font-space text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 drop-shadow-2xl">
          Privacy for the Next <br />
          <span className="font-jakarta text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
            Generation of Web3.
          </span>
        </h1>

        <p className="font-jakarta text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          A zero-knowledge powered blockchain ecosystem designed for secure
          transactions, scalable applications, and real-world utility.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
          {/* CLEAN BUTTON using the helper */}
          <button
            onClick={() => handleSmartDownload(router)}
            className="group flex items-center justify-center gap-2 bg-[#2547D0] hover:bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-semibold transition-all w-full sm:w-auto shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer"
          >
            <ArrowDownToLine
              size={20}
              className="group-hover:translate-y-0.5 transition-transform"
            />
            Download Wallet
          </button>

          <Link
            href="/docs"
            className="group flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all w-full sm:w-auto backdrop-blur-sm active:scale-95"
          >
            <FileText size={20} />
            Explore Documentation
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 transition-all duration-500 ${
          showIndicator
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        <span className="text-xs tracking-wide">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}
