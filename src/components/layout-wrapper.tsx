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

  const hideNavbarOnly = pathname === "/marketplace/coming-soon"
  || pathname === "/blog/what-is-penxchain" 
  || pathname === "/blog/zkp-penxchain" 
  || pathname === "/blog/why-penxchain-exists"
  || pathname === "/blog/ecosystem-overview-coming-soon"
  || pathname === "/blog/penx-token-utility"
  || pathname === "/blog/connecting-with-base-hybrid-blockchain"
  || pathname === "/blog/merry-christmas-2025"
  || pathname === "/blog/penxchain-wallet-overview"
  || pathname === "/blog/penxchain-wallet-features";



  // determine visibility
  const showFooter = !hideEverything;
  const showNavbar = !hideEverything && !hideNavbarOnly;

  return (
    <>
      {showNavbar && <Navbar />}

      {children}

      {showFooter && <Footer />}
    </>
  );
}
