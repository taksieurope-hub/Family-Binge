import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { prefetchContent } from "./services/api";

const LandingPage = lazy(() => import("./components/LandingPage"));
const LoginPage   = lazy(() => import("./components/LoginPage"));
const SignupPage  = lazy(() => import("./components/SignupPage"));
const MainApp     = lazy(() => import("./MainApp"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const KartuliSection = lazy(() => import("./components/KartuliSection"));
const LiveTVPage   = lazy(() => import("./components/LiveTVPage"));

function App() {
  // Prefetch content on app load for faster experience
  useEffect(() => {
    prefetchContent();
  }, []);

  return (
    <Router>
      <Suspense fallback={<div style={{background:"#000",height:"100vh"}} />}>
        <Routes>
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/signup"  element={<SignupPage />} />
          <Route path="/app"     element={<MainApp />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/livetv"  element={<LiveTVPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
