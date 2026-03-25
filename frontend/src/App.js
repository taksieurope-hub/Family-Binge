import React, { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ContentSection from "./components/ContentSection";
import DownloadSection from "./components/DownloadSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import VideoPlayer from "./components/VideoPlayer";
import ContentDetailModal from "./components/ContentDetailModal";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
        setSelectedContent(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleSelectContent = (e) => {
      setSelectedContent(e.detail);
    };
    window.addEventListener("selectContent", handleSelectContent);
    return () => window.removeEventListener("selectContent", handleSelectContent);
  }, []);

  useEffect(() => {
    if (activeSection !== "home") {
      const element = document.getElementById(activeSection);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

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

      {activeVideo && (
        <VideoPlayer videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onPlayVideo={setActiveVideo}
        />
      )}
    </div>
  );
}

export default App;
