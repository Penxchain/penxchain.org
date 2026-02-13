import { DocsLayoutClient } from "@/components/docs/docs-layout-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | PENXCHAIN Docs",
    default: "Documentation | PENXCHAIN",
  },
  description: "Official documentation for PENXCHAIN, the privacy-first blockchain ecosystem.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
