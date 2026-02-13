"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DOCS_NAVIGATION } from "@/lib/docs-config";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface DocsMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsMobileMenu({ isOpen, onClose }: DocsMobileMenuProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(" ").filter(Boolean);
    
    return DOCS_NAVIGATION.flatMap((category) => 
      category.items.map(item => {
        const titleMatch = item.title.toLowerCase();
        const descMatch = item.description?.toLowerCase() || "";
        const idMatch = item.id.toLowerCase();
        
        let score = 0;
        if (titleMatch === query.toLowerCase()) score += 100;
        if (titleMatch.includes(query.toLowerCase())) score += 50;
        searchTerms.forEach(term => {
          if (titleMatch.includes(term)) score += 10;
          if (descMatch.includes(term)) score += 5;
          if (idMatch.includes(term)) score += 5;
        });

        return { ...item, category: category.category, score, icon: category.icon };
      })
    )
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  }, [query]);

  const handleSelect = (id: string) => {
    setQuery("");
    onClose();
    router.push(`/docs/${id}`);
  };

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
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm lg:hidden overscroll-none"
          />

            {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] z-[70] bg-[#0A0D1F] border-r border-white/10 flex flex-col"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 p-6 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <Image
                  src="/penxchain-lockup.png"
                  alt="Logo"
                  width={120}
                  height={30}
                />
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

               {/* Mobile Search */}
               <div className="relative mb-2">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-[#020410] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder:text-gray-600"
                  />
                   {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
                    >
                        <X size={14} />
                    </button>
                    )}
                </div>
            </div>

            <div 
                className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-6 pt-0 outline-none"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
              {query ? (
                 <div className="flex flex-col gap-2 pt-4">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => handleSelect(result.id)}
                                className="w-full text-left px-4 py-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors flex items-start gap-3"
                            >
                                <div className="mt-0.5 p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                                    <result.icon size={14} />
                                </div>
                                <div>
                                    <div className="text-white font-medium text-sm">
                                        {result.title}
                                    </div>
                                    <div className="text-xs text-gray-500 line-clamp-1">
                                        {result.category}
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8 text-sm">
                            No results found checking "{query}"
                        </div>
                    )}
                 </div>
              ) : (
                <div className="flex flex-col gap-6 py-6 pb-8">
                    {DOCS_NAVIGATION.map((section, idx) => (
                    <div key={idx}>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                        <section.icon size={12} />
                        {section.category}
                        </div>
                        <div className="flex flex-col gap-2 border-l border-white/10 pl-3 ml-1">
                        {section.items.map((item) => (
                            <Link
                            key={item.id}
                            href={`/docs/${item.id}`}
                            onClick={onClose}
                            className="text-left text-sm font-medium transition-colors py-1.5 text-gray-400 hover:text-white block"
                            >
                            {item.title}
                            </Link>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
