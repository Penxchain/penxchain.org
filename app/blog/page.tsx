import { Metadata } from "next";
import BlogCard from "./BlogCard";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog & News — PENXCHAIN",
  description:
    "Stay updated with the latest news, updates, and insights from PENXCHAIN. Learn about privacy, blockchain technology, and our ecosystem.",
  keywords: [
    "PENXCHAIN blog",
    "PENXCHAIN news",
    "blockchain updates"
  ],
  openGraph: {
    title: "Blog & News — PENXCHAIN",
    description:
      "Stay updated with the latest news, updates, and insights from PENXCHAIN.",
    url: "https://penxchain.org/blog",
  },
};

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
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
  /*
  {
    id: "5",
    slug: "penxchain-wallet-features",
    title: "PENXCHAIN Wallet: Key Features",
    excerpt:
      "Discover the powerful features that make PENXCHAIN Wallet the most secure and private way to manage your digital assets.",
    image: "/blog-images/wallet-features.jpg",
    date: "2024-12-05",
    author: "God'swill Akpan",
    category: "Product",
    readTime: "6 min read",
  },
  {
    id: "6",
    slug: "decentralized-marketplace-guide",
    title: "Your Guide to Decentralized Commerce",
    excerpt:
      "Explore how PENXCHAIN's decentralized marketplace enables secure, private trading without intermediaries or excessive fees.",
    image: "/blog-images/marketplace-guide.jpg",
    date: "2024-11-28",
    author: "Nastasha Firdaus Khan",
    category: "Marketplace",
    readTime: "8 min read",
  },
  {
    id: "7",
    slug: "penxchain-beta-announcement",
    title: "Join Our Beta Testing Program",
    excerpt:
      "We're looking for 100 Android users to help test PENXCHAIN Wallet before launch. Be among the first to experience true privacy.",
    image: "/blog-images/beta-announcement.jpg",
    date: "2024-11-15",
    author: "Emmanuel Brighton",
    category: "Announcement",
    readTime: "4 min read",
  }, */
];

export default function BlogPage() {
  return (
    <main className={styles.blogPage}>
      <div className={styles.heroSection}>
        <h1 className={styles.mainTitle}>Blog & News</h1>
        <p className={styles.mainSubtitle}>
          Stay updated with the latest insights, updates, and stories from the
          PENXCHAIN ecosystem
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
