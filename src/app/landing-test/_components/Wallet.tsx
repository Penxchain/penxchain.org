export default function Wallet() {
  return (
    <section id="wallet">
      <div className="container">
        <div className="wallet-inner">
          <div className="wallet-mockup fade-in">
            <div style={{ position: "relative" }}>
              <div className="phone-frame" style={{ animation: "float 4s ease-in-out infinite" }}>
                <div className="phone-screen">
                  <div className="phone-header">
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>PENX</span>
                    <div style={{ width: "24px", height: "24px", background: "var(--surface2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🔔</div>
                  </div>
                  <div className="phone-privacy-badge">
                    <div className="phone-privacy-badge-dot"></div>
                    <span className="phone-privacy-text">ZK SHIELDED — PRIVATE MODE ON</span>
                  </div>
                  <div className="phone-balance">
                    <div className="phone-balance-label">Total Balance</div>
                    <div className="phone-balance-val">$4,821</div>
                    <div className="phone-balance-sub">+ 2.4% 24h</div>
                  </div>
                  <div className="phone-actions">
                    <div className="phone-action"><span className="phone-action-icon">↑</span>Send</div>
                    <div className="phone-action"><span className="phone-action-icon">↓</span>Receive</div>
                    <div className="phone-action"><span className="phone-action-icon">⇄</span>Swap</div>
                  </div>
                  <div className="phone-tx-list">
                    <div className="phone-tx">
                      <div className="phone-tx-left">
                        <div className="phone-tx-icon">🛍️</div>
                        <div>
                          <div className="phone-tx-name">Commerce</div>
                          <div className="phone-tx-sub">Private tx</div>
                        </div>
                      </div>
                      <div className="phone-tx-val">−42 PENX</div>
                    </div>
                    <div className="phone-tx">
                      <div className="phone-tx-left">
                        <div className="phone-tx-icon">💸</div>
                        <div>
                          <div className="phone-tx-name">Received</div>
                          <div className="phone-tx-sub">Shielded</div>
                        </div>
                      </div>
                      <div className="phone-tx-val" style={{ color: "var(--accent)" }}>+200 PENX</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div style={{ position: "absolute", bottom: "-16px", right: "-24px", background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "12px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>🔐</span>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Non-custodial</div>
                  <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Your keys only</div>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-in">
            <div className="section-eyebrow">PENX Wallet</div>
            <h2 className="section-title">Privacy-first.<br/>Non-custodial.<br/><em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>Yours.</em></h2>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.65, marginTop: "16px", maxWidth: "460px" }}>The PENX Wallet is the gateway to the PENXCHAIN ecosystem. Manage assets, make private payments, and interact with dApps — without ever exposing your identity.</p>
            <div className="download-buttons">
              <a href="#" className="download-btn">
                <span className="download-btn-icon">📱</span>
                <div>
                  <div className="download-btn-sub">App Store</div>
                  <div className="download-btn-label">iOS</div>
                </div>
              </a>
              <a href="#" className="download-btn">
                <span className="download-btn-icon">🤖</span>
                <div>
                  <div className="download-btn-sub">Google Play</div>
                  <div className="download-btn-label">Android</div>
                </div>
              </a>
              <a href="#" className="download-btn">
                <span className="download-btn-icon">🌐</span>
                <div>
                  <div className="download-btn-sub">Browser</div>
                  <div className="download-btn-label">Extension</div>
                </div>
              </a>
            </div>
            <div className="wallet-features">
              <div className="wallet-feature">
                <div className="wallet-feature-icon">🛡️</div>
                <div>
                  <div className="wallet-feature-title">Zero-knowledge shielding</div>
                  <div className="wallet-feature-desc">Every transaction is wrapped in a ZK-SNARK proof. Amounts and counterparties stay private on-chain.</div>
                </div>
              </div>
              <div className="wallet-feature">
                <div className="wallet-feature-icon">🔑</div>
                <div>
                  <div className="wallet-feature-title">You own your keys</div>
                  <div className="wallet-feature-desc">Fully non-custodial. Your seed phrase never leaves your device. No telemetry. No accounts required.</div>
                </div>
              </div>
              <div className="wallet-feature">
                <div className="wallet-feature-icon">⚡</div>
                <div>
                  <div className="wallet-feature-title">Built-in PENXPAY</div>
                  <div className="wallet-feature-desc">Pay any merchant or request payments natively from your wallet — no separate app needed.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
