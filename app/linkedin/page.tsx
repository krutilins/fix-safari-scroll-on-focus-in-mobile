"use client";
import React, { useEffect } from "react";

const STICKY_INPUT_BUGGED_CLASS_NAME = "sticky-input-bugged";

export default function LinkedInApproach() {
  const pageRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };

    // Check for visual viewport to handle resizing
    const visualViewport = window.visualViewport;
    let offset = 0;

    if (visualViewport) {
      let viewportWidth = window.innerWidth;
      let viewportHeight = window.innerHeight;

      visualViewport.addEventListener("resize", (event) => {
        console.log("triggered on resize");

        const $target = event.target as VisualViewport;
        const $page = pageRef.current as HTMLDivElement;

        if (viewportWidth !== $target.width) {
          viewportWidth = window.innerWidth;
          viewportHeight = window.innerHeight;
        }

        if (viewportHeight - $target.height > 150) {
          handleScrollToTop();
          const adjustment = viewportHeight - $target.height - offset;
          $page.style.bottom = `${adjustment}px`;
        } else if (
          viewportHeight === $target.height ||
          viewportHeight - $target.height <= 150
        ) {
          offset = viewportHeight - $target.height;
          $page.style.bottom = "0px";
        }
      });
    }

    document.addEventListener("touchend", handleScrollToTop);
    return () => {
      document.removeEventListener("touchend", handleScrollToTop);
    };
  }, []);

  return (
    <main ref={pageRef}>
      <h1>Chat</h1>
      <div className="message-history relative">
        {Array.from(Array(100).keys()).map((i) => (
          <div className="list-item" key={i} id={`${i}`}>
            {i} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          </div>
        ))}
      </div>
      <div className="actions">
        <textarea
          autoFocus={false}
          className={`message-input ${STICKY_INPUT_BUGGED_CLASS_NAME}`}
          placeholder="Message"
        />
        <button className="btn btn-primary">Button</button>
      </div>
    </main>
  );
}
