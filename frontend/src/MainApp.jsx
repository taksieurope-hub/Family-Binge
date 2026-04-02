import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ContentSection from "./components/ContentSection";
import DownloadSection from "./components/DownloadSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import LiveTVSection from "./components/LiveTVSection";
import KartuliSection from "./components/KartuliSection";
import Footer from "./components/Footer";
import ReferralBanner from "./components/ReferralBanner";
import VideoPlayer from "./components/VideoPlayer";
import ContentDetailModal from "./components/ContentDetailModal";
import DownloadModal from "./components/DownloadModal";
import { auth, db } from "./services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Crown, AlertTriangle, X } from "lucide-react";
import { registerDevice, getDeviceId } from "./services/deviceService";
import DeviceBlockedModal from "./components/DeviceBlockedModal";

// ── Paywall Modal ──────────────────────────────────────────────────────────────
const PaywallModal = ({ onClose, onGoToPricing, trialEnds, onLogout }) => {
  const formatDate = (val) => {
    if (!val) return '';
    const d = val?.toDate ? val.toDate() : new Date(val);
    return d.toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-3xl p-10 text-center relative border border-zinc-700">
        <div className="w-24 h-24 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">Your Free Trial Has Ended</h2>

        {trialEnds && (
          <p className="text-gray-400 text-sm mb-4">
            Trial expired on{" "}
            <span className="text-white font-semibold">{formatDate(trialEnds)}</span>
          </p>
        )}

        <p className="text-gray-300 mb-8 text-lg">
          Subscribe now to continue watching unlimited movies, series, and Live TV.
        </p>

        <button
          onClick={onGoToPricing}
          className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-bold rounded-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
        >
          <Crown className="w-6 h-6" />
          View Plans & Subscribe
        </button>

        <button
          onClick={onClose}
          className="mt-4 w-full py-3 text-gray-400 hover:text-white text-sm transition-colors border border-zinc-700 rounded-xl hover:bg-zinc-800"
        >
          Browse Only (Limited Access)
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="mt-3 text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            Switch Account
          </button>
        )}
      </div>
    </div>
  );
};

