import React, { useEffect, useCallback } from "react";
import { Outlet, useLocation, ScrollRestoration, useNavigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from './supabase.client';
import Header from "./pages/Header";
import useAuthStore from './store/useAuthStore';
import CompanyFooter from './pages/CompanyFooter';
import { debounce } from 'lodash';

const App = () => {
  const { initializeAuth, handleAuthCallback } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const saveScrollPosition = useCallback(debounce(() => {
    const currentPosition = window.scrollY;
    console.log("Saving scroll position:", currentPosition);
    localStorage.setItem('scrollPosition', currentPosition.toString());
  }, 100), []);

  useEffect(() => {
    console.log("Location changed:", location.pathname);

    const handleHash = async () => {
      if (location.hash.includes('access_token')) {
        try {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            await handleAuthCallback({ access_token: accessToken });
            // Clear the hash from the URL
            navigate(location.pathname, { replace: true });
          }
        } catch (error) {
          console.error('Error handling auth callback:', error);
        }
      } else if (location.hash) {
        console.log("Scrolling to hash:", location.hash);
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo(0, 0);
      }
    };

    handleHash();

    window.addEventListener('scroll', saveScrollPosition);
    return () => {
      window.removeEventListener('scroll', saveScrollPosition);
      saveScrollPosition.cancel();
    };
  }, [location, saveScrollPosition, handleAuthCallback, navigate]);

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