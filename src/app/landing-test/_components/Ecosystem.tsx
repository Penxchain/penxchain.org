export default function Ecosystem() {
  return (
    <section id="ecosystem">
      <div className="container">
        <div className="ecosystem-inner">
          <div className="fade-in">
            <div className="section-eyebrow">Ecosystem</div>
            <h2 className="section-title">Built to<br/><em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>grow with you.</em></h2>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.65, marginTop: "16px", maxWidth: "440px" }}>PENXCHAIN is a complete privacy ecosystem. Every product connects to every other product — all secured by the same ZK Layer 1 beneath.</p>
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>🤝</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Partner Integrations</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>DeFi protocols, NFT marketplaces, and fiat gateways integrating with PENXCHAIN.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>⚡</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Validator Network</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>Permissionless validator set. Stake PENX, secure the network, earn rewards.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>🔬</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Research &amp; Audits</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>Ongoing ZK circuit research and quarterly third-party security audits.</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "28px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="#" className="btn-primary">Become a Validator</a>
              <a href="#" className="btn-secondary">Partner With Us</a>
            </div>
          </div>

          <div className="fade-in">
            <div className="ecosystem-map">
              <div className="ecosystem-center">PENX<br/>L1</div>
              <div className="ecosystem-nodes">
                <div className="eco-node">
                  <div className="eco-node-icon">👛</div>
                  <div className="eco-node-name">PENX Wallet</div>
                  <div className="eco-node-type">Non-custodial</div>
                </div>
                <div className="eco-node">
                  <div className="eco-node-icon">💳</div>
                  <div className="eco-node-name">PENXPAY</div>
                  <div className="eco-node-type">Private payments</div>
                </div>
                <div className="eco-node">
                  <div className="eco-node-icon">🛍️</div>
                  <div className="eco-node-name">Commerce</div>
                  <div className="eco-node-type">Social marketplace</div>
                </div>
                <div className="eco-node">
                  <div className="eco-node-icon">🏗️</div>
                  <div className="eco-node-name">dApps</div>
                  <div className="eco-node-type">3rd party builders</div>
                </div>
              </div>
            </div>
            <div className="partners-grid" style={{ marginTop: "16px" }}>
              <div className="partner-tile">Chainlink</div>
              <div className="partner-tile">LayerZero</div>
              <div className="partner-tile">Uniswap</div>
              <div className="partner-tile">Axelar</div>
              <div className="partner-tile">Circle</div>
              <div className="partner-tile">Alchemy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
