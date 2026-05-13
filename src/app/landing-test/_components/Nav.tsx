export default function Nav() {
  return (
    <nav>
      <a href="#hero" className="nav-logo">
        <div className="nav-logo-mark">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="#060608" stroke="#060608" strokeWidth="0"/>
            <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="#060608"/>
            <path d="M8 2L14 5.5M8 2L2 5.5M8 2V8M14 5.5V10.5M14 5.5L8 8M2 5.5V10.5M2 10.5L8 14M14 10.5L8 14M8 14V8M8 8L2 5.5M8 8L14 5.5" stroke="#060608" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        PENXCHAIN
      </a>

      <ul className="nav-links">
        <li className="nav-dropdown">
          <a href="#">Products ▾</a>
          <div className="nav-dropdown-menu">
            <a href="#wallet">PENX Wallet</a>
            <a href="#penxpay">PENXPAY</a>
            <a href="#commerce">Commerce App</a>
            <a href="#blockchain">L1 Blockchain</a>
          </div>
        </li>
        <li><a href="#ecosystem">Ecosystem</a></li>
        <li><a href="#tokenomics">Tokenomics</a></li>
        <li><a href="#blockchain">Developers</a></li>
        <li><a href="#community">Community</a></li>
        <li><a href="#wallet" className="nav-cta">Download Wallet</a></li>
      </ul>
    </nav>
  );
}
