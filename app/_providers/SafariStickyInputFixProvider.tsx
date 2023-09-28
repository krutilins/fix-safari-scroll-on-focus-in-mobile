import React, { useEffect, useState } from "react";
import { useUserAgent } from "../_hooks/useUserAgent";
import { useIsTouchSupported } from "../_hooks/useIsTouchSupported";
import findUpClassName from "../_helpers/dom/findUpClassName";
import fixSafariStickyInput from "../_helpers/dom/fixSafariStickyInput";

// ! TODO: check if it produces issues, for now it seems to work fine without it
// but in general it was used to mark only inputs that are bugged, but all of them are bugged to be honest
// export const STICKY_INPUT_BUGGED_CLASS_NAME = "is-sticky-input-bugged";

export const SafariStickyInputFixContext = React.createContext(false);

export const SafariStickyInputFixProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userAgent = useUserAgent();
  const isTouchSupported = useIsTouchSupported();
  const [isStickyInputBugged, setIsStickyInputBugged] = useState(false);

  useEffect(() => {
    const isStickyInputBugged =
      userAgent.IS_SAFARI && userAgent.IS_MOBILE && isTouchSupported;

    setIsStickyInputBugged(isStickyInputBugged);

    const passiveOptions = { passive: true };
    const captureOptions = { capture: true, passive: false };

    const key: "clientY" | "pageY" = "clientY";
    let startY = 0;
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];

      const scrollable = findUpClassName(touch.target, "scrollable-y");
      if (scrollable) {
        const y = touch[key];
        const scrolled = startY - y;

        const scrollTop = scrollable.scrollTop;
        const scrollHeight = scrollable.scrollHeight;
        const clientHeight = scrollable.clientHeight;
        const nextScrollTop = scrollTop
          ? Math.round(scrollTop + scrollable.clientHeight + scrolled)
          : scrollTop + scrolled;
        const needCancel =
          scrollHeight === clientHeight ||
          nextScrollTop >= scrollHeight ||
          nextScrollTop <= 0;
        if (needCancel) {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    };

    // let lastFocusOutTimeStamp = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const touchStart = e.touches[0];

      startY = touchStart[key];
    };

    const onFocusIn = (e: FocusEvent) => {
      // if (
      //   !(e.target as HTMLElement).classList.contains(
      //     STICKY_INPUT_BUGGED_CLASS_NAME,
      //   ) ||
      //   e.timeStamp - lastFocusOutTimeStamp < 50
      // ) {
      //   return;
      // }
      // return false;

      // console.log("onFocusIn", e.target);

      fixSafariStickyInput(e.target as HTMLElement);

      document.addEventListener("touchmove", onTouchMove, captureOptions);
      document.addEventListener("touchstart", onTouchStart);
    };

    const onFocusOut = () =>
      // e: FocusEvent
      {
        document.removeEventListener("touchmove", onTouchMove, captureOptions);

        // lastFocusOutTimeStamp = e.timeStamp;

        document.removeEventListener("touchstart", onTouchStart);
      };

    const onVisibilityChange = () => {
      if (
        document.activeElement &&
        // document.activeElement.classList.contains(
        //   STICKY_INPUT_BUGGED_CLASS_NAME,
        // ) &&
        (document.activeElement as HTMLElement).blur
      ) {
        fixSafariStickyInput(document.activeElement as HTMLElement);
      }
    };

    let scrollToTopTimeout: NodeJS.Timeout | string = "";
    const timeout = isTouchSupported ? 50 : 0;

    const scrollToTop = () => {
      document.documentElement.scrollTo({
        top: -100,
        behavior: "smooth",
      });

      scrollToTopTimeout = setTimeout(() => {
        scrollToTop();
      }, timeout);
    };

    if (isStickyInputBugged) {
      scrollToTop();
      document.addEventListener("focusin", onFocusIn, passiveOptions);
      document.addEventListener("focusout", onFocusOut, { passive: true });
      document.addEventListener(
        "visibilitychange",
        onVisibilityChange,
        passiveOptions
      );
    }

    return () => {
      clearTimeout(scrollToTopTimeout);

      document?.removeEventListener("focusin", onFocusIn, passiveOptions);
      document?.removeEventListener("focusout", onFocusOut, passiveOptions);
      document?.removeEventListener(
        "visibilitychange",
        onVisibilityChange,
        passiveOptions
      );
      document.removeEventListener("touchmove", onTouchMove, captureOptions);
      document?.removeEventListener("touchstart", onTouchStart);
    };
  }, [userAgent.IS_MOBILE, userAgent.IS_SAFARI, isTouchSupported]);

  return (
    <SafariStickyInputFixContext.Provider value={isStickyInputBugged}>
      {children}
    </SafariStickyInputFixContext.Provider>
  );
};
