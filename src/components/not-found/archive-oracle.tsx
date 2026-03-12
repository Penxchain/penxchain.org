"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenText,
  Newspaper,
  RadioTower,
} from "lucide-react";

import type { BlogPost } from "@/lib/blog-posts";

type ArchiveOracleProps = {
  posts: BlogPost[];
};

function formatBlogDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArchiveOracle({ posts }: ArchiveOracleProps) {
  const [leadPost, ...secondaryPosts] = posts;

  if (!leadPost) {
    return null;
  }

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[0_28px_90px_rgba(2,6,23,0.52)] backdrop-blur-xl sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[26px] border border-cyan-200/10 bg-[linear-gradient(180deg,rgba(7,10,24,0.96),rgba(3,5,15,0.92))] p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(37,71,208,0.18),transparent_34%)]" />
          <div className="absolute left-4 top-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.34em] text-cyan-100/60">
            <span className="h-px w-8 bg-gradient-to-r from-cyan-300/85 to-transparent" />
            blog guide
          </div>

          <div className="relative flex min-h-[300px] items-center justify-center">
            <motion.div
              className="relative h-56 w-44"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5.4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 rounded-[30px] border border-cyan-200/18 bg-[linear-gradient(180deg,rgba(17,26,56,0.96),rgba(7,10,24,0.96))] shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                animate={{ rotate: [0, 1.2, -1.2, 0] }}
                transition={{
                  duration: 7,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="absolute inset-x-4 top-8 h-4 rounded-full border border-cyan-200/16 bg-black/20" />
                <motion.div
                  className="absolute top-9 h-2 w-14 rounded-full bg-gradient-to-r from-cyan-300/50 via-white to-cyan-300/50 shadow-[0_0_18px_rgba(103,232,249,0.55)]"
                  animate={{ x: [16, 42, 16] }}
                  transition={{
                    duration: 2.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-1.5">
                  <span className="h-1.5 rounded-full bg-cyan-200/70" />
                  <span className="h-1.5 rounded-full bg-cyan-200/25" />
                  <span className="h-1.5 rounded-full bg-cyan-200/70" />
                </div>
              </motion.div>

              <div className="absolute inset-x-2 bottom-0 top-20 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(11,16,38,0.96),rgba(4,7,20,0.96))] shadow-[0_0_34px_rgba(37,71,208,0.16)]">
                <div className="absolute inset-x-4 top-6 rounded-[18px] border border-cyan-200/10 bg-black/15 px-4 py-3">
                  <div className="space-y-2">
                    <div className="h-1.5 w-16 rounded-full bg-cyan-200/60" />
                    <div className="h-1.5 w-22 rounded-full bg-white/10" />
                    <div className="h-1.5 w-14 rounded-full bg-cyan-200/35" />
                  </div>
                </div>

                <motion.div
                  className="absolute -right-4 top-14 flex h-18 w-18 items-center justify-center rounded-full border border-cyan-200/14 bg-cyan-200/6 backdrop-blur-md"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <RadioTower size={20} className="text-cyan-100/80" />
                </motion.div>

                <div className="absolute inset-x-4 bottom-5 rounded-[20px] border border-white/7 bg-white/4 p-3">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-100/58">
                    active task
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200/82">
                    Reading the latest PENXCHAIN posts.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.34em] text-cyan-100/56">
                <span className="h-px w-10 bg-gradient-to-r from-cyan-300/85 to-transparent" />
                blog and news
              </div>
              <h2 className="mt-3 font-space text-3xl font-bold leading-tight text-white sm:text-[2rem]">
                Read something real from PENXCHAIN
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/78 sm:text-base">
                This page does not exist, but these posts do.
              </p>
            </div>

            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-cyan-200/14 bg-cyan-200/6 px-4 py-2.5 text-sm font-medium text-cyan-100/84 backdrop-blur-md transition-all duration-300 hover:border-cyan-200/28 hover:bg-cyan-200/10 hover:text-white"
            >
              <BookOpenText size={16} />
              Open Blog
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <Link
            href={`/blog/${leadPost.slug}`}
            className="group mt-6 block rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 transition-all duration-300 hover:border-cyan-200/22 hover:bg-white/6"
          >
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-slate-400/74">
              <span className="rounded-full border border-cyan-200/12 bg-cyan-200/8 px-3 py-1 text-cyan-100/78">
                {leadPost.category}
              </span>
              <span>{formatBlogDate(leadPost.date)}</span>
              <span>{leadPost.readTime}</span>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-space text-2xl font-bold leading-tight text-white transition-colors duration-300 group-hover:text-cyan-100">
                  {leadPost.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/74 sm:text-base">
                  {leadPost.excerpt}
                </p>
              </div>

              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/15 bg-cyan-200/6 text-cyan-100/80 sm:flex">
                <Newspaper size={18} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4 text-sm text-slate-300/72">
              <span>{leadPost.author}</span>
              <span className="inline-flex items-center gap-2 text-cyan-100/84">
                Read post
                <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {secondaryPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-[22px] border border-white/8 bg-black/18 p-4 transition-all duration-300 hover:border-cyan-200/18 hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.28em] text-slate-400/72">
                  <span>{post.category}</span>
                  <span>{formatBlogDate(post.date)}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-cyan-100/92">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300/68">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
