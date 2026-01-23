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

  // Pages where we previously hid the full navbar but we still
  // want a compact navbar are removed. We now explicitly hide
  // the navbar on individual blog post pages and on marketplace coming-soon.

  // Pages where we still hide everything (docs and download pages)
  const hideEverything =
    pathname.startsWith("/docs") || pathname.startsWith("/download") || pathname.startsWith("/wallet-waitlist");

  // Hide navbar only for individual blog posts (paths like /blog/slug)
  // and for the marketplace coming-soon page. The general /blog listing
  // page will still show the navbar.
  const hideNavbarOnly =
    (pathname.startsWith("/blog/") && pathname !== "/blog") ||
    pathname === "/marketplace/coming-soon";

  // determine visibility
  const showFooter = !hideEverything;

  // Show navbar everywhere except `hideEverything` pages or pages in `hideNavbarOnly`.
  const showNavbar = !hideEverything && !hideNavbarOnly;

  // Decide whether the navbar should intercept anchor clicks for smooth scrolling.
  const enableAnchorScroll = pathname === "/";

  return (
    <>
      {showNavbar && <Navbar enableAnchorScroll={enableAnchorScroll} />}

      {children}

      {showFooter && <Footer />}
    </>
  );
}
