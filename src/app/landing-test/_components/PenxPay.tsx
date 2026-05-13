export default function PenxPay() {
  return (
    <section id="penxpay" style={{ background: "var(--deep)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <div className="penxpay-inner">
          <div className="fade-in">
            <div className="section-eyebrow">PENXPAY</div>
            <h2 className="section-title">Payments without<br/>a <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#a89aff" }}>paper trail.</em></h2>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.65, marginTop: "16px", maxWidth: "440px" }}>PENXPAY is a privacy-native payment protocol for merchants and buyers. Accept payments globally with zero platform fees on ZK-settled transactions.</p>
            <div className="flow-steps">
              <div className="flow-step">
                <div className="flow-step-num">01</div>
                <div>
                  <div className="flow-step-title">Connect your wallet</div>
                  <div className="flow-step-desc">Link your PENX Wallet or integrate via our merchant API. No KYC required for private peer-to-peer payments.</div>
                </div>
              </div>
              <div className="flow-step">
                <div className="flow-step-num">02</div>
                <div>
                  <div className="flow-step-title">Transact privately</div>
                  <div className="flow-step-desc">Buyers complete checkout. ZK proof verifies payment validity without revealing amounts or identities.</div>
                </div>
              </div>
              <div className="flow-step">
                <div className="flow-step-num">03</div>
                <div>
                  <div className="flow-step-title">Settle instantly</div>
                  <div className="flow-step-desc">Funds reach the merchant in 2 seconds with finality. Withdraw in PENX, stablecoins, or via fiat off-ramp.</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <a href="#" className="btn-primary" style={{ background: "#a89aff", color: "var(--black)" }}>Get Merchant Access</a>
              <a href="#" className="btn-secondary">View API Docs</a>
            </div>
          </div>

          <div className="fade-in">
            <div className="comparison-table">
              <div className="comparison-row header">
                <div>Feature</div>
                <div style={{ textAlign: "center" }}>PENXPAY</div>
                <div style={{ textAlign: "center" }}>Stripe</div>
                <div style={{ textAlign: "center" }}>PayPal</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-label">Private transactions</div>
                <div className="comparison-val val-yes">✓</div>
                <div className="comparison-val val-no">✗</div>
                <div className="comparison-val val-no">✗</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-label">Platform fees</div>
                <div className="comparison-val" style={{ textAlign: "center", fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>0%</div>
                <div className="comparison-val" style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)" }}>2.9%+</div>
                <div className="comparison-val" style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)" }}>3.49%+</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-label">Settlement time</div>
                <div className="comparison-val" style={{ textAlign: "center", fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>2s</div>
                <div className="comparison-val" style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)" }}>2–7 days</div>
                <div className="comparison-val" style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)" }}>Instant*</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-label">Chargebacks</div>
                <div className="comparison-val val-no">✗</div>
                <div className="comparison-val val-yes" style={{ color: "var(--muted)" }}>✓</div>
                <div className="comparison-val val-yes" style={{ color: "var(--muted)" }}>✓</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-label">No KYC required</div>
                <div className="comparison-val val-yes">✓</div>
                <div className="comparison-val val-no">✗</div>
                <div className="comparison-val val-no">✗</div>
              </div>
              <div className="comparison-row">
                <div className="comparison-label">Global access</div>
                <div className="comparison-val val-yes">✓</div>
                <div className="comparison-val" style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)" }}>Limited</div>
                <div className="comparison-val" style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)" }}>Limited</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
