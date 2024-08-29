// src/router.js
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import WolrdPage from "./pages/DuckWolrdPage";
import DuckFundingHome from "./pages/DuckFundingHome";
import Carousel from "./pages/Example";
import LoginPage from "./pages/LoginPage";
import SignupForm from "./pages/SignUpPage";
import ProductPage from "./pages/ProductPage";
import ProductWritePage from "./pages/ProductWritePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AuthCallback from "./components/AuthCallback";
import UserProfile from "./pages/UserProfile";

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
    ],
  },
]);

export default router;