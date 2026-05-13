export default function CtaFinal() {
  return (
    <section id="cta-final">
      <div className="cta-orb"></div>
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <h2 className="cta-title fade-in">Privacy is<br/><em>not optional.</em></h2>
        <p className="cta-sub fade-in">Download the PENX Wallet and step into the private financial internet — today.</p>
        <div className="cta-buttons fade-in">
          <a href="#wallet" className="btn-primary" style={{ fontSize: "15px", padding: "16px 28px" }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/><circle cx="11.5" cy="10" r="1" fill="currentColor"/></svg>
            Download Wallet — Free
          </a>
          <a href="#commerce" className="btn-secondary" style={{ fontSize: "15px", padding: "16px 28px" }}>Open Marketplace</a>
          <a href="#blockchain" className="btn-ghost" style={{ fontSize: "15px", padding: "16px 28px" }}>Build on L1 →</a>
        </div>
      </div>
    </section>
  );
}
