"use client";

import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface ReCaptchaWrapperProps {
  children: React.ReactNode;
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "";

/**
 * Wrapper component for Google reCAPTCHA v3
 * Provides the ReCaptcha context to all child components
 */
export default function ReCaptchaWrapper({ children }: ReCaptchaWrapperProps) {
  if (!RECAPTCHA_SITE_KEY) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[RECAPTCHA] NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing in production.",
      );
    }
    // Render children without provider; form handlers will surface a clear error.
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
