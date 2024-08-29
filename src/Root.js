import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import WolrdPage from "./pages/DuckWolrdPage";
import DuckFundingHome from "./pages/DuckFundingHome";
// ... 다른 페이지 import ...

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <WolrdPage /> },
      { path: "DuckFundingHome", element: <DuckFundingHome /> },
      // ... 다른 라우트 설정 ...
    ],
  },
]);

const Root = () => {
  return <RouterProvider router={router} />;
};

export default Root;