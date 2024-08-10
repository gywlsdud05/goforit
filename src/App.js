import React, {useEffect} from "react" ;
import {Routes, Route, Link} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import useAuthStore from './store/useAuthStore';

import WolrdPage from "./pages/DuckWolrdPage"
import DuckFundingHome from "./pages/DuckFundingHome"
import Carousel from "./pages/Example"
import LoginPage from "./pages/LoginPage"
import SignupForm from "./pages/SignUpPage"
import ProductPage from "./pages/ProductPage"
import ProductWritePage from "./pages/ProductWritePage"
import CompanyFooter from "./pages/CompanyFooter";
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

      <Routes>
        <Route path="/" element={<WolrdPage/>}/>
        <Route path="/DuckFundingHome" element={<DuckFundingHome/>}/>
        <Route path="/example" element={<Carousel/>}/>
        <Route path="/LoginPage" element={<LoginPage/>}/>
        <Route path="/SignUpPage" element={<SignupForm/>}/>
        <Route path="/ProductPage" element={<ProductPage/>}/>
        <Route path="/ProductWritePage" element={<ProductWritePage/>}/>
      </Routes>
      <CompanyFooter/>
    </div>
  );
}

export default App;
