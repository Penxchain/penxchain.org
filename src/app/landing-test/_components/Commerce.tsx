"use client";

import { useState } from "react";

export default function Commerce() {
  const [activeTab, setActiveTab] = useState<"buyers" | "sellers">("buyers");

  return (
    <section id="commerce">
      <div className="container">
        <div className="commerce-inner">
          <div className="fade-in">
            <div className="section-eyebrow">Commerce App</div>
            <h2 className="section-title">Buy and sell.<br/>No one's <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#ff6b85" }}>watching.</em></h2>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.65, marginTop: "16px", maxWidth: "440px" }}>The PENX Commerce App combines social discovery with private checkout. Create a storefront, list products, and build a customer base — without handing your data to a platform.</p>
            <div className="commerce-tabs" style={{ marginTop: "32px" }}>
              <button 
                className={`commerce-tab ${activeTab === 'buyers' ? 'active' : ''}`} 
                onClick={() => setActiveTab('buyers')}
              >
                For Buyers
              </button>
              <button 
                className={`commerce-tab ${activeTab === 'sellers' ? 'active' : ''}`} 
                onClick={() => setActiveTab('sellers')}
              >
                For Sellers
              </button>
            </div>
            
            <div className={`commerce-content ${activeTab === 'buyers' ? 'active' : ''}`}>
              <div className="commerce-points">
                <div className="commerce-point">
                  <div className="point-icon">🔍</div>
                  <div>
                    <div className="point-title">Browse privately</div>
                    <div className="point-desc">Discover products on social feeds without building an ad profile. No tracking pixels, no behavioral data sold.</div>
                  </div>
                </div>
                <div className="commerce-point">
                  <div className="point-icon">🛒</div>
                  <div>
                    <div className="point-title">ZK-shielded checkout</div>
                    <div className="point-desc">Complete purchases with a ZK proof. The seller gets paid; your identity and spend history stay private.</div>
                  </div>
                </div>
                <div className="commerce-point">
                  <div className="point-icon">📦</div>
                  <div>
                    <div className="point-title">Verified goods, anonymous buyers</div>
                    <div className="point-desc">Product authenticity is on-chain. Your shipping address is only ever shared with the seller — never the platform.</div>
                  </div>
                </div>
              </div>
              <a href="#" className="btn-primary">Browse Marketplace</a>
            </div>
            
            <div className={`commerce-content ${activeTab === 'sellers' ? 'active' : ''}`}>
              <div className="commerce-points">
                <div className="commerce-point">
                  <div className="point-icon">🏪</div>
                  <div>
                    <div className="point-title">Launch your storefront</div>
                    <div className="point-desc">Set up a branded store in minutes. List physical or digital products with on-chain provenance.</div>
                  </div>
                </div>
                <div className="commerce-point">
                  <div className="point-icon">💰</div>
                  <div>
                    <div className="point-title">Get paid in PENX or stablecoins</div>
                    <div className="point-desc">Receive payments directly with no platform taking a cut. Settle instantly, withdraw any time.</div>
                  </div>
                </div>
                <div className="commerce-point">
                  <div className="point-icon">📊</div>
                  <div>
                    <div className="point-title">Private sales analytics</div>
                    <div className="point-desc">View your own revenue data — it lives in your wallet. No third-party analytics company has access.</div>
                  </div>
                </div>
              </div>
              <a href="#" className="btn-primary" style={{ background: "#ff6b85", color: "#fff" }}>Create Your Store</a>
            </div>
          </div>

          <div className="fade-in">
            <div className="commerce-card-mockup">
              <div className="storefront-header">
                <div>
                  <div className="store-name">PrivateCraft™</div>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>Handmade goods · 142 items</div>
                </div>
                <div className="store-verified">
                  <div className="hero-badge-dot" style={{ width: "6px", height: "6px" }}></div>
                  ZK VERIFIED
                </div>
              </div>
              <div className="product-grid-mock">
                <div className="product-card-mock">
                  <div className="product-img-mock" style={{ background: "linear-gradient(135deg,rgba(0,229,180,0.08),rgba(107,92,255,0.06))" }}>🎨</div>
                  <div className="product-info-mock">
                    <div className="product-name-mock">Artisan Print</div>
                    <div className="product-price-mock">12 PENX</div>
                  </div>
                </div>
                <div className="product-card-mock">
                  <div className="product-img-mock" style={{ background: "linear-gradient(135deg,rgba(255,180,60,0.08),rgba(255,77,109,0.06))" }}>🧴</div>
                  <div className="product-info-mock">
                    <div className="product-name-mock">Organic Soap</div>
                    <div className="product-price-mock">8 PENX</div>
                  </div>
                </div>
                <div className="product-card-mock">
                  <div className="product-img-mock" style={{ background: "linear-gradient(135deg,rgba(107,92,255,0.08),rgba(0,229,180,0.06))" }}>📿</div>
                  <div className="product-info-mock">
                    <div className="product-name-mock">Macramé Kit</div>
                    <div className="product-price-mock">24 PENX</div>
                  </div>
                </div>
                <div className="product-card-mock">
                  <div className="product-img-mock" style={{ background: "linear-gradient(135deg,rgba(255,77,109,0.08),rgba(255,180,60,0.06))" }}>🪡</div>
                  <div className="product-info-mock">
                    <div className="product-name-mock">Linen Cloth</div>
                    <div className="product-price-mock">16 PENX</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>All checkouts are ZK-shielded</div>
                <div style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "var(--font-mono)", background: "rgba(0,229,180,0.08)", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(0,229,180,0.15)" }}>PRIVATE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
