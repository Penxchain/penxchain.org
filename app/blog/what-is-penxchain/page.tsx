import { Metadata } from "next";
import WhatIsContent from "./WhatIsContent.client";

export const metadata: Metadata = {
  title: "What is PENXCHAIN — Private Blockchain & Wallet",
  description:
    "Learn what PENXCHAIN is: a privacy-first blockchain ecosystem with a decentralized wallet, private payments, and a marketplace built for secure, user-first finance.",
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
