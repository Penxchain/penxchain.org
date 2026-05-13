export default function Blog() {
  return (
    <section id="blog">
      <div className="container">
        <div className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="section-eyebrow">Privacy Blog</div>
            <h2 className="section-title">Why privacy<br/>matters now.</h2>
          </div>
          <a href="#" style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>All articles →</a>
        </div>
        <div className="blog-grid fade-in">
          <a href="#" className="blog-card">
            <div className="blog-thumb bg1">🔐</div>
            <div className="blog-body">
              <div className="blog-tag">ZK Technology</div>
              <div className="blog-title">How ZK-SNARKs make private on-chain payments possible</div>
              <div className="blog-excerpt">A technical walkthrough of zero-knowledge proofs — and why they're the foundation of the private financial internet.</div>
            </div>
          </a>
          <a href="#" className="blog-card">
            <div className="blog-thumb bg2">🛍️</div>
            <div className="blog-body">
              <div className="blog-tag">Commerce</div>
              <div className="blog-title">Why your purchase history is worth more to platforms than to you</div>
              <div className="blog-excerpt">Every click, cart add, and checkout feeds surveillance capitalism. Here's how private commerce changes the equation.</div>
            </div>
          </a>
          <a href="#" className="blog-card">
            <div className="blog-thumb bg3">🌍</div>
            <div className="blog-body">
              <div className="blog-tag">Policy</div>
              <div className="blog-title">Financial privacy is a human right — and blockchain finally makes it achievable</div>
              <div className="blog-excerpt">From unbanked populations to journalists to everyday buyers — the case for private money goes far beyond crypto.</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
