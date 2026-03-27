import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ContentSection from "./components/ContentSection";
import DownloadSection from "./components/DownloadSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import VideoPlayer from "./components/VideoPlayer";
import ContentDetailModal from "./components/ContentDetailModal";
import DownloadModal from "./components/DownloadModal";
import { auth, db } from "./services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Crown, AlertTriangle, X } from "lucide-react";

// ── Paywall Modal ──────────────────────────────────────────────────────────────
const PaywallModal = ({ onClose, onGoToPricing, trialEnds }) => {
  const formatDate = (val) => {
    if (!val) return '';
    const d = val?.toDate ? val.toDate() : new Date(val);
    return d.toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">Trial Expired</h2>

        {trialEnds && (
          <p className="text-gray-400 text-sm mb-2">
            Your free trial ended on{" "}
            <span className="text-white font-semibold">{formatDate(trialEnds)}</span>
          </p>
        )}

        <p className="text-gray-400 mb-8">
          Subscribe to unlock unlimited movies, series, and Live TV.
        </p>

        <button
          onClick={onGoToPricing}
          className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <Crown className="w-5 h-5" />
          View Plans & Subscribe
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Maybe later (browse only)
        </button>
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
      weekday: 'long', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getDaysLeft = (val) => {
    if (!val) return 0;
    const d = val?.toDate ? val.toDate() : new Date(val);
    return Math.max(0, Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysLeft(trialEnds);

  return (
    <div className={`w-full px-6 py-3 flex items-center justify-between gap-4 ${daysLeft <= 1 ? 'bg-red-600' : 'bg-orange-500'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
        <p className="text-white text-sm font-medium truncate">
          {daysLeft === 0
            ? `⚠️ Trial expires today at ${(trialEnds?.toDate ? trialEnds.toDate() : new Date(trialEnds)).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}`
            : `Free trial expires ${formatDate(trialEnds)} — ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
          }
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onUpgrade}
          className="bg-white text-orange-600 font-bold text-sm px-4 py-1.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1"
        >
          <Crown className="w-4 h-4" /> Upgrade
        </button>
        <button onClick={onDismiss} className="text-white/70 hover:text-white">
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
  const [accessStatus, setAccessStatus] = useState('loading'); // 'loading' | 'full' | 'trial' | 'expired' | 'guest'

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAccessStatus('guest');
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUserData(data);
          const now = new Date();
          const trialEnds = data.trialEnds?.toDate ? data.trialEnds.toDate() : new Date(data.trialEnds);
          const subExpires = data.subscriptionExpires?.toDate
            ? data.subscriptionExpires.toDate()
            : data.subscriptionExpires ? new Date(data.subscriptionExpires) : null;

          const hasPaidSub = data.plan && data.plan !== 'free_trial' && subExpires && subExpires > now;

          if (hasPaidSub) {
            setAccessStatus('full');
          } else if (trialEnds > now) {
            setAccessStatus('trial');
          } else {
            setAccessStatus('expired');
          }
        } else {
          setAccessStatus('guest');
        }
      } catch (e) {
        console.error('Error checking access:', e);
        setAccessStatus('guest');
      }
    });
    return unsub;
  }, []);

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
  const showTrialBanner = accessStatus === 'trial' && showBanner && getDaysLeft(trialEnds) <= 2;

  return (
    <div className="App min-h-screen bg-black">
      {/* Trial expiry banner */}
      {showTrialBanner && (
        <TrialBanner
          trialEnds={trialEnds}
          onUpgrade={handleGoToPricing}
          onDismiss={() => setShowBanner(false)}
        />
      )}

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
      <div id="series">
        <div id="livetv">
</div>
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
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onPlayVideo={handlePlayVideo}
        />
      )}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onGoToPricing={handleGoToPricing}
          trialEnds={trialEnds}
        />
      )}
    </div>
  );
}

export default MainApp;
