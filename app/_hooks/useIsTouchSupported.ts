import { useContext } from "react";
import { IsTouchSupportedContext } from "../_providers/IsTouchSupportedProvider";

export const useIsTouchSupported = () => {
  const isTouchSupported = useContext(IsTouchSupportedContext);
  return isTouchSupported;
};
