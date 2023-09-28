import { createContext, useEffect, useState } from "react";

export const IsTouchSupportedContext = createContext(false);

const IsTouchSupportedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTouchSupported, setIsTouchSupported] = useState(false);

  useEffect(() => {
    const IS_TOUCH_SUPPORTED =
      window &&
      ("ontouchstart" in window ||
        (window.DocumentTouch &&
          document instanceof DocumentTouch)); /*  || true */

    setIsTouchSupported(IS_TOUCH_SUPPORTED);

    if (IS_TOUCH_SUPPORTED) {
      document.documentElement.classList.add("no-touch");
    } else {
      document.documentElement.classList.add("is-touch");
    }

    return () => {
      document.documentElement.classList.remove("no-touch", "is-touch");
    };
  }, []);

  return (
    <IsTouchSupportedContext.Provider value={isTouchSupported}>
      {children}
    </IsTouchSupportedContext.Provider>
  );
};

export default IsTouchSupportedProvider;
