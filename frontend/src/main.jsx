/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";
import store from "./store.js";
import { Provider } from "react-redux";
import PrivateRoute from "./components/PrivateRoute.jsx";

// pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TierPage from "./pages/TierPage.jsx";
import CardRegisterPage from "./pages/CardRegisterPage.jsx";

import InitialSettingPage from "./pages/InitialSettingPage.jsx";
import LocationSettingPage from "./pages/LocationSettingPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/tier" element={<TierPage />} />
      <Route path="/add-card" element={<CardRegisterPage />} />

      <Route path="/welcome" element={<InitialSettingPage />} />
      <Route path="/set-location" element={<LocationSettingPage />} />

      {/* Private Route */}
      <Route path="" element={<PrivateRoute />}>
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <RouterProvider router={router} />
    {/* </React.StrictMode> */}
  </Provider>
);