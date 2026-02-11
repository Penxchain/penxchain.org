export const APP_LINKS = {
  ANDROID: "https://play.google.com/store/apps/details?id=com.penxchain.wallet",
  IOS: "https://apps.apple.com/us/app/penxchain-wallet/id123456789",
  CHROME_EXTENSION:
    "https://chrome.google.com/webstore/detail/your-extension-id",
  DOWNLOAD_PAGE: "/downloads",
} as const;

type Router = {
  push: (url: string) => void | Promise<void>;
};

export const handleSmartDownload = (router: Router): void => {
  if (typeof window === "undefined") return;

  const userAgent = navigator.userAgent || navigator.vendor;
  if (/android/i.test(userAgent)) {
    window.open(APP_LINKS.DOWNLOAD_PAGE, "_blank");
    return;
  }

  if (/iPad|iPhone|iPod/i.test(userAgent) && !("MSStream" in window)) {
    window.open(APP_LINKS.DOWNLOAD_PAGE, "_blank");
    return;
  }

  router.push(APP_LINKS.DOWNLOAD_PAGE);
};
