import { useEffect } from "react";

const useKakaoSDK = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;

    script.onload = () => {
      if (window.Kakao) {
        window.Kakao.init("459b83e75cb07aac5c25510e85fa29d8");
        console.log("Kakao SDK Initialized");
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

export default useKakaoSDK;
