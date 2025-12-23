"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

type PlatformType = "google" | "apple";

export default function Hero() {
  const [count, setCount] = useState<number>(100);
  const [testimonialText, setTestimonialText] = useState<string>("");
  const [charIndex, setCharIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0);
  const sparklesRef = useRef<HTMLDivElement>(null);

  // Counter animation
  useEffect(() => {
    const target = 25000;
    const increment = target / 100;
    let current = 100;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  // Sparkles effect
  useEffect(() => {
    if (sparklesRef.current) {
      for (let i = 0; i < 25; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.left = Math.random() * 100 + "vw";
        sparkle.style.bottom = "-20px";
        sparkle.style.animationDuration = 4 + Math.random() * 2 + "s";
        sparkle.style.animationDelay = Math.random() * 5 + "s";
        sparklesRef.current.appendChild(sparkle);
      }
    }
  }, []);

  // Typing effect
  useEffect(() => {
    const testimonials: string[] = [
      '"PENXCHAIN is the future of privacy." — <strong>Sarah A.</strong>',
      '"I finally trust my wallet again." — <strong>Oluwasegun M.</strong>',
      '"Clean UI and serious security." — <strong>Dev Marvelee</strong>',
      '"This feels built for the next generation." — <strong>Taiwo K.</strong>',
      '"Fast transactions and zero stress." — <strong>Amina S.</strong>',
      '"Africa needs platforms like this." — <strong>Chinedu E.</strong>',
      '"Private, simple, and powerful." — <strong>Sadiq M.</strong>',
      '"This is real decentralization." — <strong>Funke O.</strong>',
      '"The UX is honestly impressive." — <strong>James T.</strong>',
      '"Everything just works smoothly." — <strong>Oliver B.</strong>',
      '"Finally, privacy done right." — <strong>Emily R.</strong>',
      '"Feels premium without being complicated." — <strong>Daniel W.</strong>',
      '"I moved my assets here instantly." — <strong>Sophia L.</strong>',
      '"One of the cleanest Web3 platforms." — <strong>Harry C.</strong>',
      '"Security without sacrificing speed." — <strong>Amelia N.</strong>',
      '"My wallet has never felt safer." — <strong>Isabella R.</strong>',
      '"Fast, secure, and user-friendly." — <strong>Michael P.</strong>',
      '"This is how blockchain should feel." — <strong>Jason K.</strong>',
      '"The marketplace is insanely smooth." — <strong>Lauren D.</strong>',
      '"I love how intuitive everything is." — <strong>Brandon S.</strong>',
      '"A serious project with real vision." — <strong>Anthony M.</strong>',
      '"This is the next big thing." — <strong>Diego F.</strong>',
      '"Trustworthy and innovative." — <strong>Noah H.</strong>',
      '"Privacy-first done properly." — <strong>Chloe M.</strong>',
      '"Cross-platform experience is flawless." — <strong>Ethan R.</strong>',
      '"I feel in control of my assets." — <strong>Priya S.</strong>',
      '"This is what Web3 should be." — <strong>Lucas T.</strong>',
      '"Clean design, powerful backend." — <strong>Aisha K.</strong>',
      '"Amazing community and support." — <strong>Grace O.</strong>',
    ];

    const currentText = testimonials[testimonialIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting && charIndex < currentText.length) {
          setTestimonialText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else if (isDeleting && charIndex > 0) {
          setTestimonialText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else if (!isDeleting && charIndex === currentText.length) {
          setTimeout(() => setIsDeleting(true), 3000);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setTestimonialIndex((testimonialIndex + 1) % testimonials.length);
        }
      },
      isDeleting ? 20 : 40
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, testimonialIndex]);

  // Toast + Confetti helpers
  const showToast = (message: string, duration: number = 3000): void => {
    const toast = document.getElementById("coming-soon-toast");
    if (!toast) return;
    toast.innerHTML = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), duration);
  };

  const createConfetti = async (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 3
  ): Promise<void> => {
    try {
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default || confettiModule;
      const duration = 1600;
      const end = Date.now() + duration;
      const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF"];

      const origin = {
        x: Math.max(0, Math.min(1, x / window.innerWidth)),
        y: Math.max(0, Math.min(1, y / window.innerHeight)),
      };

      (function frame(): void {
        confetti({
          particleCount: 6,
          startVelocity: 30,
          spread: 160,
          ticks: 60,
          origin,
          colors,
        });
        confetti({
          particleCount: 8,
          startVelocity: 18,
          spread: 120,
          ticks: 80,
          origin,
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    } catch (err) {
      // fallback: small DOM-free visual (no-op)
      console.warn("confetti failed", err);
    }
  };

  const handleStoreClick = (
    platform: PlatformType,
    e: React.MouseEvent<HTMLAnchorElement>
  ): void => {
    if (e && e.preventDefault) e.preventDefault();
    const message = `🎉 Wow — you just discovered an upcoming feature! Early access is coming soon; we'll notify you when ${
      platform === "google" ? "the Android app" : "the iOS app"
    } is available.`;
    showToast(message, 3000);
    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 3;
    createConfetti(x, y);
  };

  const handleComingSoon = (type: "wallet" | "marketplace"): void => {
    const toast = document.getElementById("coming-soon-toast");
    let message = "";

    if (type === "wallet") {
      message = "🚀 PENXCHAIN Wallet is Coming Soon!";
    } else if (type === "marketplace") {
      message = "🛒 Marketplace access is Coming Soon!";
    }

    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 4000);
    }
  };

  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <div id="sparkles-container" ref={sparklesRef}></div>

          <div className="hero-info-group">
            <div className="dudes-group">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="dude-wrapper">
                  <Image
                    src={`/img/dude${num}.png`}
                    alt={`User ${num}`}
                    width={35}
                    height={35}
                    onContextMenu={(e: React.MouseEvent<HTMLImageElement>) =>
                      e.preventDefault()
                    }
                  />
                </div>
              ))}
            </div>

            <div className="rating-text-box">
              <div className="star-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <p className="hero-rating-text">
                <span className="count">{count.toLocaleString()}</span>+ Users,
                984 Cities, 56 Countries
              </p>
            </div>
          </div>

          <h1>
            Primary CTAs for Wallet & Marketplace, Concise Value Proposition
          </h1>
          <p>
            Your privacy-focused Decentralized Ecosystem with Zero-Knowledge
            Proofs (ZKPs)
          </p>

          <div className="hero-buttons">
            <a
              href="#"
              className="hero-btn coming-soon-btn"
              onClick={(e) => {
                e.preventDefault();
                handleComingSoon("wallet");
              }}
            >
              <i className="fas fa-download"></i> Download Wallet
              <span className="soon-tag">Coming Soon</span>
            </a>

            <a
              href="#"
              className="hero-btn coming-soon-btn"
              onClick={(e) => {
                e.preventDefault();
                handleComingSoon("marketplace");
              }}
            >
              <i className="fas fa-store"></i> Enter Marketplace
              <span className="soon-tag">Coming Soon</span>
            </a>
          </div>

          <div id="coming-soon-toast" className="coming-soon-toast">
            Coming Soon
          </div>

          <div className="store-buttons">
            <a
              href="#"
              className="store-btn"
              onClick={(e) => handleStoreClick("google", e)}
            >
              <i className="fab fa-google-play"></i>
              <div className="text">
                <span className="top">GET IT ON</span>
                <span className="bottom">Google Play</span>
              </div>
            </a>

            <a
              href="#"
              className="store-btn"
              onClick={(e) => handleStoreClick("apple", e)}
            >
              <i className="fab fa-apple"></i>
              <div className="text">
                <span className="top">Download on the</span>
                <span className="bottom">App Store</span>
              </div>
            </a>
          </div>

          <div className="testimonial-rotator">
            <span dangerouslySetInnerHTML={{ __html: testimonialText }}></span>
            <span className="blinking-cursor">|</span>
          </div>
        </div>
      </div>
    </section>
  );
}
