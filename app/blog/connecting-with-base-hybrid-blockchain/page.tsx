import { Metadata } from "next";
import BaseHybridContent from "./BaseHybridContent.client";

export const metadata: Metadata = {
  title: "Connecting with Base: PENXCHAIN's Hybrid Architecture",
  description:
    "Discover how PENXCHAIN leverages both Aleo's zero-knowledge technology and Base's liquidity infrastructure to create a privacy-first blockchain with real-world adoption.",
  openGraph: {
    title: "Connecting with Base: PENXCHAIN's Hybrid Architecture",
    description:
      "How PENXCHAIN combines private execution on Aleo with liquidity on Base to scale privacy without sacrificing adoption.",
    url: "https://penxchain.org/blog/connecting-with-base-hybrid-blockchain",
  },
};

export default function BaseHybridPage() {
  return <BaseHybridContent />;
}
