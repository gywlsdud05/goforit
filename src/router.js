// src/router.js

import App from "./App";
import AuthCallback from "./components/AuthCallback";
import BellPage from "./pages/BellPage";
import DuckFundingHome from "./pages/DuckFundingHome";
import WolrdPage from "./pages/DuckWolrdPage";
import Carousel from "./pages/Example";
import Example from "./pages/Example";
import Favorites from "./pages/Favorites";
import LoginPage from "./pages/LoginPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ProductPage from "./pages/ProductPage";
import ProductWritePage from "./pages/ProductWritePage";
import SignupForm from "./pages/SignUpPage";
import UserProfile from "./pages/UserProfile";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <WolrdPage /> },
      { path: "DuckFundingHome", element: <DuckFundingHome /> },
      { path: "example", element: <Carousel /> },
      { path: "LoginPage", element: <LoginPage /> },
      { path: "SignUpPage", element: <SignupForm /> },
      { path: "ProductPage/:id", element: <ProductPage /> },
      { path: "ProductWritePage", element: <ProductWritePage /> },
      { path: "payment-success", element: <PaymentSuccessPage /> },
      { path: "AuthCallback", element: <AuthCallback /> },
      { path: "UserProfile", element: <UserProfile /> },
      { path: "Favorites", element: <Favorites /> },
      { path: "BellPage", element: <BellPage /> },
      { path: "Example", element: <Example /> },
    ],
  },
]);

export default router;
