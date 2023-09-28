"use client";
import React, { useEffect } from "react";
import findUpClassName from "../_helpers/dom/findUpClassName";
import fixSafariStickyInput from "../_helpers/dom/fixSafariStickyInput";
import blurActiveElement from "../_helpers/dom/blurActiveElement";

const STICKY_INPUT_BUGGED_CLASS_NAME = "sticky-input-bugged";

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add("is-safari");

    const IS_TOUCH_SUPPORTED = false;
    const IS_STICKY_INPUT_BUGGED = true;

    const overlayCounter = {
      isOverlayActive: false,
    };

    // We listen to the resize event (https://css-tricks.com/the-trick-to-viewport-units-on-mobile/)
    const w = window.visualViewport || window; // * handle iOS keyboard
    let setViewportVH = false; /* , hasFocus = false */
    let lastVH: number;

    const setVH = () => {
      let vh =
        (setViewportVH && !overlayCounter.isOverlayActive
          ? (w as VisualViewport).height || (w as Window).innerHeight
          : window.innerHeight) * 0.01;
      vh = +vh.toFixed(2);
      if (lastVH === vh) {
        return;
      } else if (IS_TOUCH_SUPPORTED && lastVH < vh && vh - lastVH > 1) {
        blurActiveElement(); // (Android) fix blurring inputs when keyboard is being closed (e.g. closing keyboard by back arrow and touching a bubble)
      }

      lastVH = vh;

      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window?.addEventListener("resize", setVH); // ios
    setVH();

    if (IS_STICKY_INPUT_BUGGED) {
      const toggleResizeMode = () => {
        setViewportVH =
          IS_STICKY_INPUT_BUGGED && !overlayCounter.isOverlayActive;
        setVH();

        if (w !== window) {
          if (setViewportVH) {
            console.log("1");
            window.removeEventListener("resize", setVH);
            w.addEventListener("resize", setVH);
          } else {
            console.log("2");
            w.removeEventListener("resize", setVH);
            window.addEventListener("resize", setVH);
          }
        }
      };

      toggleResizeMode();
    }

    const key: "clientY" | "pageY" = "clientY";
    let startY = 0;
    const o = { capture: true, passive: false };
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

    let lastFocusOutTimeStamp = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const touchStart = e.touches[0];

      startY = touchStart[key];
    };
    const onFocusIn = (e: FocusEvent) => {
      console.log("focusin", e.target);
      if (
        !(e.target as HTMLElement).classList.contains(
          STICKY_INPUT_BUGGED_CLASS_NAME
        ) ||
        e.timeStamp - lastFocusOutTimeStamp < 50
      ) {
        console.log("focusin fast return");
        return;
      }

      console.log("focusin try fix safari");

      fixSafariStickyInput(e.target as HTMLElement);

      document.addEventListener("touchmove", onTouchMove, o);
      document.addEventListener("touchstart", onTouchStart);
    };

    const onFocusOut = (e: FocusEvent) => {
      document.removeEventListener("touchmove", onTouchMove, o);

      lastFocusOutTimeStamp = e.timeStamp;

      document.removeEventListener("touchstart", onTouchStart);
    };

    const onVisibilityChange = () => {
      if (
        document.activeElement &&
        document.activeElement.classList.contains(
          STICKY_INPUT_BUGGED_CLASS_NAME
        ) &&
        (document.activeElement as HTMLElement).blur
      ) {
        fixSafariStickyInput(document.activeElement as HTMLElement);
      }
    };

    const passiveOptions = { passive: true };

    document.addEventListener("focusin", onFocusIn, { passive: true });
    document.addEventListener("focusout", onFocusOut, { passive: true });
    document.addEventListener(
      "visibilitychange",
      onVisibilityChange,
      passiveOptions
    );

    return () => {
      document.documentElement.classList.remove("is-safari");
      document.removeEventListener("touchmove", onTouchMove, o);

      window?.visualViewport?.removeEventListener("resize", setVH);
      window?.removeEventListener("resize", setVH);

      document?.removeEventListener("focusout", onFocusOut);
      document?.removeEventListener("visibilitychange", onVisibilityChange);
      document?.removeEventListener("touchstart", onTouchStart);
      document?.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  return (
    <main>
      <div className="container">
        <h1>Chat</h1>
        <div className="relative">
          <div className="message-history scrollable scrollable-y">
            {Array.from(Array(100).keys()).map((i) => (
              <div className="list-item" key={i} id={`${i}`}>
                {i} Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec
              </div>
            ))}
          </div>
        </div>
        <div className="actions">
          <textarea
            autoFocus={false}
            className={`message-input ${STICKY_INPUT_BUGGED_CLASS_NAME}`}
            placeholder="Message"
          />
          <button className="btn btn-primary">Button</button>
        </div>
      </div>
    </main>
  );
}
