export default function Roadmap() {
  return (
    <section id="roadmap" style={{ background: "var(--deep)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "100px 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
          <div className="fade-in">
            <div className="section-eyebrow">Roadmap</div>
            <h2 className="section-title">Building in<br/><em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>public.</em></h2>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.65, marginTop: "16px", maxWidth: "380px" }}>PENXCHAIN ships in public. Every milestone is on-chain-verifiable. No vaporware, no mystery timelines.</p>
            <div style={{ marginTop: "32px" }}>
              <a href="#" className="btn-primary">Join Waitlist for Early Access</a>
            </div>
          </div>
          <div className="roadmap-timeline fade-in">
            <div className="roadmap-item done">
              <div className="roadmap-q">Q1 2025 — Shipped</div>
              <div className="roadmap-title">Foundation</div>
              <div className="roadmap-items-list">
                <span className="roadmap-chip done">ZK circuit design</span>
                <span className="roadmap-chip done">Whitepaper v1</span>
                <span className="roadmap-chip done">Team formed</span>
              </div>
            </div>
            <div className="roadmap-item done">
              <div className="roadmap-q">Q2 2025 — Shipped</div>
              <div className="roadmap-title">Testnet Alpha</div>
              <div className="roadmap-items-list">
                <span className="roadmap-chip done">L1 testnet live</span>
                <span className="roadmap-chip done">Wallet beta (iOS)</span>
                <span className="roadmap-chip done">CertiK audit</span>
              </div>
            </div>
            <div className="roadmap-item active">
              <div className="roadmap-q">Q3 2025 — In Progress</div>
              <div className="roadmap-title">Product Launch</div>
              <div className="roadmap-items-list">
                <span className="roadmap-chip done">PENXPAY beta</span>
                <span className="roadmap-chip">Commerce app</span>
                <span className="roadmap-chip">Android wallet</span>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-q">Q4 2025</div>
              <div className="roadmap-title">Mainnet</div>
              <div className="roadmap-items-list">
                <span className="roadmap-chip">L1 mainnet launch</span>
                <span className="roadmap-chip">Exchange listings</span>
                <span className="roadmap-chip">Grant program</span>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-q">2026</div>
              <div className="roadmap-title">Scale</div>
              <div className="roadmap-items-list">
                <span className="roadmap-chip">Cross-chain bridges</span>
                <span className="roadmap-chip">ZK identity</span>
                <span className="roadmap-chip">DAO governance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
