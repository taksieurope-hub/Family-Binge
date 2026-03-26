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

function MainApp() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  // === SUBSCRIPTION + TRIAL CHECK (this is the fixed part) ===
  useEffect(() => {
    const signupDate = localStorage.getItem('familybinge_signup_date');
    const paid = localStorage.getItem('familybinge_paid') === 'true';
    const expiresStr = localStorage.getItem('familybinge_subscription_expires');

    if (paid && expiresStr) {
      const expires = new Date(expiresStr);
      if (expires > new Date()) {
        setIsTrialExpired(false);
        return;
      }
    }

    // Free trial logic
    if (signupDate) {
      const daysSinceSignup = (new Date() - new Date(signupDate)) / (1000 * 60 * 60 * 24);
      setIsTrialExpired(daysSinceSignup > 3);
    } else {
      localStorage.setItem('familybinge_signup_date', new Date().toISOString());
      setIsTrialExpired(false);
    }
  }, []);

  if (isTrialExpired) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Your Subscription Has Ended</h1>
          <p className="text-gray-400 mb-8">Please subscribe to continue watching movies, series and Live TV.</p>
          <button
            onClick={() => navigate('/app#pricing')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 rounded-2xl text-xl font-semibold"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-black">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onSelectContent={setSelectedContent}
      />
      <HeroSection
        setActiveSection={setActiveSection}
        onPlayVideo={setActiveVideo}
        onSelectContent={setSelectedContent}
      />
      <div id="movies">
        <ContentSection type="movies" onSelectContent={setSelectedContent} />
      </div>
      <div id="series">
        <ContentSection type="series" onSelectContent={setSelectedContent} />
      </div>
      <div id="download">
        <DownloadSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <FAQSection />
      <Footer />
      {activeVideo && <VideoPlayer videoId={activeVideo} onClose={() => setActiveVideo(null)} />}
      {selectedContent && <ContentDetailModal content={selectedContent} onClose={() => setSelectedContent(null)} />}
      <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} />
    </div>
  );
}

export default MainApp;