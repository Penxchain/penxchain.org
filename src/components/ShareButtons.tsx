"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonsProps {
  title: string;
  excerpt?: string;
  slug?: string;
}

interface MenuButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  accent?: string;
}

export default function ShareButtons({
  title,
  excerpt,
  slug,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const ACCENT_PRIMARY = "#10b981";
  const GLASS_BG = "rgba(10, 10, 12, 0.9)";
  const BORDER_SUBTLE = "rgba(255, 255, 255, 0.08)";

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return slug
      ? `${window.location.origin}/blog/${slug}`
      : window.location.href;
  };

  const shareUrl = getShareUrl();
  const shareText = excerpt || title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showShareMenu]);

  const socialLinks = [
    {
      name: "X (Twitter)",
      icon: <XIcon />,
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(shareUrl)}&via=PENXCHAIN_`,
          "_blank"
        ),
    },
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            title + "\n\n" + shareUrl
          )}`,
          "_blank"
        ),
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      action: () =>
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        ),
    },
    {
      name: "LinkedIn",
      icon: <LinkedInIcon />,
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        ),
    },
  ];

  const handleNativeShare = async () => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={menuRef}
    >
      {/* Main Trigger Button */}
      <motion.button
        onClick={() => setShowShareMenu(!showShareMenu)}
        whileHover={{
          scale: 1.02,
          boxShadow: `0 0 25px rgba(16, 185, 129, 0.25)`,
          borderColor: "rgba(16, 185, 129, 0.6)",
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 25px",
          background: "rgba(16, 185, 129, 0.05)",
          border: `1px solid rgba(16, 185, 129, 0.3)`,
          borderRadius: "16px",
          color: ACCENT_PRIMARY,
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <ShareIcon size={20} color={ACCENT_PRIMARY} />
        <span style={{ letterSpacing: "-0.01em" }}>Share Blog</span>
      </motion.button>

      {/* Share Menu Dropdown */}
      <AnimatePresence>
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 14px)",
              right: 0,
              width: "280px",
              background: GLASS_BG,
              backdropFilter: "blur(20px) saturate(160%)",
              border: `1px solid ${BORDER_SUBTLE}`,
              borderRadius: "24px",
              padding: "10px",
              boxShadow:
                "0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 18px 36px -18px rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          >
            <motion.div
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.04 } },
                closed: {
                  transition: { staggerChildren: 0.03, staggerDirection: -1 },
                },
              }}
            >
              <MenuButton
                onClick={handleCopyLink}
                active={copied}
                icon={
                  copied ? (
                    <CheckIcon color={ACCENT_PRIMARY} />
                  ) : (
                    <LinkIcon color="rgba(255,255,255,0.6)" />
                  )
                }
                label={copied ? "Copied to clipboard" : "Copy article link"}
                accent={ACCENT_PRIMARY}
              />

              <div
                style={{
                  height: "1px",
                  background: BORDER_SUBTLE,
                  margin: "8px 10px",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "2px",
                }}
              >
                {socialLinks.map((social) => (
                  <MenuButton
                    key={social.name}
                    onClick={social.action}
                    icon={social.icon}
                    label={social.name}
                  />
                ))}
              </div>

              {typeof navigator !== "undefined" &&
                typeof navigator.share === "function" && (
                  <>
                    <div
                      style={{
                        height: "1px",
                        background: BORDER_SUBTLE,
                        margin: "8px 10px",
                      }}
                    />
                    <MenuButton
                      onClick={handleNativeShare}
                      icon={<MoreIcon color="rgba(255,255,255,0.6)" />}
                      label="More options"
                    />
                  </>
                )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({
  onClick,
  icon,
  label,
  active = false,
  accent = "white",
}: MenuButtonProps) {
  return (
    <motion.button
      variants={{
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: -8 },
      }}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        width: "100%",
        padding: "12px 14px",
        background: "transparent",
        border: "none",
        borderRadius: "14px",
        color: active ? accent : "rgba(255, 255, 255, 0.7)",
        fontSize: "0.92rem",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        if (!active) e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
        }}
      >
        {icon}
      </span>
      {label}
    </motion.button>
  );
}

// Icons with optional color props for better dynamic styling
const ShareIcon = ({ size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);
const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const LinkIcon = ({ color = "currentColor" }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const CheckIcon = ({ color = "currentColor" }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const MoreIcon = ({ color = "currentColor" }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
