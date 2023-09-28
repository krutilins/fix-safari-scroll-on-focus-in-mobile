import { createContext, useEffect, useState } from "react";

export const UserAgentContext = createContext({
  IS_APPLE: false,
  IS_ANDROID: false,
  IS_CHROMIUM: false,
  IS_APPLE_MOBILE: false,
  IS_SAFARI: false,
  IS_FIREFOX: false,
  IS_MOBILE_SAFARI: false,
  IS_MOBILE: false,
});

const IS_APPLE_CLASS_NAME = "is-apple";
const IS_ANDROID_CLASS_NAME = "is-android";
const IS_CHROMIUM_CLASS_NAME = "is-chromium";
const IS_APPLE_MOBILE_CLASS_NAME = "is-ios";
const IS_APPLE_MAC_CLASS_NAME = "is-mac";
const IS_SAFARI_CLASS_NAME = "is-safari";
const IS_FIREFOX_CLASS_NAME = "is-firefox";
const IS_MOBILE_SAFARI_CLASS_NAME = "is-mobile-safari";
const IS_MOBILE_CLASS_NAME = "is-mobile";

const ALL_CLASSES = [
  IS_APPLE_CLASS_NAME,
  IS_ANDROID_CLASS_NAME,
  IS_CHROMIUM_CLASS_NAME,
  IS_APPLE_MOBILE_CLASS_NAME,
  IS_APPLE_MAC_CLASS_NAME,
  IS_SAFARI_CLASS_NAME,
  IS_FIREFOX_CLASS_NAME,
  IS_MOBILE_SAFARI_CLASS_NAME,
  IS_MOBILE_CLASS_NAME,
];

const UserAgentProvider = ({ children }: { children: React.ReactNode }) => {
  const [userAgent, setUserAgent] = useState({
    IS_APPLE: false,
    IS_ANDROID: false,
    IS_CHROMIUM: false,
    IS_APPLE_MOBILE: false,
    IS_SAFARI: false,
    IS_FIREFOX: false,
    IS_MOBILE_SAFARI: false,
    IS_MOBILE: false,
  });

  useEffect(() => {
    const ctx = typeof window !== "undefined" ? window : self;

    const USER_AGENT = navigator ? navigator.userAgent : null;
    const IS_APPLE = navigator.userAgent.search(/OS X|iPhone|iPad|iOS/i) !== -1;
    const IS_ANDROID =
      navigator.userAgent.toLowerCase().indexOf("android") !== -1;
    const IS_CHROMIUM =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    // https://stackoverflow.com/a/58065241
    const IS_APPLE_MOBILE =
      (/iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
      !(ctx as any).MSStream;

    const IS_SAFARI =
      !!("safari" in ctx) ||
      !!(
        USER_AGENT &&
        (/\b(iPad|iPhone|iPod)\b/.test(USER_AGENT) ||
          (!!USER_AGENT.match("Safari") && !USER_AGENT.match("Chrome")))
      ); /*  || true */
    const IS_FIREFOX =
      navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

    const IS_MOBILE_SAFARI = IS_SAFARI && IS_APPLE_MOBILE;

    const IS_MOBILE =
      (navigator.maxTouchPoints === undefined ||
        navigator.maxTouchPoints > 0) &&
      navigator.userAgent.search(
        /iOS|iPhone OS|Android|BlackBerry|BB10|Series ?[64]0|J2ME|MIDP|opera mini|opera mobi|mobi.+Gecko|Windows Phone/i
      ) != -1;

    setUserAgent({
      IS_APPLE,
      IS_ANDROID,
      IS_CHROMIUM,
      IS_APPLE_MOBILE,
      IS_SAFARI,
      IS_FIREFOX,
      IS_MOBILE_SAFARI,
      IS_MOBILE,
    });

    if (IS_FIREFOX) {
      document.documentElement.classList.add(
        IS_FIREFOX_CLASS_NAME,
        "no-backdrop"
      );
    }

    if (IS_MOBILE) {
      document.documentElement.classList.add(IS_MOBILE_CLASS_NAME);
    }

    if (IS_APPLE) {
      if (IS_SAFARI) {
        document.documentElement.classList.add(IS_SAFARI_CLASS_NAME);
      }

      if (IS_APPLE_MOBILE) {
        document.documentElement.classList.add(IS_APPLE_MOBILE_CLASS_NAME);
      } else {
        document.documentElement.classList.add(IS_APPLE_MAC_CLASS_NAME);
      }
    } else if (IS_ANDROID) {
      document.documentElement.classList.add(IS_ANDROID_CLASS_NAME);
    }

    const options = { passive: true };
    const onMobileSafariTouchStart = (ev: TouchEvent) => {
      if (ev.touches.length > 1) return;
    };

    if (IS_MOBILE_SAFARI) {
      window.addEventListener("touchstart", onMobileSafariTouchStart, options);
    }

    return () => {
      window.removeEventListener(
        "touchstart",
        onMobileSafariTouchStart,
        options
      );
      document.documentElement.classList.remove(...ALL_CLASSES);
    };
  }, []);

  return (
    <UserAgentContext.Provider value={userAgent}>
      {children}
    </UserAgentContext.Provider>
  );
};

export default UserAgentProvider;
