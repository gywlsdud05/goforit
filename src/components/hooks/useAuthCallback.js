import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useAuthCallback = (authStore, navigate) => {
  const location = useLocation();

  useEffect(() => {
    console.log("Location changed:", location.pathname);

    const handleHash = async () => {
      if (location.hash.includes("access_token")) {
        try {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          const accessToken = hashParams.get("access_token");

          if (accessToken) {
            await authStore.handleAuthCallback({ access_token: accessToken });
            navigate(location.pathname, { replace: true });
          }
        } catch (error) {
          console.error("Error handling auth callback:", error);
        }
      } else if (location.hash) {
        console.log("Scrolling to hash:", location.hash);
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.scrollTo(0, 0);
      }
    };

    handleHash();
  }, [location, authStore, navigate]);
};

export default useAuthCallback;
