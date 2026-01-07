import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Blog & News — PENXCHAIN",
  description:
    "Stay updated with the latest news, updates, and insights from PENXCHAIN. Learn about privacy, blockchain technology, and our ecosystem.",
  keywords: ["PENXCHAIN blog", "PENXCHAIN news", "blockchain updates"],
  openGraph: {
    title: "Blog & News — PENXCHAIN",
    description:
      "Stay updated with the latest news, updates, and insights from PENXCHAIN.",
    url: "https://penxchain.org/blog",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
