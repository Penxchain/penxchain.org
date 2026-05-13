export default function Tokenomics() {
  return (
    <section id="tokenomics">
      <div className="container">
        <div className="fade-in">
          <div className="section-eyebrow">Tokenomics</div>
          <h2 className="section-title">PENX Token</h2>
          <p className="section-subtitle">The native utility and governance token powering the entire PENXCHAIN ecosystem — from staking to fee settlement to governance.</p>
        </div>
        <div className="token-grid fade-in">
          <div className="token-card">
            <div className="token-card-pct">40<span>%</span></div>
            <div className="token-card-title">Ecosystem &amp; Rewards</div>
            <div className="token-card-desc">Commerce incentives, wallet rewards, and network staking rewards.</div>
            <div className="token-bar"><div className="token-bar-fill" style={{ width: "40%" }}></div></div>
          </div>
          <div className="token-card">
            <div className="token-card-pct">20<span>%</span></div>
            <div className="token-card-title">Team &amp; Advisors</div>
            <div className="token-card-desc">4-year vest with 12-month cliff. Aligned with long-term growth.</div>
            <div className="token-bar"><div className="token-bar-fill" style={{ width: "20%", background: "var(--accent2)" }}></div></div>
          </div>
          <div className="token-card">
            <div className="token-card-pct">20<span>%</span></div>
            <div className="token-card-title">Public &amp; Treasury</div>
            <div className="token-card-desc">Exchange listings, liquidity provision, and community treasury.</div>
            <div className="token-bar"><div className="token-bar-fill" style={{ width: "20%", background: "#ffb43c" }}></div></div>
          </div>
          <div className="token-card">
            <div className="token-card-pct">20<span>%</span></div>
            <div className="token-card-title">Grants &amp; Dev Fund</div>
            <div className="token-card-desc">Builder grants, protocol development, and security audits.</div>
            <div className="token-bar"><div className="token-bar-fill" style={{ width: "20%", background: "#ff6b85" }}></div></div>
          </div>
        </div>
        <div style={{ marginTop: "40px", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#" className="btn-primary">Buy PENX</a>
          <a href="#" className="btn-secondary">Read Whitepaper</a>
        </div>
      </div>
    </section>
  );
}
