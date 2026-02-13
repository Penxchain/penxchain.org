"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DOCS_NAVIGATION } from "@/lib/docs-config";
import { motion, AnimatePresence } from "framer-motion";

export function DocsSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(" ").filter(Boolean);
    
    return DOCS_NAVIGATION.flatMap((category) => 
      category.items.map(item => {
        const titleMatch = item.title.toLowerCase();
        const descMatch = item.description?.toLowerCase() || "";
        const idMatch = item.id.toLowerCase();
        
        // Scoring system
        let score = 0;
        
        // Exact title match gets highest priority
        if (titleMatch === query.toLowerCase()) score += 100;
        
        // Partial title match
        if (titleMatch.includes(query.toLowerCase())) score += 50;
        
        // Matches multiple terms
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
    .slice(0, 8); // Limit to top 8 results
  }, [query]);

  const handleSelect = (id: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/docs/${id}`);
  };

  return (
    <div ref={wrapperRef} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
      <div className="relative w-full">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            isOpen ? "text-blue-400" : "text-gray-500 group-focus-within:text-blue-400"
          }`}
          size={18}
        />
        <input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="w-full bg-[#0A0D1F] border border-white/10 rounded-xl py-2.5 pl-12 pr-10 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-[#0F1229] transition-all placeholder:text-gray-600 shadow-inner text-white"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0F1229] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-black/50"
          >
             <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {results.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Documentation
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result.id)}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3 group"
                    >
                      <div className="mt-1 p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all">
                        <result.icon size={16} />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm flex items-center gap-2">
                          {result.title}
                          <ChevronRight size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {result.description}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-1 font-mono uppercase">
                          {result.category} / {result.id}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="mx-auto mb-3 opacity-20" size={32} />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
