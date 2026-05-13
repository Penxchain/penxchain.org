export default function Products() {
  return (
    <section id="products">
      <div className="container">
        <div className="products-header fade-in">
          <div className="section-eyebrow">The Ecosystem</div>
          <h2 className="section-title">Four products.<br/>One privacy layer.</h2>
        </div>
        <div className="products-grid fade-in">
          <a href="#wallet" className="product-card accent-teal">
            <div className="product-tag tag-teal">Wallet</div>
            <div className="product-name">PENX Wallet</div>
            <div className="product-desc">A non-custodial, ZK-shielded wallet for storing, sending, and receiving digital assets with complete transaction privacy.</div>
            <ul className="product-features">
              <li>Zero-knowledge transaction shielding</li>
              <li>Non-custodial — you own your keys</li>
              <li>Multi-chain asset support</li>
              <li>Built-in PENXPAY integration</li>
            </ul>
            <span className="product-cta">Download free →</span>
          </a>
          <a href="#penxpay" className="product-card accent-purple">
            <div className="product-tag tag-purple">Payments</div>
            <div className="product-name">PENXPAY</div>
            <div className="product-desc">A private payment protocol for merchants and buyers — accept and make payments without exposing transaction data to third parties.</div>
            <ul className="product-features">
              <li>Private merchant checkout</li>
              <li>0% platform fees on ZK settlements</li>
              <li>No chargebacks, instant finality</li>
              <li>Fiat on/off ramp support</li>
            </ul>
            <span className="product-cta" style={{ color: "#a89aff" }}>Integrate now →</span>
          </a>
          <a href="#commerce" className="product-card accent-red">
            <div className="product-tag tag-red">Commerce</div>
            <div className="product-name">Commerce App</div>
            <div className="product-desc">A social-commerce application where you can buy and sell goods privately — think Instagram Shopping, but with ZK privacy and no data harvesting.</div>
            <ul className="product-features">
              <li>Social storefront + product listings</li>
              <li>Private ZK checkout flow</li>
              <li>Get paid in PENX or stablecoins</li>
              <li>Zero platform surveillance</li>
            </ul>
            <span className="product-cta" style={{ color: "#ff6b85" }}>Open marketplace →</span>
          </a>
          <a href="#blockchain" className="product-card accent-amber">
            <div className="product-tag tag-amber">Layer 1</div>
            <div className="product-name">PENXCHAIN L1</div>
            <div className="product-desc">A ZK-native Layer 1 blockchain built for privacy-first applications — DeFi, identity, commerce, and messaging with programmable privacy.</div>
            <ul className="product-features">
              <li>ZK-SNARK native execution layer</li>
              <li>EVM compatible smart contracts</li>
              <li>2-second block finality</li>
              <li>Validator staking &amp; grant program</li>
            </ul>
            <span className="product-cta" style={{ color: "#ffb43c" }}>Start building →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
