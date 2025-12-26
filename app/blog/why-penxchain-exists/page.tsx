import { Metadata } from "next";
import WhyPenxchainContent from "./WhyPenxchainContent.client";

export const metadata: Metadata = {
  title: "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
  description:
    "Blockchain promised freedom but delivered fragmentation, exposure, and complexity. Discover why PENXCHAIN was built to solve these fundamental problems with privacy-first infrastructure.",
  keywords: [
    "Why PENXCHAIN exists",
    "Why is PENXCHAIN needed",
    "why penxchain",
    "blockchain problems",
    "Is blockchain secure",
    "PENXCHAIN problems",
    "blockchain issues",
    "blockchain fragmentation",
    "blockchain privacy",
    "private blockchain",
    "decentralized finance",
    "blockchain complexity",
    "PENXCHAIN solution",
    "privacy-first blockchain",
    "blockchain adoption",
    "secure blockchain",
    "user-first finance",
    "emerging markets blockchain",
    "PENXCHAIN vision",
  ],
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
