"use client";

import { useState, useMemo, useEffect } from "react";

import Link from "next/link";

import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Home,
  BookOpen,
  Layers,
  Shield,
  Cpu,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// Import Content

import {
  ExecutiveSummary,
  StoryAndVision,
  PlaceholderContent,
} from "@/components/docs/doc-contents";

// --- CUSTOM HOOK: Body Scroll Lock ---

const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    const scrollY = window.scrollY;

    const body = document.body;

    // Lock scroll

    body.style.position = "fixed";

    body.style.top = `-${scrollY}px`;

    body.style.width = "100%";

    body.style.overflowY = "scroll";

    return () => {
      // Unlock scroll

      body.style.position = "";

      body.style.top = "";

      body.style.width = "";

      body.style.overflowY = "";

      // Restore scroll position

      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
};

// --- CONFIGURATION ---

const DOCS_STRUCTURE = [
  {
    category: "Summary",

    icon: BookOpen,

    items: [
      {
        id: "executive-summary",

        title: "Executive Summary",

        component: <ExecutiveSummary />,
      },

      {
        id: "story-vision",

        title: "PENXCHAIN Story and Vision",

        component: <StoryAndVision />,
      },
    ],
  },

  {
    category: "Market",

    icon: Layers,

    items: [
      {
        id: "market-landscape",

        title: "Market Landscape & Opportunity",

        component: <PlaceholderContent title="Market Landscape" />,
      },
    ],
  },

  {
    category: "Ecosystem",

    icon: Cpu,

    items: [
      {
        id: "ecosystem-overview",

        title: "Ecosystem Overview",

        component: <PlaceholderContent title="Ecosystem Overview" />,
      },

      {
        id: "native-wallet",

        title: "Native Wallet",

        component: <PlaceholderContent title="Native Wallet" />,
      },

      {
        id: "marketplace",

        title: "E-Commerce Marketplace",

        component: <PlaceholderContent title="E-Commerce Marketplace" />,
      },
    ],
  },

  {
    category: "Governance",

    icon: Shield,

    items: [
      {
        id: "governance",

        title: "Governance through PENXDAO",

        component: <PlaceholderContent title="Governance" />,
      },
    ],
  },

  {
    category: "Tokenomics",

    icon: FileText,

    items: [
      {
        id: "token-overview",

        title: "PENX Token Overview",

        component: <PlaceholderContent title="Token Overview" />,
      },

      {
        id: "token-utility",

        title: "Token Utility",

        component: <PlaceholderContent title="Token Utility" />,
      },

      {
        id: "economic-flywheel",

        title: "Economic Flywheel and Revenue Model",

        component: <PlaceholderContent title="Revenue Model" />,
      },
    ],
  },

  {
    category: "Technical",

    icon: Cpu,

    items: [
      {
        id: "tech-arch",

        title: "Technology and Architecture",

        component: <PlaceholderContent title="Tech Architecture" />,
      },

      {
        id: "roadmap-doc",

        title: "Roadmap",

        component: <PlaceholderContent title="Roadmap" />,
      },
    ],
  },
];

