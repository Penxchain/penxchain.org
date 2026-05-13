export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="fade-in">
            <div className="section-eyebrow">About PENXCHAIN</div>
            <h2 className="section-title">Privacy by<br/><em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>conviction,</em><br/>not compliance.</h2>
            <div className="manifesto">
              <div className="manifesto-line accent-line">Your money is your information.</div>
              <div className="manifesto-line">Every transaction should be between you and the recipient — not visible to the world.</div>
              <div className="manifesto-line">Privacy isn't a feature. It's a right baked into the protocol.</div>
              <div className="manifesto-line">We build with one principle: default to private, always.</div>
            </div>
          </div>
          <div className="fade-in">
            <div style={{ marginBottom: "24px", fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Core Team</div>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">👨💻</div>
                <div className="team-name">Alex Nakamura</div>
                <div className="team-role">CEO &amp; Co-founder</div>
              </div>
              <div className="team-card">
                <div className="team-avatar">👩🔬</div>
                <div className="team-name">Dr. Ife Okonkwo</div>
                <div className="team-role">Chief Cryptographer</div>
              </div>
              <div className="team-card">
                <div className="team-avatar">👨🎨</div>
                <div className="team-name">Marco Reyes</div>
                <div className="team-role">Head of Product</div>
              </div>
              <div className="team-card">
                <div className="team-avatar">👩💼</div>
                <div className="team-name">Priya Sharma</div>
                <div className="team-role">Head of Ecosystem</div>
              </div>
            </div>
            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="#" className="btn-secondary">Press Kit</a>
              <a href="#" className="btn-ghost">media@penxchain.io →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
