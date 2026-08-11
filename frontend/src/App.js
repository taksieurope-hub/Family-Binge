import React, { lazy, Suspense, useEffect, Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { prefetchContent } from "./services/api";
import { AuthProvider } from "./services/AuthContext";

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{background:"#000",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"16px"}}>
          <p style={{color:"#fff",fontSize:"18px"}}>Something went wrong.</p>
          <button onClick={() => window.location.reload()} style={{background:"#7c3aed",color:"#fff",padding:"12px 24px",borderRadius:"8px",border:"none",cursor:"pointer"}}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const LoadingScreen = () => (
  <div style={{background:"#000",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"16px"}}>
    <div style={{width:"48px",height:"48px",border:"4px solid #7c3aed",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <p style={{color:"#666",fontSize:"14px"}}>Loading...</p>
  </div>
);

const LandingPage = lazy(() => import("./components/LandingPage"));
const LoginPage   = lazy(() => import("./components/LoginPage"));
const SignupPage  = lazy(() => import("./components/SignupPage"));
const MainApp     = lazy(() => import("./MainApp"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const LiveTVPage  = lazy(() => import("./components/LiveTVPage"));
const YouTubePage = lazy(() => import("./components/YouTubePage"));
const ForgotPasswordPage = lazy(() => import("./components/ForgotPasswordPage"));

function App() {
  useEffect(() => { prefetchContent(); }, []);
  return (
    <AuthProvider>
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/"        element={<MainApp />} />
            <Route path="/login"   element={<LoginPage />} />
            <Route path="/signup"  element={<SignupPage />} />
            <Route path="/app"     element={<MainApp />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/livetv"  element={<LiveTVPage />} />
            <Route path="/youtube" element={<YouTubePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
    </AuthProvider>
  );
}
export default App;

