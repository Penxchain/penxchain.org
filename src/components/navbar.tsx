"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleSmartDownload } from "@/lib/downloadHelper";
import {
  Menu,
  X,
  ArrowDownToLine,
  FileText,
  DollarSign,
  Map,
  Clock,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Documentation", href: "/docs", icon: FileText },
  { label: "Roadmap", href: "/#roadmap", icon: Map },
  { label: "Tokenomics", href: "/#tokenomics", icon: DollarSign },
  { label: "Waitlist", href: "/#waitlist", icon: Clock },
];

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false); // For Skeleton State

  useEffect(() => {
    // Wrap in setTimeout to satisfy linter (avoids "synchronous" state update)
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  // Scroll & Active Section Logic
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Visibility Logic
          if (currentScrollY < 10) {
            setIsVisible(true);
          } else {
            if (currentScrollY > lastScrollY + 5) setIsVisible(false);
            else if (currentScrollY < lastScrollY - 5) setIsVisible(true);
          }
          setLastScrollY(currentScrollY);

          // We define a "check line" at 30% of the screen height.
          // If a section crosses this line, it is active.
          const checkLine = window.innerHeight * 0.3;
          let foundActive = false;

          const sections = NAV_ITEMS.map((item) =>
            item.href.substring(1)
          ).filter((id) => id);

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              const top = rect.top;
              const bottom = rect.bottom;

              // Check if the section contains our "check line"
              // Top is above the line, Bottom is below the line
              if (top <= checkLine && bottom >= checkLine) {
                setActiveSection(`#${section}`);
                foundActive = true;
                break;
              }
            }
          }

          // If no section matched our check line, clear the active state
          if (!foundActive) {
            setActiveSection("");
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 60) setIsVisible(true);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // SKELETON LOADER COMPONENT
  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 w-full z-50 lg:pt-6 px-4">
        <div className="mx-auto lg:max-w-310 h-13.5 lg:h-21 bg-[#0A0822]/80 backdrop-blur-md border border-white/5 rounded-[100px] flex items-center justify-between px-6 animate-pulse">
          {/* Logo Skeleton */}
          <div className="w-32 h-8 bg-white/10 rounded-md" />
          {/* Links Skeleton */}
          <div className="hidden lg:flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-24 h-4 bg-white/10 rounded-md" />
            ))}
          </div>
          {/* Button Skeleton */}
          <div className="w-47 h-11 bg-white/10 rounded-2xl hidden lg:block" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 lg:pt-6 px-0 lg:px-4 transition-transform duration-500 ease-in-out hover:translate-y-0 ${
          isOpen || isVisible ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        <nav className="mx-auto lg:max-w-310 bg-[#0A0822] border-b lg:border border-white/10 backdrop-blur-md transition-all duration-300 lg:rounded-[100px] shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between w-full h-13.5 px-5 py-3.75 lg:h-21 lg:px-6 lg:py-2.5">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Image
                src="/penxchain-lockup.png"
                alt="Penxchain Logo"
                width={150}
                height={40}
                priority
                className="w-32 sm:w-36 lg:w-40 h-auto"
              />
            </div>

            {/* Desktop Links */}
            <div className="font-jakarta hidden lg:flex items-center gap-2 text-sm font-medium text-gray-400 flex-1 justify-center">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`relative px-5 py-2.5 rounded-full transition-all duration-300 group ${
                      isActive ? "text-white" : "hover:text-gray-200"
                    }`}
                  >
                    {/* Glass Pill Background */}
                    <span
                      className={`absolute inset-0 rounded-full bg-white/10 border border-white/5 transition-all duration-300 ease-out ${
                        isActive
                          ? "opacity-100 scale-100 shadow-[0_0_15px_rgba(37,71,208,0.3)]"
                          : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                      }`}
                    />

                    {/* Text Label */}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex shrink-0">
              <button
                onClick={() => handleSmartDownload(router)}
                className="flex items-center justify-center gap-2.5 bg-[#2547D0] hover:bg-[#1e3a8a] text-white rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                style={{ width: "188px", height: "44px", padding: "10px" }}
              >
                <ArrowDownToLine size={18} />
                Download Wallet
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden text-white relative z-60 shrink-0 outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div
                className={`transition-transform duration-500 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                {isOpen ? <X size={25} /> : <Menu size={25} />}
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-all duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-full h-screen bg-[#0A0822] z-40 lg:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-28 shrink-0" />
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden px-6"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            <nav className="font-jakarta flex flex-col gap-6 py-4">
              {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.href;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className={`flex items-center gap-4 text-xl font-semibold border-b border-white/10 pb-4 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isActive ? "text-[#2547D0]" : "text-gray-300"
                    }`}
                    style={{
                      transitionDelay: isOpen
                        ? `${index * 120 + 200}ms`
                        : "0ms",
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "translateY(0)" : "translateY(-40px)",
                      filter: isOpen ? "blur(0px)" : "blur(10px)",
                    }}
                  >
                    <Icon
                      size={24}
                      className={isActive ? "text-[#2547D0]" : "text-gray-500"}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="shrink-0 px-6 pb-8 pt-4 bg-linear-to-t from-[#0A0822] via-[#0A0822] to-transparent">
            <div
              className="flex flex-col gap-4 w-full transition-all duration-700 delay-500 ease-out"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <button
                onClick={() => handleSmartDownload(router)}
                className="flex items-center justify-center gap-2.5 bg-[#2547D0] hover:bg-[#1e3a8a] text-white rounded-2xl text-base font-semibold w-full transition-all shadow-lg shadow-blue-900/30 active:scale-95"
                style={{ height: "44px", padding: "10px" }}
              >
                <ArrowDownToLine size={20} />
                Download Wallet
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
