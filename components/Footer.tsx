"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [currentYear] = useState<string>(new Date().getFullYear().toString());

  return (
    <footer className="footer">
      <div className="footer-top">
        <Image
          src="/img/penxchain-logo.png"
          alt="PENXCHAIN Logo"
          className="footer-logo"
          width={150}
          height={150}
        />

        <div className="footer-links">
          <div className="footer-column">
            <h4>Sitemaps</h4>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="#">Wallet</Link>
              </li>
              <li>
                <Link href="#">Marketplace</Link>
              </li>
              <li>
                <Link href="/tribes">Tribes</Link>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/blog">Blogs/News</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>
                <Link href="#">Download Wallet</Link>
              </li>
              <li>
                <Link href="#">Download Marketplace</Link>
              </li>
              <li>
                <a
                  href="https://forms.gle/6VYv7HgRoMaAwv8D9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Beta Test
                </a>
              </li>
              <li>
                <a href="/docs/PENXCHAIN-WHITEPAPER IDO.pdf" download>
                  <i className="fas fa-file-alt"></i> Whitepaper
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a
                  href="https://x.com/penxchain_?s=21"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-x-twitter"></i> Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/Officialpenxchain"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-telegram"></i> Telegram
                </a>
              </li>
              <li>
                <Link href="#">
                  <i className="fab fa-discord"></i> Discord
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/penxchain/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </li>
              <li>
                <Link href="#">
                  <i className="fab fa-medium"></i> Medium
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Terms</h4>
            <ul>
              <li>
                <Link href="#">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>
          <span id="current-year">{currentYear}</span> &copy; <b>PENXCHAIN</b> |
          All rights reserved.
        </p>
        <p>
          <i className="fas fa-envelope"></i>
          <a
            href="mailto:admin@penxchain.com"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            &nbsp;admin@penxchain.com
          </a>
        </p>
      </div>
    </footer>
  );
}
