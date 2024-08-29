import React, { useEffect , useCallback } from "react";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase.client';
import Header from "./pages/Header";
import useAuthStore from './store/useAuthStore';
import CompanyFooter from './pages/CompanyFooter';
import { debounce } from 'lodash';

const App = () => {
  const { initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, []);

  const saveScrollPosition = useCallback(debounce(() => {
    const currentPosition = window.scrollY;
    console.log("Saving scroll position:", currentPosition);
    localStorage.setItem('scrollPosition', currentPosition.toString());
  }, 100), []);

  useEffect(() => {
    console.log("Location changed:", location.pathname);

    if (location.hash) {
      console.log("Scrolling to hash:", location.hash);
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }

    window.addEventListener('scroll', saveScrollPosition);
    return () => {
      window.removeEventListener('scroll', saveScrollPosition);
      saveScrollPosition.cancel();
    };
  }, [location, saveScrollPosition]);

  useEffect(() => {
    const savedPosition = localStorage.getItem('scrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, []);

  const handleScrollRestoration = () => {
    console.log("ScrollRestoration triggered");
  }

  console.log("ScrollY:", window.scrollY);

  return (
    <div className="App">
      <SessionContextProvider supabaseClient={supabase}>
        <Header />
        <Outlet />
        <ScrollRestoration
          getKey={(location, matches) => {
            console.log("ScrollRestoration getKey:", location.pathname, matches);
            return location.pathname + (location.search || "");
          }}
        />
        <CompanyFooter />
      </SessionContextProvider>
    </div>
  );
}

export default App;