export default function Documentation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [activeId, setActiveId] = useState("executive-summary");

  const [searchQuery, setSearchQuery] = useState("");

  // Apply scroll lock when mobile menu is open

  useBodyScrollLock(isMobileMenuOpen);

  // Logic to find Next/Prev

  const flatDocs = useMemo(
    () => DOCS_STRUCTURE.flatMap((cat) => cat.items),

    []
  );

  const currentIndex = flatDocs.findIndex((doc) => doc.id === activeId);

  const prevDoc = currentIndex > 0 ? flatDocs[currentIndex - 1] : null;

  const nextDoc =
    currentIndex < flatDocs.length - 1 ? flatDocs[currentIndex + 1] : null;

  const activeDoc = flatDocs.find((doc) => doc.id === activeId) || flatDocs[0];

  const activeCategory = DOCS_STRUCTURE.find((cat) =>
    cat.items.some((i) => i.id === activeId)
  )?.category;

  // Search Filter

  const filteredStructure = useMemo(() => {
    if (!searchQuery) return DOCS_STRUCTURE;

    return DOCS_STRUCTURE.map((cat) => ({
      ...cat,

      items: cat.items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#020410] text-gray-300 font-jakarta selection:bg-blue-500/30 flex flex-col">
      {/* --- TOP HEADER --- */}

      <header className="fixed top-0 left-0 w-full h-20 z-50 bg-[#020410]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Toggle */}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/penxchain-lockup.png"
              alt="Penxchain"
              width={140}
              height={40}
              className="w-32 lg:w-36 h-auto"
            />
          </Link>
        </div>

        {/* Search Bar */}

        <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"
            size={18}
          />

          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0D1F] border border-white/10 rounded-full py-2.5 pl-12 pr-10 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-[#0F1229] transition-all placeholder:text-gray-600 shadow-inner text-white"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10"
          >
            <Home size={16} />

            <span className="hidden sm:inline">Back to Website</span>
          </Link>
        </div>
      </header>

      {/* --- LAYOUT WRAPPER --- */}

      <div className="pt-20 flex flex-1 w-full mx-auto max-w-[1920px]">
        {/* --- 1. DESKTOP SIDEBAR (Independent Scroll) --- */}

        <aside
          className={`

            hidden lg:block shrink-0 sticky top-20

            h-[calc(100vh-80px)] overflow-y-auto overscroll-contain border-r border-white/5 custom-scrollbar

            transition-all duration-300 ease-in-out

            ${
              isSidebarOpen
                ? "w-[300px] opacity-100"
                : "w-0 opacity-0 border-none overflow-hidden"
            }

          `}
        >
          <div className="p-6 pb-20 w-[300px]">
            <div className="flex flex-col gap-8">
              {filteredStructure.map((section, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-3">
                    <section.icon size={12} />

                    {section.category}
                  </div>

                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => {
                      const isActive = activeId === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveId(item.id)}
                          className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                            isActive
                              ? "text-white bg-blue-600/10 border border-blue-600/20 shadow-[0_0_15px_rgba(37,71,208,0.1)]"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {item.title}

                          {isActive && (
                            <motion.div
                              layoutId="active-pill"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* --- 2. MAIN CONTENT --- */}

        <main className="flex-1 min-w-0 px-6 lg:px-12 xl:px-20 py-10 lg:py-12 flex flex-col transition-all duration-300">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
            <div className="mb-8 flex items-center gap-2 text-sm text-blue-400/80 font-medium">
              <span>Docs</span>

              <ChevronRight size={14} />

              <span>{activeCategory}</span>
            </div>

            <h1 className="font-space font-bold text-3xl md:text-5xl text-white mb-10 tracking-tight leading-tight">
              {activeDoc.title}
            </h1>

            <div className="prose prose-invert prose-lg max-w-none font-jakarta text-gray-400 leading-relaxed mb-16">
              {activeDoc.component}
            </div>

            {/* Next/Prev Navigation */}

            <div className="mt-auto pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {prevDoc ? (
                <button
                  onClick={() => {
                    setActiveId(prevDoc.id);

                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group flex flex-col items-start p-6 rounded-2xl border border-white/10 bg-[#0A0D1F] hover:border-blue-500/30 hover:bg-blue-900/5 transition-all text-left"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                    <ChevronLeft size={14} /> Previous
                  </span>

                  <span className="text-base md:text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                    {prevDoc.title}
                  </span>
                </button>
              ) : (
                <div />
              )}

              {nextDoc ? (
                <button
                  onClick={() => {
                    setActiveId(nextDoc.id);

                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group flex flex-col items-end text-right p-6 rounded-2xl border border-white/10 bg-[#0A0D1F] hover:border-blue-500/30 hover:bg-blue-900/5 transition-all"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                    Next <ChevronRight size={14} />
                  </span>

                  <span className="text-base md:text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                    {nextDoc.title}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* --- 3. MOBILE DRAWER (Independent Scroll with Body Lock) --- */}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm lg:hidden"
            />

            {/* Mobile Sidebar - Scrolls independently */}

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] z-[70] bg-[#0A0D1F] border-r border-white/10 flex flex-col"
            >
              {/* Fixed Header */}

              <div className="flex-shrink-0 p-6 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <Image
                    src="/penxchain-lockup.png"
                    alt="Logo"
                    width={120}
                    height={30}
                  />

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Search */}

                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />

                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#020410] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder:text-gray-600"
                  />

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Content */}

              <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-6 pt-4">
                <div className="flex flex-col gap-6 pb-8">
                  {filteredStructure.map((section, idx) => (
                    <div key={idx}>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                        <section.icon size={12} />

                        {section.category}
                      </div>

                      <div className="flex flex-col gap-2 border-l border-white/10 pl-3 ml-1">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveId(item.id);

                              setIsMobileMenuOpen(false);

                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`text-left text-sm font-medium transition-colors py-1.5 ${
                              activeId === item.id
                                ? "text-blue-400 font-semibold"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
