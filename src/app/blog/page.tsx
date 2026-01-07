"use client";

import BlogCard from "./BlogCard";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "what-is-penxchain",
    slug: "what-is-penxchain",
    title: "What is PENXCHAIN?",
    excerpt:
      "PENXCHAIN is a privacy-first blockchain ecosystem built for people who want to use crypto without exposing their entire financial life to the public.",
    image: "/blog-images/what-is-penxchain.jpg",
    date: "2025-12-08",
    author: "Emmanuel Brighton",
    category: "Education",
    readTime: "5 min read",
  },
  {
    id: "penxchain-wallet-features",
    slug: "penxchain-wallet-features",
    title: "PENXCHAIN Wallet: Key Features",
    excerpt:
      "Discover the powerful features that make PENXCHAIN Wallet the most secure and private way to manage your digital assets.",
    image: "/blog-images/penxchain-wallet-features.jpg",
    date: "2026-01-06",
    author: "God'swill Akpan",
    category: "Product",
    readTime: "6 min read",
  },
  {
    id: "penxchain-wallet-overview",
    slug: "penxchain-wallet-overview",
    title: "PENXCHAIN Wallet: Privacy-First Self-Custodial Wallet",
    excerpt:
      "The PENXCHAIN Wallet is a privacy-first, self-custodial wallet built for secure everyday payments. Using Zero-Knowledge Proofs, it lets you transact, swap, and trade without exposing your balance or activity.",
    image: "/blog-images/penxchain-wallet-overview.jpg",
    date: "2026-01-05",
    author: "PENXCHAIN Team",
    category: "Product",
    readTime: "6 min read",
  },
  {
    id: "merry-christmas-2025",
    slug: "merry-christmas-2025",
    title: "Merry Christmas from PENXCHAIN",
    excerpt:
      "To all our privacy-conscious friends, families, and communities—Merry Christmas! Celebrating Aleo, Base, zkSync, Scroll, Starknet, Verza, and all the builders making privacy possible.",
    image: "/blog-images/christmas-2025.jpg",
    date: "2025-12-25",
    author: "PENXCHAIN Team",
    category: "Community",
    readTime: "3 min read",
  },
  {
    id: "ecosystem-overview-coming-soon",
    slug: "ecosystem-overview-coming-soon",
    title: "Ecosystem Overview Coming Soon",
    excerpt:
      "We're revealing everything. Stay tuned for the full PENXCHAIN ecosystem overview showing how Base and Aleo integration makes privacy at scale possible.",
    image: "/blog-images/ecosystem-teaser.jpg",
    date: "2025-12-20",
    author: "PENXCHAIN Team",
    category: "Announcement",
    readTime: "5 min read",
  },
  {
    id: "connecting-with-base-hybrid-blockchain",
    slug: "connecting-with-base-hybrid-blockchain",
    title: "Connecting with Base: PENXCHAIN's Hybrid Architecture",
    excerpt:
      "How PENXCHAIN combines Aleo's zero-knowledge privacy with Base's liquidity infrastructure to deliver both privacy and adoption at scale.",
    image: "/blog-images/base-hybrid.jpg",
    date: "2025-12-18",
    author: "Emmanuel Oluwafemi",
    category: "Technology",
    readTime: "8 min read",
  },
  {
    id: "penx-token-utility",
    slug: "penx-token-utility",
    title: "$PENX Token Utility: The Economic Backbone of PENXCHAIN",
    excerpt:
      "Discover how $PENX powers privacy-first commerce, governance, and incentives across the PENXCHAIN ecosystem through staking, payments, and merchant perks.",
    image: "/blog-images/penx-token-utility.jpg",
    date: "2025-12-16",
    author: "Emmanuel Oluwafemi",
    category: "Token",
    readTime: "9 min read",
  },
  {
    id: "why-penxchain-exists",
    slug: "why-penxchain-exists",
    title: "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
    excerpt:
      "Blockchain promised freedom and transparency, but delivered fragmentation, exposure, and complexity. Here's why PENXCHAIN was built to fix these fundamental problems.",
    image: "/blog-images/why-penxchain-exists.jpg",
    date: "2025-12-13",
    author: "Emmanuel Oluwafemi",
    category: "Vision",
    readTime: "12 min read",
  },
  {
    id: "zkp-penxchain",
    slug: "zkp-penxchain",
    title: "Zero-Knowledge Proofs Explained",
    excerpt:
      "A beginner-friendly guide to understanding how zero-knowledge proofs protect your privacy while maintaining blockchain security.",
    image: "/blog-images/zkp-in-penxchain.jpg",
    date: "2025-12-12",
    author: "Emmanuel Oluwafemi",
    category: "Technology",
    readTime: "10 min read",
  },
];

// Get unique categories
const categories = [
  "All",
  ...Array.from(new Set(blogPosts.map((post) => post.category))),
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fast client-side filtering
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-linear-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] pb-16">
      {/* Hero Section with Search */}
      <div className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0ce50c]/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 bg-linear-to-r from-white via-cyan-700 to-[#0b0255] bg-clip-text text-transparent">
            Blog & News
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Stay updated with the latest insights, updates, and stories from the
            PENXCHAIN ecosystem
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search articles, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {(searchQuery || selectedCategory !== "All") && (
            <p className="text-sm text-white/50">
              Found {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "article" : "articles"}
            </p>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <Search className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No articles found
            </h3>
            <p className="text-white/50 mb-6">
              Try adjusting your search or filter to find what you&apos;re looking
              for
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
