import React, { useState } from "react";

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
  const [activeSection, setActiveSection] = useState("home");
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

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

      <DownloadModal 
        isOpen={showDownloadModal} 
        onClose={() => setShowDownloadModal(false)} 
      />
    </div>
  );
}

export default MainApp;