export default function Audiences() {
  return (
    <section id="audiences">
      <div className="container">
        <div className="section-eyebrow">Built for everyone who values privacy</div>
        <h2 className="section-title">Who uses PENXCHAIN?</h2>
        <p className="section-subtitle">Whether you're a trader, merchant, developer, or privacy advocate — PENXCHAIN is your gateway to a private financial internet.</p>
        <div className="audience-grid fade-in">
          <a href="#why-zk" className="audience-card">
            <span className="audience-icon">🔐</span>
            <div className="audience-title">Privacy Natives</div>
            <div className="audience-desc">Transact with zero data exposure. Your money, your business.</div>
          </a>
          <a href="#blockchain" className="audience-card">
            <span className="audience-icon">⛓️</span>
            <div className="audience-title">Web3 Natives</div>
            <div className="audience-desc">Build and deploy on a ZK-native L1 with EVM compatibility.</div>
          </a>
          <a href="#penxpay" className="audience-card">
            <span className="audience-icon">📈</span>
            <div className="audience-title">Crypto Traders</div>
            <div className="audience-desc">Trade and settle privately. No front-running, no surveillance.</div>
          </a>
          <a href="#commerce" className="audience-card">
            <span className="audience-icon">🛍️</span>
            <div className="audience-title">Buyers &amp; Sellers</div>
            <div className="audience-desc">Shop and sell in PENX Commerce without exposing spending habits.</div>
          </a>
          <a href="#wallet" className="audience-card">
            <span className="audience-icon">👛</span>
            <div className="audience-title">Wallet Users</div>
            <div className="audience-desc">A non-custodial wallet with privacy baked in at the protocol level.</div>
          </a>
        </div>
      </div>
    </section>
  );
}
