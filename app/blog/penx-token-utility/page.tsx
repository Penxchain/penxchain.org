import { Metadata } from "next";
import PenxTokenUtilityContent from "./PenxTokenUtilityContent.client";

export const metadata: Metadata = {
  title: "$PENX Token Utility: The Economic Backbone of PENXCHAIN",
  description:
    "Explore how $PENX powers the PENXCHAIN ecosystem through staking rewards, governance, payment utility, liquidity incentives, and merchant benefits.",
  openGraph: {
    title: "$PENX Token Utility: The Economic Backbone of PENXCHAIN",
    description:
      "From staking to governance and merchant perks, discover how $PENX drives privacy-first commerce and community participation.",
    url: "https://penxchain.org/blog/penx-token-utility",
  },
};

export default function PenxTokenUtilityPage() {
  return <PenxTokenUtilityContent />;
}