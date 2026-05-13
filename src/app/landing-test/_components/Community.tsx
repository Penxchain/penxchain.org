export default function Community() {
  return (
    <section id="community" style={{ padding: "100px 0" }}>
      <div className="container">
        <div className="fade-in" style={{ textAlign: "center", maxWidth: "540px", margin: "0 auto 52px" }}>
          <div className="section-eyebrow">Community</div>
          <h2 className="section-title">Join the privacy<br/><em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>movement.</em></h2>
          <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.65, marginTop: "16px" }}>PENXCHAIN is built by and for the privacy-native community. Help shape the protocol, earn rewards, and be part of what comes next.</p>
        </div>
        <div className="community-grid fade-in">
          <a href="#" className="community-card">
            <span className="community-icon">💬</span>
            <div className="community-name">Discord</div>
            <div className="community-desc">Live community chat, builder channels, governance debates, and direct access to the PENXCHAIN team.</div>
            <div className="community-join">Join 14,200+ members →</div>
          </a>
          <a href="#" className="community-card">
            <span className="community-icon">🐦</span>
            <div className="community-name">X / Twitter</div>
            <div className="community-desc">Protocol updates, ecosystem news, and privacy advocacy. Follow for daily content from the core team.</div>
            <div className="community-join">Follow @PENXCHAIN →</div>
          </a>
          <a href="#" className="community-card">
            <span className="community-icon">✍️</span>
            <div className="community-name">Newsletter</div>
            <div className="community-desc">Weekly privacy insights, PENXCHAIN development updates, and early access announcements straight to your inbox.</div>
            <div className="community-join">Subscribe free →</div>
          </a>
        </div>
        {/* Email capture */}
        <div className="fade-in" style={{ marginTop: "52px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "48px", textAlign: "center", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Stay in the loop</div>
          <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "8px" }}>Get early access</h3>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "28px", lineHeight: 1.6 }}>Be first to know when mainnet launches, new products drop, and grant applications open.</p>
          <div style={{ display: "flex", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
            <input type="email" placeholder="your@email.com" style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "var(--text)", fontFamily: "var(--font-head)", outline: "none" }} />
            <button className="btn-primary" style={{ whiteSpace: "nowrap", border: "none", cursor: "pointer" }}>Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  );
}
