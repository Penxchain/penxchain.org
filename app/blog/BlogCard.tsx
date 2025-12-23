"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "./page";
import styles from "./BlogCard.module.css";

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

export default function BlogCard({ post }: BlogCardProps) {
  // Start with default values to match server render
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [heartIdCounter, setHeartIdCounter] = useState(0);

  // Sync with localStorage after mount - this is the correct pattern for external storage
  useEffect(() => {
    const liked = localStorage.getItem(`blog_liked_${post.id}`);
    const count = localStorage.getItem(`blog_likes_${post.id}`);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (liked) setIsLiked(liked === "true");
    if (count) setLikeCount(parseInt(count, 10));
    // This is a valid use of setState in useEffect - syncing with external storage
     
  }, [post.id]);

  const createHearts = () => {
    const newHearts: Heart[] = [];
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 hearts

    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: heartIdCounter + i,
        x: Math.random() * 60 - 30, // -30 to 30
        size: Math.random() * 8 + 16, // 16-24px (smaller for cards)
        duration: Math.random() * 0.5 + 1.5, // 1.5-2s
        delay: i * 0.1, // Stagger the hearts
        rotation: (Math.random() - 0.5) * 60, // -30 to 30 degrees
        drift: (Math.random() - 0.5) * 25, // -12.5 to 12.5 horizontal drift
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);
    setHeartIdCounter((prev) => prev + count);

    // Remove hearts after animation
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

    // Save to localStorage
    localStorage.setItem(`blog_liked_${post.id}`, String(newLikedState));
    localStorage.setItem(`blog_likes_${post.id}`, String(newCount));

    // Trigger heart animation when liking
    if (newLikedState) {
      createHearts();
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className={styles.blogCard}>
      <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={250}
            className={styles.blogImage}
          />
          <span className={styles.category}>{post.category}</span>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.cardMeta}>
            <span className={styles.date}>{formatDate(post.date)}</span>
            <span className={styles.readTime}>{post.readTime}</span>
          </div>

          <h2 className={styles.cardTitle}>{post.title}</h2>
          <p className={styles.cardExcerpt}>{post.excerpt}</p>

          <div className={styles.cardFooter}>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.author}</span>
            </div>

            <div className={styles.actions} style={{ position: "relative" }}>
              <button
                onClick={handleLike}
                className={`${styles.likeButton} ${
                  isLiked ? styles.liked : ""
                }`}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                style={{ position: "relative", overflow: "visible" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={styles.heartIcon}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likeCount > 0 && (
                  <span className={styles.likeCount}>{likeCount}</span>
                )}
              </button>

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

              <span className={styles.readMore}>
                Read More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={styles.arrowIcon}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
