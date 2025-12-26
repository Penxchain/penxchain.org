"use client";

import { useEffect, useState, useRef } from "react";

export default function Waitlist() {
  const [userCount, setUserCount] = useState<number>(45);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showRetentionToast, setShowRetentionToast] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlocked = useRef<boolean>(false);
  const counterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef<boolean>(false);

  /* Audio unlocker */
  useEffect(() => {
    audioRef.current = new Audio("/join-waitlist.mp3");

    const unlockAudio = (): void => {
      if (audioRef.current && !audioUnlocked.current) {
        audioRef.current
          .play()
          .then(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            audioUnlocked.current = true;
            document.removeEventListener("click", unlockAudio);
          })
          .catch(() => {});
      }
    };

    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, []);

  /* VISIBILITY OBSERVER (Pause & Resume Counter) */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        setHasStarted(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /* final stage trigger*/
  const triggerFinalState = (): void => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
    setShowNotification(true);
  };

  /* COUNTER LOGIC (SMART) */
  useEffect(() => {
    if (!hasStarted) {
      if (counterTimeoutRef.current) {
        clearTimeout(counterTimeoutRef.current);
      }
      return;
    }

    const maxCount = 99;
    const getRandomTime = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1) + min);

    const incrementCounter = (): void => {
      if (!isVisibleRef.current) return;

      setUserCount((prev) => {
        if (prev >= maxCount) return prev;

        const next = prev + 1;

        if (next === maxCount) {
          triggerFinalState();
          return next;
        }

        counterTimeoutRef.current = setTimeout(
          incrementCounter,
          getRandomTime(1000, 2000)
        );

        return next;
      });
    };

    counterTimeoutRef.current = setTimeout(incrementCounter, 1500);

    return () => {
      if (counterTimeoutRef.current) {
        clearTimeout(counterTimeoutRef.current);
      }
    };
  }, [hasStarted]);

  /* CONVERSION HANDLER */
  const handleConversionClick = (): void => {
    setShowNotification(false);
    setTimeout(() => setShowRetentionToast(true), 300);
  };

  return (
    <div ref={sectionRef} className="waitlist-section">
      {/* NOTIFICATION DROP*/}
      <div className={`notification-drop ${showNotification ? "active" : ""}`}>
        <div className="notif-content">
          <button
            className="notif-close"
            aria-label="Close notification"
            onClick={() => setShowNotification(false)}
          >
            ✕
          </button>

          <div className="notif-icon">
            <i className="fa-solid fa-bolt-lightning"></i>
          </div>

          <div className="notif-text">
            <h5>Exclusive Entry Available</h5>
            <p>You&apos;re the 100th person. Secure the final spot.</p>
          </div>

          <a
            href="https://forms.gle/6VYv7HgRoMaAwv8D9"
            target="_blank"
            rel="noopener noreferrer"
            className="notif-btn"
            onClick={handleConversionClick}
          >
            Claim Spot
          </a>
        </div>
      </div>

      {/* RETENTION TOAST */}
      <div className={`retention-toast ${showRetentionToast ? "active" : ""}`}>
        <div className="toast-blur"></div>

        <div className="toast-content">
          <div className="status-dot"></div>

          <div className="toast-text">
            <h2 className="toast-title">Priority access held</h2>
            <p className="toast-sub">
              Your spot is still reserved. Complete your application to secure
              it before it&apos;s released to others.
            </p>
          </div>

          <button
            className="close-toast"
            onClick={() => setShowRetentionToast(false)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main content here*/}
      <div className="badge-container">
        <div className="badge">
          <i className="fa-solid fa-shield-halved"></i> Privacy-First Blockchain
          Wallet
        </div>
      </div>

      <h1>
        Be Among the First
        <br />
        to Test Our <span className="highlight-blue">Privacy Wallet</span>
      </h1>

      <p className="description">
        Your crypto deserves better than apps that track your every move.
        We&apos;re building a blockchain wallet for Android that puts privacy
        first—no analytics, no data mining, no surveillance. Just you and your
        assets. We&apos;re looking for <b>100</b> Android users to help us beta
        test before launch.
      </p>

      <div className="social-proof">
        <div className="icon-group">
          <i className="fa-solid fa-users"></i>
        </div>

        {userCount === 99 ? (
          <span className="pulse-text">
            99 users + <span className="highlight-blue">YOU</span> = Full
            Cohort!
          </span>
        ) : (
          <span>
            <span id="user-count">{userCount}</span>+ users already on the
            waitlist
          </span>
        )}
      </div>

      <br />

      <a
        href="https://forms.gle/6VYv7HgRoMaAwv8D9"
        target="_blank"
        rel="noopener noreferrer"
        className="waitlist-btn"
        onClick={handleConversionClick}
      >
        <i className="fas fa-user-plus"></i>&nbsp; Join Now
      </a>
    </div>
  );
}
