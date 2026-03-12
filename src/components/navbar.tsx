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
  ChevronRight,
  Zap,
} from "lucide-react";

// Icons included in configuration
const NAV_ITEMS = [
  { label: "Private Sale", href: "/privatesale", icon: Zap },
  { label: "Documentation", href: "/docs", icon: FileText },
  { label: "Roadmap", href: "/#roadmap", icon: Map },
  { label: "Tokenomics", href: "/#tokenomics", icon: DollarSign },
  { label: "Updates", href: "/#updates", icon: Clock },
];

type NavbarProps = {
  variant?: "full" | "compact";
  enableAnchorScroll?: boolean;
};

export default function Navbar({
  variant = "full",
  enableAnchorScroll = true,
}: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

  const getHashFromHref = (href: string): string | null => {
    const idx = href.indexOf("#");
    if (idx === -1) return null;
    return href.slice(idx + 1);
  };

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

          // Active Section Logic
          const checkLine = window.innerHeight * 0.3;
          let foundActive = false;

          const sections = NAV_ITEMS.map((item) => {
            return { id: getHashFromHref(item.href), href: item.href };
          }).filter((s) => s.id);

          for (const sec of sections) {
            const id = sec.id as string;
            const element = document.getElementById(id);
            if (element) {
              const rect = element.getBoundingClientRect();
              const top = rect.top;
              const bottom = rect.bottom;

              if (top <= checkLine && bottom >= checkLine) {
                setActiveSection(sec.href);
                foundActive = true;
                break;
              }
            }
          }

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
    const hash = getHashFromHref(href);

    if (hash && enableAnchorScroll) {
      e.preventDefault();
      setIsOpen(false);

      const doScroll = () => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };

      // Slight delay if menu was open to allow closing animation
      if (isOpen) {
        setTimeout(doScroll, 520);
      } else {
        doScroll();
      }
    } else {
      // If it's a standard link (like /docs), close menu immediately
      setIsOpen(false);
    }
  };

  // SKELETON LOADER
  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 w-full z-50 lg:pt-6 px-4">
        <div className="mx-auto lg:max-w-310 h-13.5 lg:h-21 bg-[#0A0822]/80 backdrop-blur-md border border-white/5 rounded-[100px] flex items-center justify-between px-6 animate-pulse">
          <div className="w-32 h-8 bg-white/10 rounded-md" />
          <div className="hidden lg:flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-24 h-4 bg-white/10 rounded-md" />
            ))}
          </div>
          <div className="w-47 h-11 bg-white/10 rounded-2xl hidden lg:block" />
        </div>
      </div>
    );
  }

  const isCompact = variant === "compact";

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 lg:pt-6 px-0 lg:px-4 transition-transform duration-500 ease-in-out hover:translate-y-0 ${
          isOpen || isVisible ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        <nav
          className={`mx-auto lg:max-w-310 bg-[#0A0822] border-b lg:border border-white/10 backdrop-blur-md transition-all duration-300 lg:rounded-[100px] shadow-2xl shadow-black/50 ${
            isCompact ? "py-3" : ""
          }`}
        >
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

            {/* Desktop Links (No Icons) */}
            {!isCompact && (
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
                      <span
                        className={`absolute inset-0 rounded-full bg-white/10 border border-white/5 transition-all duration-300 ease-out ${
                          isActive
                            ? "opacity-100 scale-100 shadow-[0_0_15px_rgba(37,71,208,0.3)]"
                            : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                        }`}
                      />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Desktop CTA */}
            {!isCompact && (
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
            )}

            {/* Mobile Hamburger - Z-Index boosted to sit above overlay */}
            <button
              className="lg:hidden text-white relative z-[60] shrink-0 outline-none p-2 -mr-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div
                className={`transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${
                  isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
                }`}
              >
                {isOpen ? (
                  <X size={26} className="text-white" />
                ) : (
                  <Menu size={26} />
                )}
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-700 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar - The Premium Experience */}
      <aside
        className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-[#0A0822] via-[#0f0c2e] to-[#050414] z-40 lg:hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-[#2547D0]/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[30%] bg-[#7c3aed]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col h-full relative z-10">
          {/* Spacer for Navbar */}
          <div className="h-24 shrink-0" />

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-12 pt-4"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    style={{
                      transitionDelay: isOpen ? `${100 + index * 75}ms` : "0ms",
                    }}
                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ease-out 
                      ${
                        isOpen
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-8 opacity-0"
                      }
                      ${
                        isActive
                          ? "bg-white/10 border-[#2547D0]/50 shadow-[0_0_20px_rgba(37,71,208,0.15)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }
                    `}
                  >
                    {/* Icon Container */}
                    <div
                      className={`p-2.5 rounded-xl transition-colors duration-300 ${
                        isActive
                          ? "bg-[#2547D0] text-white"
                          : "bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10"
                      }`}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <span
                        className={`block text-lg font-bold tracking-tight transition-colors duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-gray-200 group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                      {/* Optional subtle description if you wanted it, for now just keeping it clean */}
                    </div>

                    {/* Arrow Indicator */}
                    <ChevronRight
                      size={18}
                      className={`text-gray-500 transition-transform duration-300 group-hover:translate-x-1 ${
                        isActive ? "text-[#2547D0]" : ""
                      }`}
                    />
                  </Link>
                );
              })}

              {/* Compact Mode Home Link */}
              {isCompact && (
                <Link
                  href="/"
                  style={{
                    transitionDelay: isOpen
                      ? `${100 + NAV_ITEMS.length * 75}ms`
                      : "0ms",
                  }}
                  className={`mt-4 flex items-center justify-center py-4 text-sm font-medium text-gray-400 bg-transparent border border-white/10 rounded-2xl hover:text-white hover:bg-white/5 transition-all duration-500 ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-8 opacity-0"
                  }`}
                >
                  Back to Home
                </Link>
              )}
            </div>

            {/* Mobile CTA */}
            {!isCompact && (
              <div
                className={`mt-8 transition-all duration-700 delay-300 ${
                  isOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSmartDownload(router);
                  }}
                  className="w-full relative overflow-hidden bg-[#2547D0] hover:bg-[#1e3a8a] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold shadow-xl shadow-blue-900/30 active:scale-[0.98] transition-all"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                  <ArrowDownToLine size={20} />
                  Download Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
