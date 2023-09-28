import { useContext } from "react";
import { UserAgentContext } from "../_providers/UserAgentProvider";

export const useUserAgent = () => {
  const userAgent = useContext(UserAgentContext);
  return userAgent;
};
