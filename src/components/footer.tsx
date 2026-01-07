"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSmartDownload } from "@/lib/downloadHelper";
import {
  FaXTwitter,
  FaGithub,
  FaLinkedin,
  FaDiscord,
  FaTelegram,
} from "react-icons/fa6";

type FooterLink = {
  label: string;
  href: string;
  isWalletAction?: boolean; // It's optional
};

const footerLinks: Record<string, FooterLink[]> = {
  Product: [
    {
      label: "Download Wallet",
      href: "#",
      isWalletAction: true,
    },
    {
      label: "Download Marketplace",
      href: "/marketplace/coming-soon",
    },
    { label: "Token", href: "#" },
    { label: "Roadmap", href: "#roadmap" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Whitepaper", href: "/docs/PENXCHAIN-WHITEPAPER IDO.pdf" },
    { label: "Blogs", href: "/blog" },
    { label: "Github", href: "https://github.com/Penxchain" },
  ],
};

const socialLinks = [
  {
    icon: FaXTwitter,
    href: "https://x.com/penxchain_?s=21",
    label: "X (Twitter)",
  },
  { icon: FaGithub, href: "https://github.com/Penxchain", label: "GitHub" },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/penxchain/",
    label: "LinkedIn",
  },
  { icon: FaDiscord, href: "#", label: "Discord" },
  {
    icon: FaTelegram,
    href: "https://t.me/Officialpenxchain",
    label: "Telegram",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const linkStyles =
    "font-jakarta text-blue-200/60 text-base hover:text-[#2547D0] transition-colors duration-200 flex items-center gap-2 group bg-transparent border-none cursor-pointer p-0 text-left";

  return (
    <footer
      className="relative w-full pt-20 pb-10 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #120848 0%, #020410 100%)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#2547D0]/50 to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute -top-50 left-1/2 -translate-x-1/2 w-150 h-100 bg-[#2547D0]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* --- TOP ROW: LOGO & LINKS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* LOGO COLUMN */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/penxchain-lockup.png"
                alt="Penxchain"
                width={180}
                height={50}
                className="w-40 h-auto"
              />
            </Link>
            <p className="font-jakarta text-blue-200/70 text-lg leading-relaxed max-w-sm mb-8">
              Building the future of privacy-first decentralized infrastructure
              for the next generation of Web3.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socialLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-xl bg-[#00000033] border border-white/5 text-blue-200/60 overflow-hidden transition-all duration-300 hover:text-white hover:border-[#2547D0] hover:shadow-[0_0_15px_rgba(37,71,208,0.4)]"
                  aria-label={item.label}
                >
                  <div className="absolute inset-0 bg-[#2547D0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <item.icon
                    size={20}
                    className="relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* LINKS GRID (Right) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 lg:gap-12">
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div key={index}>
                <h3 className="font-space font-bold text-white text-lg mb-6 tracking-wide">
                  {category}
                </h3>
                <ul className="flex flex-col gap-4">
                  {links.map((link, i) => (
                    <li key={i}>
                      {/* Check if isWalletAction is true */}
                      {link.isWalletAction ? (
                        <button
                          onClick={() => handleSmartDownload(router)}
                          className={linkStyles}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2547D0] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </button>
                      ) : (
                        <Link href={link.href} className={linkStyles}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2547D0] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-[#2547D0]/30 to-transparent mb-8" />

        {/* BOTTOM ROW: COPYRIGHT */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-jakarta text-blue-200/40 text-sm">
            © {currentYear} Penxchain. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="#"
              className="font-jakarta text-blue-200/40 text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="font-jakarta text-blue-200/40 text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
