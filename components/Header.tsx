"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (href: string): void => {
    setActiveLink(href);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleResize(): void {
      setIsMobile(typeof window !== "undefined" && window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <Image
              src="/img/penxchain-lockup-christmas-2.png"
              alt="PENXCHAIN LOGO"
              width={129}
              height={48}
              priority
              onContextMenu={(e: React.MouseEvent<HTMLImageElement>) =>
                e.preventDefault()
              }
            />
          </div>

          <div
            className={`menu-toggle ${isOpen ? "open" : ""}`}
            id="mobile-menu"
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <ul className={`nav-links ${isOpen ? "open" : ""}`} id="navLinks">
            <li className="nav-logo-mobile">
              <Image
                src="/img/penxchain-lockup-christmas-2.png"
                alt="PENXCHAIN LOGO"
                width={100}
                height={25}
                onContextMenu={(e: React.MouseEvent<HTMLImageElement>) =>
                  e.preventDefault()
                }
              />
            </li>

            <li>
              <Link
                href="/"
                className={`nav-link ${activeLink === "/" ? "active" : ""}`}
                onClick={() => handleLinkClick("/")}
              >
                {isMobile && isOpen && (
                  <i className="mobile-icon fas fa-home" aria-hidden="true"></i>
                )}
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="nav-link"
                onClick={() => handleLinkClick("#wallet")}
              >
                {isMobile && isOpen && (
                  <i
                    className="mobile-icon fas fa-wallet"
                    aria-hidden="true"
                  ></i>
                )}
                Wallet
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="nav-link"
                onClick={() => handleLinkClick("#marketplace")}
              >
                {isMobile && isOpen && (
                  <i
                    className="mobile-icon fas fa-store"
                    aria-hidden="true"
                  ></i>
                )}
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="nav-link"
                onClick={() => handleLinkClick("#merchant")}
              >
                {isMobile && isOpen && (
                  <i
                    className="mobile-icon fas fa-briefcase"
                    aria-hidden="true"
                  ></i>
                )}
                Merchant
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="nav-link"
                onClick={() => handleLinkClick("#tribes")}
              >
                {isMobile && isOpen && (
                  <i
                    className="mobile-icon fas fa-users"
                    aria-hidden="true"
                  ></i>
                )}
                Tribes
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="nav-link"
                onClick={() => handleLinkClick("#tokenomics")}
              >
                {isMobile && isOpen && (
                  <i
                    className="mobile-icon fas fa-coins"
                    aria-hidden="true"
                  ></i>
                )}
                Tokenomics
              </Link>
            </li>
            <li>
              <a
                href="https://forms.gle/6VYv7HgRoMaAwv8D9"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download special-download"
              >
                <i className="fas fa-user-plus"></i> &nbsp;Join Beta Test
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
