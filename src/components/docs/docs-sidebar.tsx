import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { DOCS_NAVIGATION } from "@/lib/docs-config";
import { PanelLeftClose } from "lucide-react";

interface DocsSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DocsSidebar({ isOpen, onToggle }: DocsSidebarProps) {
  const pathname = usePathname();
  // Extract slug from /docs/[slug]
  const currentSlug = pathname.split("/").pop() || "";

  return (
    <aside
      className={`
        hidden lg:block shrink-0 sticky top-20 
        h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden overscroll-contain border-r border-white/5 custom-scrollbar outline-none 
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-[300px] opacity-100" : "w-0 opacity-0 border-none overflow-hidden"}
      `}
      tabIndex={0}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="w-[300px] relative p-6 pb-20">
        {/* Close Button - Top Right of Sidebar */}
        <button
          onClick={onToggle}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors z-10"
          title="Close Sidebar"
        >
          <PanelLeftClose size={18} />
        </button>

        <div className="flex flex-col gap-8 mt-8">
          {DOCS_NAVIGATION.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-3">
                <section.icon size={12} />
                {section.category}
              </div>

            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = currentSlug === item.id || (currentSlug === "docs" && item.id === "executive-summary");

                return (
                  <Link
                    key={item.id}
                    href={`/docs/${item.id}`}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group block ${
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
                  </Link>
                );
              })}
            </div>
          </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
