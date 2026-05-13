export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-bg">
        <div className="hero-grid"></div>
        <div className="hero-orb1"></div>
        <div className="hero-orb2"></div>
      </div>
      <div className="container">
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 400px", gap: "60px", alignItems: "center" }}>
          <div className="hero-inner" style={{ padding: "0", maxWidth: "none" }}>
            <div className="hero-badge">
              <div className="hero-badge-dot"></div>
              ZK Privacy Layer 1 — Now Live on Testnet
            </div>
            <h1 className="hero-h1">The internet<br/>of <em>private</em><br/>commerce.</h1>
            <p className="hero-sub">PENXCHAIN is the ZK privacy blockchain ecosystem powering private payments, anonymous e-commerce, and sovereign digital identity — on-chain.</p>
            <div className="hero-ctas">
              <a href="#wallet" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/><circle cx="11.5" cy="10" r="1" fill="currentColor"/></svg>
                Download Wallet
              </a>
              <a href="#commerce" className="btn-secondary">Start Selling</a>
              <a href="#blockchain" className="btn-ghost">Explore the Chain →</a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-val">$0 fees</div>
                <div className="hero-stat-label">ZK shielded txs</div>
              </div>
              <div>
                <div className="hero-stat-val">2s</div>
                <div className="hero-stat-label">Finality</div>
              </div>
              <div>
                <div className="hero-stat-val">100%</div>
                <div className="hero-stat-label">Non-custodial</div>
              </div>
              <div>
                <div className="hero-stat-val">4</div>
                <div className="hero-stat-label">Core products</div>
              </div>
            </div>
          </div>

          {/* Hero right: ZK Proof viz */}
          <div style={{ position: "relative", animation: "fadeUp 0.9s ease 0.5s both" }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(0,229,180,0.06), transparent)", pointerEvents: "none" }}></div>
              <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px", opacity: 0.7 }}>ZK PROOF — LIVE</div>
              {/* Proof Animation */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Prover</span>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <div style={{ width: "60px", height: "2px", background: "linear-gradient(to right, var(--accent), transparent)" }}></div>
                    <span style={{ fontSize: "10px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>π</span>
                    <div style={{ width: "60px", height: "2px", background: "linear-gradient(to right, transparent, var(--accent))" }}></div>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Verifier</span>
                </div>
                <div style={{ background: "rgba(0,229,180,0.04)", border: "1px solid rgba(0,229,180,0.15)", borderRadius: "10px", padding: "10px 14px" }}>
                  <div style={{ fontSize: "10px", color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: "6px", opacity: 0.7 }}>witness</div>
                  <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em", wordBreak: "break-all", lineHeight: 1.6 }}>0x7f3a…c91b ✓ valid</div>
                </div>
              </div>
              {/* Transaction items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", background: "var(--accent)", borderRadius: "50%", animation: "blink 1.4s ease-in-out infinite" }}></div>
                    <span style={{ fontSize: "12px", color: "var(--text)", fontWeight: 600 }}>Private transfer</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>SHIELDED</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", background: "var(--accent)", borderRadius: "50%", animation: "blink 2s ease-in-out infinite 0.4s" }}></div>
                    <span style={{ fontSize: "12px", color: "var(--text)", fontWeight: 600 }}>Commerce purchase</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>SHIELDED</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", background: "var(--accent)", borderRadius: "50%", animation: "blink 1.8s ease-in-out infinite 0.8s" }}></div>
                    <span style={{ fontSize: "12px", color: "var(--text)", fontWeight: 600 }}>ZK identity proof</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>VERIFIED</span>
                </div>
              </div>
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>No metadata exposed</span>
                <span style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)", background: "rgba(0,229,180,0.08)", padding: "3px 10px", borderRadius: "6px", border: "1px solid rgba(0,229,180,0.15)" }}>ZK-SNARK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="trust-bar" style={{ marginTop: "60px" }}>
          <div className="trust-item"><div className="trust-dot"></div>Audited by CertiK</div>
          <div className="trust-item"><div className="trust-dot"></div>Non-custodial</div>
          <div className="trust-item"><div className="trust-dot"></div>Open-source protocol</div>
          <div className="trust-item"><div className="trust-dot"></div>ZK-SNARK proofs</div>
          <div className="trust-item"><div className="trust-dot"></div>No metadata collection</div>
          <div className="trust-item"><div className="trust-dot"></div>EVM compatible</div>
        </div>
      </div>
    </section>
  );
}
