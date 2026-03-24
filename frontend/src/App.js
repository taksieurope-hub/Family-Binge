import React, { useState, useEffect } from "react";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LiveTVSection from "./components/LiveTVSection";
import ContentSection from "./components/ContentSection";
import DownloadSection from "./components/DownloadSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import VideoPlayer from "./components/VideoPlayer";
import ContentDetailModal from "./components/ContentDetailModal";
import LiveTVPlayer from "./components/LiveTVPlayer";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
        setSelectedContent(null);
        setSelectedChannel(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for selectContent events from similar content clicks
  useEffect(() => {
    const handleSelectContent = (e) => {
      setSelectedContent(e.detail);
    };

    window.addEventListener("selectContent", handleSelectContent);
    return () => window.removeEventListener("selectContent", handleSelectContent);
  }, []);

  // Scroll to section when navigation changes
  useEffect(() => {
    if (activeSection !== "home") {
      const element = document.getElementById(activeSection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  const handlePlayVideo = (videoId) => {
    setActiveVideo(videoId);
  };

  const handleSelectContent = (content) => {
    setSelectedContent(content);
  };

  const handlePlayChannel = (channel) => {
    setSelectedChannel(channel);
  };

  return (
    <div className="App min-h-screen bg-black">
      {/* Navigation */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onSelectContent={handleSelectContent}
      />

      {/* Hero Section */}
      <HeroSection 
        setActiveSection={setActiveSection} 
        onPlayVideo={handlePlayVideo}
        onSelectContent={handleSelectContent}
      />

      {/* Live TV Section */}
      <div id="live-tv">
        <LiveTVSection onPlayChannel={handlePlayChannel} />
      </div>

      {/* Movies Section */}
      <div id="movies">
        <ContentSection type="movies" onSelectContent={handleSelectContent} />
      </div>

      {/* Series Section */}
      <div id="series">
        <ContentSection type="series" onSelectContent={handleSelectContent} />
      </div>

      {/* Download Section */}
      <div id="download">
        <DownloadSection />
      </div>

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      {/* Video Player Modal (for trailers) */}
      {activeVideo && (
        <VideoPlayer 
          videoId={activeVideo} 
          onClose={() => setActiveVideo(null)} 
        />
      )}

      {/* Content Detail Modal */}
      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onPlayVideo={handlePlayVideo}
        />
      )}

      {/* Live TV Player */}
      {selectedChannel && (
        <LiveTVPlayer
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </div>
  );
}

export default App;
