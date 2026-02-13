import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDocConfig, getNextPrevDocs } from "@/lib/docs-config";
import { getDocComponent } from "@/lib/docs-registry";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocConfig(slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: `${doc.title} | PENXCHAIN Docs`,
      description: doc.description,
      type: "article",
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocConfig(slug);
  const ContentComponent = getDocComponent(slug);
  const { prev, next } = getNextPrevDocs(slug);

  if (!doc || !ContentComponent) {
    notFound();
  }

  // Determine the category for the breadcrumb
  const { DOCS_NAVIGATION } = require("@/lib/docs-config");
  const category = DOCS_NAVIGATION.find((cat: any) => 
    cat.items.some((item: any) => item.id === slug)
  )?.category || "Docs";

  return (
    <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col animate-in fade-in duration-500">
      <div className="mb-8 flex items-center gap-2 text-sm text-blue-400/80 font-medium">
        <span>Docs</span>
        <ChevronRight size={14} />
        <span>{category}</span>
        <ChevronRight size={14} />
        <span className="text-gray-400">{doc.title}</span>
      </div>

      <h1 className="font-space font-bold text-3xl md:text-5xl text-white mb-10 tracking-tight leading-tight">
        {doc.title}
      </h1>

      <div className="prose prose-invert prose-lg max-w-none font-jakarta text-gray-400 leading-relaxed mb-16">
        <ContentComponent />
      </div>

      {/* Next/Prev Navigation */}
      <div className="mt-auto pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {prev ? (
          <Link
            href={`/docs/${prev.id}`}
            className="group flex flex-col items-start p-6 rounded-2xl border border-white/10 bg-[#0A0D1F] hover:border-blue-500/30 hover:bg-blue-900/5 transition-all text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
              <ChevronLeft size={14} /> Previous
            </span>
            <span className="text-base md:text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/docs/${next.id}`}
            className="group flex flex-col items-end text-right p-6 rounded-2xl border border-white/10 bg-[#0A0D1F] hover:border-blue-500/30 hover:bg-blue-900/5 transition-all"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
              Next <ChevronRight size={14} />
            </span>
            <span className="text-base md:text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
