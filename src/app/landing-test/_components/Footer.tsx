export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="#hero" className="nav-logo" style={{ textDecoration: "none" }}>
              <div className="nav-logo-mark">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2L14 5.5M8 2L2 5.5M8 2V8M14 5.5V10.5M14 5.5L8 8M2 5.5V10.5M2 10.5L8 14M14 10.5L8 14M8 14V8M8 8L2 5.5M8 8L14 5.5" stroke="#060608" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
              PENXCHAIN
            </a>
            <p>The ZK privacy blockchain ecosystem powering private commerce, payments, and sovereign digital identity.</p>
          </div>
          <div>
            <div className="footer-col-title">Products</div>
            <ul className="footer-links">
              <li><a href="#wallet">PENX Wallet</a></li>
              <li><a href="#penxpay">PENXPAY</a></li>
              <li><a href="#commerce">Commerce App</a></li>
              <li><a href="#blockchain">L1 Blockchain</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Developers</div>
            <ul className="footer-links">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Testnet</a></li>
              <li><a href="#">Grant Program</a></li>
              <li><a href="#">Validators</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#community">Community</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 PENXCHAIN. All rights reserved. Built for the private internet.</span>
          <div className="footer-social">
            <a href="#">𝕏</a>
            <a href="#">💬</a>
            <a href="#">📱</a>
            <a href="#">🐙</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
