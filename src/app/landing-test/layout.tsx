import type { Metadata } from "next";
import "./landing-test.css";

export const metadata: Metadata = {
  title: "PENXCHAIN — ZK Privacy Blockchain Ecosystem [TEST]",
  description:
    "PENXCHAIN is the ZK privacy blockchain ecosystem powering private payments, anonymous e-commerce, and sovereign digital identity.",
};

export default function LandingTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      <div className="landing-test-root">{children}</div>
    </>
  );
}
