"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Home, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { DocsSearch } from "@/components/docs/docs-search";

interface DocsHeaderProps {
  onMobileMenuToggle: () => void;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function DocsHeader({ onMobileMenuToggle, isSidebarOpen, onSidebarToggle }: DocsHeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-[#020410]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Desktop Sidebar Toggle - Moved to Sidebar component */}

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

      {/* Deep Search */}
      <DocsSearch />

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
  );
}
