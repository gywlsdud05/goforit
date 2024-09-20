// src/components/hooks/useAuthStore.js

import DuckChatAuthStore from "../../store/useDuckChatAuthStore";
import DuckFundingAuthStore from "../../store/useDuckFundingAuthStore";
import { useMemo } from "react";

const useAuthStore = () => {
  const currentPath = new URL(import.meta.url).pathname;
  console.log(currentPath);

  return useMemo(() => {
    if (currentPath.includes("/chatPages/")) {
      return DuckChatAuthStore;
    } else if (currentPath.includes("/pages/")) {
      return DuckFundingAuthStore;
    } else {
      console.warn(
        "Unable to determine auth store based on current path. Defaulting to DuckFunding auth store."
      );
      return DuckFundingAuthStore;
    }
  }, [currentPath]);
};

export default useAuthStore;
