import { Metadata } from "next";
import WhatIsContent from "./WhatIsContent.client";

export const metadata: Metadata = {
  title: "What is PENXCHAIN — Private Blockchain & Wallet",
  description:
    "Learn what PENXCHAIN is: a privacy-first blockchain ecosystem with a decentralized wallet, private payments, and a marketplace built for secure, user-first finance.",
  keywords: [
    "What is PENXCHAIN",
    "Is PENXCHAIN private",
    "PENXCHAIN privacy",
    "Is PENXCHAIN secure",
    "Is PENXCHAIN decentralized",
    "Is Penxchain safe",
    "Is PENXCHAIN legit",
    "PENXCHAIN blockchain",
    "PENXCHAIN wallet",
    "privacy blockchain",
    "decentralized wallet",
    "private payments",
    "secure blockchain",
    "user-first finance",
    "PENXCHAIN ecosystem",
    "blockchain privacy",
  ],
  openGraph: {
    title: "What is PENXCHAIN — Private Blockchain & Wallet",
    description:
      "Learn what PENXCHAIN is: a privacy-first blockchain ecosystem with a decentralized wallet, private payments, and a marketplace built for secure, user-first finance.",
    url: "https://penxchain.org/what-is-penxchain",
  },
};

export default function WhatIsPenxchain() {
  return <WhatIsContent />;
}
