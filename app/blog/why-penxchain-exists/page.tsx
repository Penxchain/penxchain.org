import { Metadata } from "next";
import WhyPenxchainContent from "./WhyPenxchainContent.client";

export const metadata: Metadata = {
  title: "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
  description:
    "Blockchain promised freedom but delivered fragmentation, exposure, and complexity. Discover why PENXCHAIN was built to solve these fundamental problems with privacy-first infrastructure.",
  openGraph: {
    title: "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
    description:
      "The real problems blocking blockchain adoption and how PENXCHAIN fixes them with privacy, simplicity, and focus on emerging markets.",
    url: "https://penxchain.org/blog/why-penxchain-exists",
  },
};

export default function WhyPenxchainPage() {
  return <WhyPenxchainContent />;
}
