"use client";

import { useState } from "react";
import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsMobileMenu } from "./docs-mobile-menu";

import { PanelLeftOpen } from "lucide-react";

export function DocsLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#020410] text-gray-300 font-jakarta selection:bg-blue-500/30 flex flex-col">
      <DocsHeader 
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="pt-20 flex flex-1 w-full mx-auto max-w-[1920px]">
        <DocsSidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 min-w-0 px-6 lg:px-12 xl:px-20 py-10 lg:py-12 flex flex-col transition-all duration-300 relative">
          
          {/* Open Sidebar Button - Visible when sidebar is closed */}
          {!isSidebarOpen && (
            <div className="hidden lg:block absolute top-10 left-6 xl:left-14 z-10">
               <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-white/5 bg-[#0A0D1F]"
                title="Open Sidebar"
              >
                <PanelLeftOpen size={20} />
              </button>
            </div>
          )}

          {children}
        </main>
      </div>

      <DocsMobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </div>
  );
}
