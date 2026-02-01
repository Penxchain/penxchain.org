"use client";

import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface ReCaptchaWrapperProps {
  children: React.ReactNode;
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Lchu1wsAAAAAP7gQdPW57bOMAJgLtYUPjNR9SuA";

/**
 * Wrapper component for Google reCAPTCHA v3
 * Provides the ReCaptcha context to all child components
 */
export default function ReCaptchaWrapper({ children }: ReCaptchaWrapperProps) {
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
