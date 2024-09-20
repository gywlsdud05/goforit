import useAuthStore from "./components/hooks/useAuthStore";
import useKakaoSDK from "./components/hooks/useKakaoSDK";
import useScrollPosition from "./components/hooks/useScrollPosition";
import { supabase } from "./supabase.client";
import { ToastProvider } from "@radix-ui/react-toast";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import React from "react";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const authStore = useAuthStore();

  useKakaoSDK();
  useScrollPosition();

  console.log("ScrollY:", window.scrollY);

  return (
    <div className="App">
      <ToastProvider>
        <SessionContextProvider supabaseClient={supabase}>
          <Outlet />
          <ScrollRestoration
            getKey={(location, matches) => {
              console.log(
                "ScrollRestoration getKey:",
                location.pathname,
                matches
              );
              return location.pathname + (location.search || "");
            }}
          />
        </SessionContextProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
