import './Header.css'; // CSS 파일을 가져옵니다.

import React, {useEffect} from "react" ;
import {Routes, Route, Link} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import useAuthStore from './store/useAuthStore';
import WolrdPage from "./pages/DuckWolrdPage"
import AuthCallback from "./components/authCallback"
import DuckFundingHome from "./pages/DuckFundingHome"
import Carousel from "./pages/Example"
import LoginPage from "./pages/LoginPage"
import SignupForm from "./pages/SignUpPage"
import ProductPage from "./pages/ProductPage"
import ProductWritePage from "./pages/ProductWritePage"
import PaymentSuccessPage from "./pages/PaymentSuccessPage"
import CompanyFooter from "./pages/CompanyFooter";
import Header from "./pages/Header";
import { GoogleOAuthProvider } from '@react-oauth/google';



const App = () => {
  const { accessToken, refreshAccessToken, logout } = useAuthStore((state) => ({
    accessToken: state.accessToken,
    refreshAccessToken: state.refreshAccessToken,
    logout: state.logout,
  }));

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (!accessToken) {
        await refreshAccessToken();
      }
    };

    handleTokenRefresh();
  }, [accessToken, refreshAccessToken]);

  return (
    <GoogleOAuthProvider clientId="957039910040-et0rf32k194sugfs0mse3qvbmvr371hg.apps.googleusercontent.com">
    <div className="App">

      <div>
      {accessToken ? (
        <>
          <h1>Welcome back!</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <h1>not login</h1>
      )}
    </div>
    <Header/>
      <Routes>
       
        <Route path="/" element={<WolrdPage/>}/>
        <Route path="/DuckFundingHome" element={<DuckFundingHome/>}/>
        <Route path="/example" element={<Carousel/>}/>
        <Route path="/LoginPage" element={<LoginPage/>}/>
        <Route path="/SignUpPage" element={<SignupForm/>}/>
        <Route path="/ProductPage/:id" element={<ProductPage/>}/>
        <Route path="/ProductWritePage" element={<ProductWritePage/>}/>
        <Route path="/payment-success" element={<PaymentSuccessPage/>}/>
        <Route path="/authCallback" element={<AuthCallback/>}/>
      </Routes>
      <CompanyFooter/>
    </div>
    </GoogleOAuthProvider>
  );
}

export default App;
