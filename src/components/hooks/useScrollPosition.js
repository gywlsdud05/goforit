import { debounce } from "lodash";
import { useEffect, useCallback } from "react";

const useScrollPosition = () => {
  const saveScrollPosition = useCallback(
    debounce(() => {
      const currentPosition = window.scrollY;
      console.log("Saving scroll position:", currentPosition);
      localStorage.setItem("scrollPosition", currentPosition.toString());
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", saveScrollPosition);
    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
      saveScrollPosition.cancel();
    };
  }, [saveScrollPosition]);

  useEffect(() => {
    const savedPosition = localStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, []);
};

export default useScrollPosition;
