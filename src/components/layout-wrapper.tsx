"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideEverything =
    pathname.startsWith("/docs") || pathname.startsWith("/download");

  // Pages where we previously hid the full navbar but we still
  // want a compact navbar so users can get back to the real site
  const hideNavbarOnly =
    pathname === "/marketplace/coming-soon" ||
    pathname === "/blog/what-is-penxchain" ||
    pathname === "/blog/zkp-penxchain" ||
    pathname === "/blog/why-penxchain-exists" ||
    pathname === "/blog/ecosystem-overview-coming-soon" ||
    pathname === "/blog/penx-token-utility" ||
    pathname === "/blog/connecting-with-base-hybrid-blockchain" ||
    pathname === "/blog/merry-christmas-2025" ||
    pathname === "/blog/penxchain-wallet-overview" ||
    pathname === "/blog/penxchain-wallet-features";

  // determine visibility
  const showFooter = !hideEverything;

  // Show navbar everywhere except `hideEverything` pages.
  const showNavbar = !hideEverything;
  

  // Decide whether the navbar should intercept anchor clicks for smooth scrolling.
  // We only enable in-page smooth scrolling on the homepage (root path),
  // because other pages should navigate back to "/" when clicking a "/#..." link.
  const enableAnchorScroll = pathname === "/";

  return (
    <>
      {showNavbar && (
        <Navbar
          enableAnchorScroll={enableAnchorScroll}
        />
      )}

      {children}

      {showFooter && <Footer />}
    </>
  );
}
