"use client";

import { useEffect } from "react";
import Nav from "./_components/Nav";
import Hero from "./_components/Hero";
import Audiences from "./_components/Audiences";
import Products from "./_components/Products";
import WhyZk from "./_components/WhyZk";
import Wallet from "./_components/Wallet";
import PenxPay from "./_components/PenxPay";
import Commerce from "./_components/Commerce";
import Blockchain from "./_components/Blockchain";
import Tokenomics from "./_components/Tokenomics";
import Ecosystem from "./_components/Ecosystem";
import Roadmap from "./_components/Roadmap";
import Community from "./_components/Community";
import Blog from "./_components/Blog";
import About from "./_components/About";
import CtaFinal from "./_components/CtaFinal";
import Footer from "./_components/Footer";

export default function LandingTestPage() {
  useEffect(() => {
    // Scroll-triggered fade-in
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Smooth active nav highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const handleScroll = () => {
      const scrollPos = window.scrollY + 80;
      sections.forEach(section => {
        const id = section.getAttribute('id');
        // @ts-ignore
        const top = section.offsetTop;
        // @ts-ignore
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          // You can add your active state logic here if needed
          // document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <Audiences />
      <Products />
      <WhyZk />
      <Wallet />
      <PenxPay />
      <Commerce />
      <Blockchain />
      <Tokenomics />
      <Ecosystem />
      <Roadmap />
      <Community />
      <Blog />
      <About />
      <CtaFinal />
      <Footer />
    </>
  );
}