// ── Trial Banner (shown when trial active but expiring soon) ───────────────────
const TrialBanner = ({ trialEnds, onUpgrade, onDismiss }) => {
  const formatDate = (val) => {
    if (!val) return '';
    const d = val?.toDate ? val.toDate() : new Date(val);
    return d.toLocaleDateString('en-ZA', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getDaysLeft = (val) => {
    if (!val) return 0;
    const d = val?.toDate ? val.toDate() : new Date(val);
    const diffMs = d - new Date();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return { days: Math.max(0, diffDays), hours: Math.max(0, diffHours % 24) };
  };

  const timeLeft = getDaysLeft(trialEnds);
  const isUrgent = timeLeft.days <= 1;

  return (
    <div className={`w-full px-4 py-3 flex items-center justify-between gap-3 ${isUrgent ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-orange-500 to-yellow-500'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-1.5 rounded-full ${isUrgent ? 'bg-white/20' : 'bg-black/20'}`}>
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
        <p className="text-white text-sm font-medium truncate">
          {timeLeft.days === 0
            ? `Trial expires in ${timeLeft.hours} hours!`
            : `${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''} left in your free trial`
          }
          <span className="hidden sm:inline text-white/80"> — Upgrade to keep watching</span>
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onUpgrade}
          className={`font-bold text-sm px-4 py-1.5 rounded-xl transition-all flex items-center gap-1 ${isUrgent ? 'bg-white text-red-600 hover:bg-gray-100' : 'bg-black/30 text-white hover:bg-black/40'}`}
        >
          <Crown className="w-4 h-4" /> Upgrade
        </button>
        <button onClick={onDismiss} className="text-white/70 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Guest Banner (shown to non-logged in users) ───────────────────────────────
const GuestBanner = ({ onSignup, onLogin, onDismiss }) => {
  return (
    <div className="w-full px-4 py-3 flex items-center justify-between gap-3 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="flex items-center gap-3 min-w-0">
        <Crown className="w-5 h-5 text-white flex-shrink-0" />
        <p className="text-white text-sm font-medium truncate">
          Sign up for a <span className="font-bold">3-day free trial</span> — Unlimited movies, series & Live TV!
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onSignup}
          className="bg-white text-purple-600 font-bold text-sm px-4 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
        >
          Start Free Trial
        </button>
        <button
          onClick={onLogin}
          className="text-white/90 hover:text-white text-sm font-medium px-3 py-1.5"
        >
          Login
        </button>
        <button onClick={onDismiss} className="text-white/70 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
function MainApp() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [userData, setUserData] = useState(null);
  const [accessStatus, setAccessStatus] = useState('loading');
  const [sessionWarning, setSessionWarning] = useState(false);
  const [sessionCountdown, setSessionCountdown] = useState(30);
  const [sessionKicked, setSessionKicked] = useState(false);
  const [deviceBlocked, setDeviceBlocked] = useState(false);
  const [deviceType, setDeviceType] = useState(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not logged in - allow guest browsing but show limited access
        setAccessStatus('guest');
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUserData(data);
          const isFreeAccess = data.role === 'admin' || data.role === 'family';
          const now = new Date();
          const trialEnds = data.trialEnds?.toDate ? data.trialEnds.toDate() : new Date(data.trialEnds);
          const subExpires = data.subscriptionExpires?.toDate
            ? data.subscriptionExpires.toDate()
            : data.subscriptionExpires ? new Date(data.subscriptionExpires) : null;
          const hasPaidSub = data.plan && data.plan !== 'free_trial' && subExpires && subExpires > now;

          if (isFreeAccess || hasPaidSub) {
            setAccessStatus('full');
          } else if (trialEnds > now) {
            setAccessStatus('trial');
          } else {
            setAccessStatus('expired');
            // Auto-show paywall when trial is expired
            setShowPaywall(true);
          }

          // Register device and check limit
          if (isFreeAccess || hasPaidSub || trialEnds > now) {
            const result = await registerDevice(user.uid);
            if (result.status === 'limit_reached') {
              setDeviceBlocked(true);
              setDeviceType(result.device_type);
            }
          }
        } else {
          // User exists in Firebase Auth but no Firestore doc - treat as guest
          setAccessStatus('guest');
        }
      } catch (e) {
        console.error('Error checking access:', e);
        setAccessStatus('guest');
      }
    });
    return unsub;
  }, []);

  // Session conflict monitor
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const localToken = localStorage.getItem('fb_session_token');
    if (!localToken) return;

    const interval = setInterval(async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.sessionToken && data.sessionToken !== localToken) {
            setSessionWarning(true);
          }
        }
      } catch (e) {}
    }, 5 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Countdown timer when warning shown
  useEffect(() => {
    if (!sessionWarning) return;
    setSessionCountdown(30);
    const timer = setInterval(() => {
      setSessionCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionWarning(false);
          setSessionKicked(true);
          import('firebase/auth').then(({ signOut }) => signOut(auth));
          localStorage.removeItem('fb_session_token');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionWarning]);

  // Listen for selectContent events from other components
  useEffect(() => {
    const handler = (e) => setSelectedContent(e.detail);
    window.addEventListener('selectContent', handler);
    return () => window.removeEventListener('selectContent', handler);
  }, []);

  // Intercept content selection — block if expired
  const handleSelectContent = (content) => {
    if (accessStatus === 'expired') {
      setShowPaywall(true);
      return;
    }
    setSelectedContent(content);
  };

  // Intercept video play — block if expired
  const handlePlayVideo = (videoId) => {
    if (accessStatus === 'expired') {
      setShowPaywall(true);
      return;
    }
    setActiveVideo(videoId);
  };

  const handleGoToPricing = () => {
    setShowPaywall(false);
    setTimeout(() => {
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (accessStatus === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const trialEnds = userData?.trialEnds;
  const getDaysLeft = (val) => {
    if (!val) return 99;
    const d = val?.toDate ? val.toDate() : new Date(val);
    return Math.max(0, Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24)));
  };
  // Show banner for all trial users (since trial is only 3 days)
  const showTrialBanner = accessStatus === 'trial' && showBanner;
  const showGuestBanner = accessStatus === 'guest' && showBanner;

  return (
    <div className="App min-h-screen bg-black">
      {/* Guest signup banner */}
      {showGuestBanner && (
        <GuestBanner
          onSignup={() => navigate('/signup')}
          onLogin={() => navigate('/login')}
          onDismiss={() => setShowBanner(false)}
        />
      )}

      {/* Trial expiry banner */}
      {showTrialBanner && (
        <TrialBanner
          trialEnds={trialEnds}
          onUpgrade={handleGoToPricing}
          onDismiss={() => setShowBanner(false)}
        />
      )}

      {accessStatus !== "expired" && accessStatus !== "guest" && <ReferralBanner />}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onSelectContent={handleSelectContent}
      />
      <HeroSection
        setActiveSection={setActiveSection}
        onPlayVideo={handlePlayVideo}
        onSelectContent={handleSelectContent}
      />
      <div id="movies">
        <ContentSection type="movies" onSelectContent={handleSelectContent} />
      </div>
      <div id="livetv"><LiveTVSection onSelectContent={handleSelectContent} /></div>
      <div id="kartuli"><KartuliSection onSelectContent={handleSelectContent} /></div>
      <div id="series">
        <ContentSection type="series" onSelectContent={handleSelectContent} />
      </div>
      <div id="download">
        <DownloadSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <FAQSection />
      <Footer />

      {activeVideo && (
        <VideoPlayer videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
      {selectedContent && (
        <ContentDetailModal accessStatus={accessStatus} onExpiredClick={() => setShowPaywall(true)}
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onPlayVideo={handlePlayVideo}
        />
      )}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />

      {/* Device Blocked Modal */}
      {deviceBlocked && (
        <DeviceBlockedModal
          deviceType={deviceType}
          onUnblocked={() => setDeviceBlocked(false)}
        />
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onGoToPricing={handleGoToPricing}
          trialEnds={trialEnds}
          onLogout={handleLogout}
        />
      )}

      {/* Session Warning Modal */}
      {sessionWarning && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 text-center border border-orange-500/30">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Someone else signed in</h2>
            <p className="text-gray-400 mb-4">Another device has signed into your account. You will be signed out in:</p>
            <div className="text-6xl font-black text-orange-400 mb-6">{sessionCountdown}</div>
            <p className="text-gray-500 text-sm">To use Family Binge on multiple screens at the same time, add the Multi-Screen option for just 20 GEL/month extra.</p>
          </div>
        </div>
      )}

      {/* Session Kicked Modal */}
      {sessionKicked && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 text-center border border-red-500/30">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">You have been signed out</h2>
            <p className="text-gray-400 mb-6">Your account was opened on another device. Only one person can use an account at a time.</p>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5 mb-6 text-left">
              <p className="text-purple-300 font-bold mb-1">Want to watch on multiple screens?</p>
              <p className="text-gray-400 text-sm">Add the <span className="text-white font-semibold">Multi-Screen add-on</span> for just <span className="text-green-400 font-bold">20 GEL/month</span> and allow up to 2 devices at the same time.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/login'} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-colors">
                Sign In Again
              </button>
              <button onClick={() => window.location.href = '/login'} className="w-full py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors">
                Contact Support to Add Multi-Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainApp;
