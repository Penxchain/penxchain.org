"use client";

import Image from "next/image";
import Link from "next/link";
import QRCode from "react-qr-code"; // 1. Import the library
import { APP_LINKS } from "@/lib/downloadHelper"; // 2. Import your links
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Apple,
  Chrome,
  Globe,
} from "lucide-react";

export default function DownloadsPage() {
  return (
    <main className="relative w-full min-h-[100svh] flex flex-col pt-24 pb-12 transition-all overflow-hidden">
      {/* Background (Same as Hero) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-image-penxchain.png"
          alt="Penxchain Background"
          fill
          priority
          className="object-cover opacity-80"
          quality={100}
        />
        <div className="absolute inset-0 bg-linear-to-b from-penx-bg/90 via-penx-bg/60 to-penx-bg/95" />
      </div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>

        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-space text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            Choose Your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2547D0] to-blue-400">
              Platform
            </span>
          </h1>
          <p className="font-jakarta text-gray-300 text-lg">
            Secure your assets with the Penxchain Wallet. Available on mobile
            today, coming soon to your desktop.
          </p>
        </div>
      </div>

      {/* Cards Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* === CARD 1: MOBILE === */}
        <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col overflow-hidden hover:border-white/20 transition-all duration-300 shadow-2xl">
          <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-emerald-500/20 backdrop-blur-md">
            AVAILABLE NOW
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
              <Smartphone size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-space">
                Mobile App
              </h2>
              <p className="text-sm text-gray-400">iOS & Android</p>
            </div>
          </div>

          <p className="text-gray-300 mb-8 flex-grow leading-relaxed">
            The full power of Penxchain in your pocket. Send, receive, and swap
            assets with zero-knowledge privacy.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={APP_LINKS.IOS}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-6 py-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              <span className="flex items-center gap-3">
                <Apple size={24} fill="currentColor" />
                <span>Download on App Store</span>
              </span>
            </a>

            <a
              href={APP_LINKS.ANDROID}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-6 py-4 bg-transparent border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors font-semibold"
            >
              <span className="flex items-center gap-3">
                <Globe size={24} />
                <span>Get it on Google Play</span>
              </span>
            </a>
          </div>
        </div>

        {/* === CARD 2: DESKTOP === */}
        <div className="group relative bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl p-8 flex flex-col overflow-hidden grayscale-[0.3] hover:grayscale-0 transition-all duration-500">
          <div className="absolute top-0 right-0 bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-orange-500/20 backdrop-blur-md">
            COMING SOON
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 rounded-2xl text-purple-400">
              <Monitor size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-space">
                Desktop
              </h2>
              <p className="text-sm text-gray-400">Browser Extension</p>
            </div>
          </div>

          <p className="text-gray-300 mb-8 flex-grow leading-relaxed">
            Seamless integration with your browser workflow. Connect to dApps
            and manage your portfolio.
          </p>

          <div className="flex flex-col gap-3 opacity-60">
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed">
              <span className="flex items-center gap-3 text-gray-400">
                <Chrome size={24} />
                <span>Chrome Extension</span>
              </span>
              <span className="text-xs text-gray-500 border border-gray-600 px-2 py-0.5 rounded-full">
                Devnet
              </span>
            </div>
          </div>

          {/* Dynamic QR CODE Section */}
          <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="bg-white p-2 rounded-lg shrink-0">
              
              <QRCode
                value={APP_LINKS.ANDROID}
                size={64}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Can&apos;t wait?</p>
              <p className="text-xs text-gray-400 mt-1">
                Scan to download the mobile app instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
