"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Wallet,
  ShieldCheck,
  Store,
  ChevronDown,
  Mail,
  MessageSquare,
  X as XIcon,
  ArrowUpRight,
  FileText,
  Zap,
  Newspaper,
  Download,
} from "lucide-react";
import styles from "./support.module.css";
import Link from "next/link";

// --- Strict Type Definitions ---
interface FAQ {
  q: string;
  a: string;
  cat: "wallet" | "security" | "token" | "marketplace";
}

interface ResourceButtonProps {
  icon: React.ReactNode;
  title: string;
  sub: string;
  href: string;
  isDownload?: boolean;
}

interface BentoCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
}

interface ContactButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Memoizing the FAQ array to prevent re-declaration on every render
  // and ensuring useMemo dependency safety.
  const faqs: FAQ[] = useMemo(
    () => [
      {
        q: "How does Penxchain ensure transaction privacy?",
        a: "We utilize Zero-Knowledge Proofs (zk-SNARKs) to validate transactions on-chain without revealing the sender, receiver, or amount.",
        cat: "security",
      },
      {
        q: "What is the utility of the $PENX token?",
        a: "$PENX is the native utility token used for transaction fees, staking, and as the primary currency for the Penx Marketplace.",
        cat: "token",
      },
      {
        q: "How do I recover my wallet if I lose my device?",
        a: "Penxchain is non-custodial. Use your 12 or 24-word Secret Recovery Phrase to restore your assets.",
        cat: "wallet",
      },
      {
        q: "Are marketplace transactions escrow-protected?",
        a: "Yes. Every purchase on the Penx Marketplace is held in a secure, audited smart contract escrow.",
        cat: "marketplace",
      },
      {
        q: "Can I use Penxchain with hardware wallets like Ledger?",
        a: "Absolutely. Connect your hardware wallet to the Penx interface while maintaining full zk-privacy.",
        cat: "security",
      },
    ],
    []
  );

  // Fixed useMemo with correct dependencies
  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, faqs]);

  return (
    <div className={styles.supportPage}>
      <div className={styles.ambientGlow}>
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
      </div>

      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.statusBadge}
        >
          <div className={styles.statusDot} />
          Protocol Status: Optimal
        </motion.div>

        <h1 className={styles.heroTitle}>
          Central <span className={styles.accentText}>Intelligence</span> <br />
          & Support.
        </h1>

        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search for security, PENX token, or recovery..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
            {searchQuery && (
              <XIcon
                className={styles.searchIcon}
                style={{ cursor: "pointer" }}
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>
      </section>

      <section className={styles.resourcesSection}>
        <div className={styles.resourcesGrid}>
          <ResourceButton
            icon={<FileText size={22} />}
            title="Whitepaper"
            sub="Protocol V2.0"
            href="/docs/PENXCHAIN-WHITEPAPER.pdf"
            isDownload
          />
          <ResourceButton
            icon={<Newspaper size={22} />}
            title="Blog & News"
            sub="Latest Updates"
            href="/blog"
          />
          <ResourceButton
            icon={<Zap size={22} />}
            title="Dev Docs"
            sub="API Access"
            href="https://penxchain.org/docs"
          />
        </div>
      </section>

      <section className={styles.bentoGrid}>
        <BentoCard
          className={styles.large}
          icon={<Wallet size={24} />}
          title="Wallet Suite"
          desc="Manage private key shards and multi-sig setups with institutional-grade zk-encryption."
        />
        <BentoCard
          icon={<ShieldCheck size={20} />}
          title="Security"
          desc="ZK-SNARKs & Biometrics."
        />
        <BentoCard
          icon={<Zap size={20} />}
          title="PENX Token"
          desc="Utility & Staking."
        />
        <BentoCard
          className={styles.medium}
          icon={<Store size={20} />}
          title="Marketplace Ops"
          desc="Escrow resolution, merchant protocols, and encrypted commerce chat."
        />
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <div>
            <p className={styles.faqSubtitle}>COMMON QUERIES</p>
            <h2 className={styles.faqTitle}>Knowledge Base</h2>
          </div>
        </div>

        <div className={styles.faqList}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className={`${styles.faqItem} ${
                  activeFaq === idx ? styles.open : ""
                }`}
              >
                <button
                  className={styles.faqTrigger}
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  {faq.q}
                  <ChevronDown
                    size={18}
                    style={{
                      transform:
                        activeFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={styles.faqContent}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <Search size={40} opacity={0.2} />
              <p>No documentation found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </section>

      <footer className={styles.supportFooter}>
        <h3 className={styles.footerTitle}>STILL NEED ASSISTANCE?</h3>
        <div className={styles.contactFlex}>
          <ContactButton
            icon={<Mail size={20} />}
            label="Email Protocol"
            href="mailto:admin@penxchain.com"
          />
          <ContactButton
            icon={<MessageSquare size={20} />}
            label="Telegram Hub"
            href="https://t.me/Officialpenxchain"
          />
          <ContactButton
            icon={<XIcon size={20} />}
            label="X Terminal"
            href="https://x.com/penxchain_"
          />
        </div>
      </footer>
    </div>
  );
}

// --- Strictly Typed Internal Components ---

function ResourceButton({
  icon,
  title,
  sub,
  href,
  isDownload,
}: ResourceButtonProps) {
  return (
    <Link
      href={href}
      className={styles.resourceCard}
      {...(isDownload ? { download: true } : {})}
    >
      <div className={styles.resourceIcon}>{icon}</div>
      <div className={styles.resourceText}>
        <span className={styles.resTitle}>{title}</span>
        <span className={styles.resSub}>{sub}</span>
      </div>
      {isDownload ? (
        <Download size={14} className={styles.resArrow} />
      ) : (
        <ArrowUpRight size={14} className={styles.resArrow} />
      )}
    </Link>
  );
}

function BentoCard({ icon, title, desc, className = "" }: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className={`${styles.bentoItem} ${className}`}
    >
      <div className={styles.iconBox}>{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <ArrowUpRight size={16} className={styles.bentoArrow} />
    </motion.div>
  );
}

function ContactButton({ icon, label, href }: ContactButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.08)" }}
      whileTap={{ scale: 0.98 }}
      className={styles.contactBtn}
    >
      {icon}
      <span>{label}</span>
    </motion.a>
  );
}
