export default function WhyZk() {
  return (
    <section id="why-zk" style={{ padding: "100px 0" }}>
      <div className="container">
        <div className="why-zk-inner">
          <div>
            <div className="section-eyebrow fade-in">Why ZK Privacy</div>
            <h2 className="section-title fade-in">The problem with<br/><em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>visible</em> money</h2>
            <div className="why-zk-panels" style={{ marginTop: "36px" }}>
              <div className="zk-panel fade-in">
                <div className="zk-panel-num">01 / THE PROBLEM</div>
                <div className="zk-panel-title">Every transaction is a surveillance event</div>
                <div className="zk-panel-text">Public blockchains expose your wallet address, balance, counterparties, and spending patterns to anyone. Your financial life is an open ledger.</div>
              </div>
              <div className="zk-panel active fade-in">
                <div className="zk-panel-num">02 / THE SOLUTION</div>
                <div className="zk-panel-title">Zero-knowledge proofs verify without revealing</div>
                <div className="zk-panel-text">ZK-SNARKs let you prove "I have sufficient funds" or "I am over 18" without disclosing the underlying data. Valid proofs, zero exposure.</div>
              </div>
              <div className="zk-panel fade-in">
                <div className="zk-panel-num">03 / WHY PENXCHAIN</div>
                <div className="zk-panel-title">Privacy at the protocol level — not an add-on</div>
                <div className="zk-panel-text">PENXCHAIN builds ZK privacy into the L1 execution environment itself. Every product in the ecosystem inherits it by default — no opt-in required.</div>
              </div>
            </div>
          </div>
          <div className="why-zk-visual fade-in">
            <div style={{ padding: "28px", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px" }}>
              <div style={{ textAlign: "center", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>Transaction Flow</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px", display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "36px", height: "36px", background: "rgba(255,77,109,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>👤</div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>Sender (you)</div>
                    <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Balance: private</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 0" }}>
                  <div style={{ width: "1px", height: "16px", background: "var(--accent)", opacity: 0.3 }}></div>
                  <div style={{ background: "rgba(0,229,180,0.08)", border: "1px solid rgba(0,229,180,0.2)", borderRadius: "8px", padding: "6px 16px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>ZK-SNARK proof generated</div>
                  <div style={{ width: "1px", height: "16px", background: "var(--accent)", opacity: 0.3 }}></div>
                </div>
                <div style={{ background: "var(--surface2)", border: "1px solid rgba(0,229,180,0.15)", borderRadius: "10px", padding: "14px 18px", display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "36px", height: "36px", background: "rgba(0,229,180,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>⛓️</div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>PENXCHAIN L1</div>
                    <div style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>Proof verified ✓</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 0" }}>
                  <div style={{ width: "1px", height: "16px", background: "var(--accent)", opacity: 0.3 }}></div>
                  <div style={{ background: "rgba(0,229,180,0.08)", border: "1px solid rgba(0,229,180,0.2)", borderRadius: "8px", padding: "6px 16px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>Transfer settled privately</div>
                  <div style={{ width: "1px", height: "16px", background: "var(--accent)", opacity: 0.3 }}></div>
                </div>
                <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px", display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "36px", height: "36px", background: "rgba(107,92,255,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>👤</div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>Recipient</div>
                    <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Received: private</div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "8px", padding: "14px", background: "rgba(0,229,180,0.04)", border: "1px solid rgba(0,229,180,0.1)", borderRadius: "10px", textAlign: "center", fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>Chain observers see: zero useful metadata</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
