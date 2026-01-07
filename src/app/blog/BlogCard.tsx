"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check } from "lucide-react";
import { BlogPost } from "./page";

interface BlogCardProps {
  post: BlogPost;
}

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  drift: number;
}

// Remove the standalone getStorageValue or keep it purely for client-side use inside useEffect
// We will access localStorage directly inside useEffect

export default function BlogCard({ post }: BlogCardProps) {
  // 1. Initialize with deterministic defaults (safe for Server)
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  // Keep your other states
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // 2. Add a useEffect to sync with localStorage specifically on the client
  useEffect(() => {
    // This runs ONLY on the client, avoiding the mismatch
    const savedLiked = localStorage.getItem(`blog_liked_${post.id}`);
    const savedCount = localStorage.getItem(`blog_likes_${post.id}`);

    if (savedLiked) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLiked(JSON.parse(savedLiked));
    }

    if (savedCount) {
      setLikeCount(JSON.parse(savedCount));
    }
  }, [post.id]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setIsShareOpen(false);
      }
    };

    if (isShareOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isShareOpen]);

  const createHearts = () => {
    const newHearts: Heart[] = [];
    const count = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: heartIdCounter + i,
        x: Math.random() * 60 - 30,
        size: Math.random() * 8 + 16,
        duration: Math.random() * 0.5 + 1.5,
        delay: i * 0.1,
        rotation: (Math.random() - 0.5) * 60,
        drift: (Math.random() - 0.5) * 25,
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);
    setHeartIdCounter((prev) => prev + count);

    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.find((nh) => nh.id === h.id))
      );
    }, 2500);
  };

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    const newLikedState = !isLiked;
    const newCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);

    setIsLiked(newLikedState);
    setLikeCount(newCount);

    // Save to local storage
    localStorage.setItem(
      `blog_liked_${post.id}`,
      JSON.stringify(newLikedState)
    );
    localStorage.setItem(`blog_likes_${post.id}`, JSON.stringify(newCount));

    if (newLikedState) {
      createHearts();
    }
  };

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(!isShareOpen);
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/blog/${post.slug}`;
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      action: () => {
        const url = getShareUrl();
        const text = encodeURIComponent(post.title);
        window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
      },
    },
    {
      name: "X (Twitter)",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => {
        const url = getShareUrl();
        const text = encodeURIComponent(post.title);
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
          "_blank"
        );
      },
    },
    
    {
      name: "Telegram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      action: () => {
        const url = getShareUrl();
        const text = encodeURIComponent(post.title);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
      },
    },
    {
      name: "Copy Link",
      icon: copied ? (
        <Check className="w-5 h-5" />
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      action: () => {
        const url = getShareUrl();
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="h-full bg-white/3 rounded-2xl overflow-hidden transition-all duration-400 ease-in-out border border-white/5 backdrop-blur-[10px] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(98,87,116,0.541)] hover:border-[#ccdbd14d] group">
      <Link href={`/blog/${post.slug}`} className="block h-full flex-col">
        {/* Image Section */}
        <div className="relative w-full h-62.5 overflow-hidden bg-black/30">
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-full object-cover transition-transform duration-600 ease-in-out group-hover:scale-110"
          />
          <span className="absolute top-4 right-4 bg-[rgba(3,81,126,0.911)] text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-[5px]">
            {post.category}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Meta Info */}
          <div className="flex justify-between items-center mb-4 text-[0.85rem] text-white/60">
            <span className="flex items-center gap-2">
              {formatDate(post.date)}
            </span>
            <span className="text-[rgb(82,110,236)] font-semibold">
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3 leading-[1.4] transition-colors duration-300 group-hover:text-[rgb(82,110,236)]">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-white/70 leading-relaxed mb-6 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
            {/* Author */}
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-[0.9rem] font-medium">
                {post.author}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 relative">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`bg-transparent border-none cursor-pointer flex items-center gap-2 transition-all duration-300 p-2 rounded-lg relative overflow-visible ${
                  isLiked
                    ? "text-[#ff6b6b]"
                    : "text-white/60 hover:text-[#ff6b6b] hover:bg-[rgba(255,107,107,0.1)]"
                }`}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-5 h-5 transition-all duration-300 ${
                    isLiked ? "animate-heartBeat" : ""
                  }`}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likeCount > 0 && (
                  <span className="text-[0.9rem] font-semibold">
                    {likeCount}
                  </span>
                )}

                {/* Falling Hearts Animation */}
                <AnimatePresence>
                  {hearts.map((heart) => (
                    <motion.div
                      key={heart.id}
                      initial={{
                        opacity: 1,
                        y: 0,
                        x: heart.x,
                        scale: 0,
                        rotate: 0,
                      }}
                      animate={{
                        opacity: 0,
                        y: -120,
                        x: heart.x + heart.drift,
                        scale: 1,
                        rotate: heart.rotation,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "20px",
                        pointerEvents: "none",
                        zIndex: 1000,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#ff6b6b"
                        style={{
                          width: `${heart.size}px`,
                          height: `${heart.size}px`,
                          filter:
                            "drop-shadow(0 2px 4px rgba(255, 107, 107, 0.3))",
                        }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </button>

              {/* Share Button */}
              <div className="relative" ref={shareRef}>
                <button
                  onClick={handleShare}
                  className="bg-transparent border-none cursor-pointer flex items-center gap-2 text-white/60 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 p-2 rounded-lg"
                  aria-label="Share post"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {/* Share Dropdown */}
                <AnimatePresence>
                  {isShareOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full right-0 mb-2 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 min-w-45"
                    >
                      {shareOptions.map((option, index) => (
                        <button
                          key={option.name}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            option.action();
                            if (option.name !== "Copy Link") {
                              setIsShareOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-all duration-200 ${
                            index !== shareOptions.length - 1
                              ? "border-b border-white/5"
                              : ""
                          } ${
                            copied && option.name === "Copy Link"
                              ? "text-green-400"
                              : ""
                          }`}
                        >
                          <span
                            className={`${
                              copied && option.name === "Copy Link"
                                ? "text-green-400"
                                : ""
                            }`}
                          >
                            {option.icon}
                          </span>
                          <span className="text-sm font-medium">
                            {option.name}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Read More */}
              <span className="flex items-center gap-2 text-[#1dbcc2] font-semibold text-[0.9rem] transition-all duration-300 group-hover:gap-3">
                Read More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Tip: It is better to move this Keyframe to your tailwind.config.ts 
        and remove this <style jsx> tag entirely to prevent scoped CSS issues. 
      */}
      <style jsx>{`
        @keyframes heartBeat {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.3);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-heartBeat {
          animation: heartBeat 0.6s ease;
        }
      `}</style>
    </article>
  );
}
