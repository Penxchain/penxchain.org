export default function Blockchain() {
  return (
    <section id="blockchain">
      <div className="container">
        <div className="blockchain-inner">
          <div className="fade-in">
            <div className="section-eyebrow">Layer 1 Blockchain</div>
            <h2 className="section-title">Build the<br/><em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#ffb43c" }}>private web.</em></h2>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.65, marginTop: "16px", maxWidth: "440px" }}>PENXCHAIN L1 is a ZK-native execution environment for privacy-first applications. EVM compatible, developer-friendly, and designed to make privacy the default for any dApp.</p>
            <div className="tech-specs">
              <div className="spec-card">
                <div className="spec-val">10<span>k+</span></div>
                <div className="spec-label">TPS Capacity</div>
              </div>
              <div className="spec-card">
                <div className="spec-val">2<span>s</span></div>
                <div className="spec-label">Block Finality</div>
              </div>
              <div className="spec-card">
                <div className="spec-val">EVM</div>
                <div className="spec-label">Compatible</div>
              </div>
              <div className="spec-card">
                <div className="spec-val">ZK<span>✓</span></div>
                <div className="spec-label">Native Proofs</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
              <a href="#" className="btn-primary" style={{ background: "var(--accent)" }}>Start Building</a>
              <a href="#" className="btn-secondary">Read Docs</a>
              <a href="#" className="btn-ghost">Apply for Grant →</a>
            </div>
          </div>

          <div className="dev-cards fade-in">
            <a href="#" className="dev-card">
              <div className="dev-card-icon" style={{ background: "rgba(255,180,60,0.1)" }}>📄</div>
              <div>
                <div className="dev-card-title">Documentation</div>
                <div className="dev-card-desc">Guides, API reference, and SDK docs for building on PENXCHAIN L1.</div>
              </div>
            </a>
            <a href="#" className="dev-card">
              <div className="dev-card-icon" style={{ background: "rgba(0,229,180,0.1)" }}>🧪</div>
              <div>
                <div className="dev-card-title">Testnet Faucet</div>
                <div className="dev-card-desc">Get testnet PENX tokens and deploy your first private smart contract in minutes.</div>
              </div>
            </a>
            <a href="#" className="dev-card">
              <div className="dev-card-icon" style={{ background: "rgba(107,92,255,0.1)" }}>💻</div>
              <div>
                <div className="dev-card-title">GitHub</div>
                <div className="dev-card-desc">Explore open-source protocol code, contribute, and audit the ZK circuits.</div>
              </div>
            </a>
            <a href="#" className="dev-card">
              <div className="dev-card-icon" style={{ background: "rgba(255,77,109,0.1)" }}>🎓</div>
              <div>
                <div className="dev-card-title">Grant Program</div>
                <div className="dev-card-desc">Up to $250,000 in PENX grants for teams building on PENXCHAIN. Rolling applications.</div>
              </div>
            </a>
            <a href="#" className="dev-card">
              <div className="dev-card-icon" style={{ background: "rgba(0,229,180,0.1)" }}>⚙️</div>
              <div>
                <div className="dev-card-title">Run a Validator</div>
                <div className="dev-card-desc">Stake PENX, validate the network, and earn staking rewards. Permissionless.</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
