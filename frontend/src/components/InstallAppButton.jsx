import { useState, useEffect } from 'react';

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
      setShowButton(false);
    }
  };

  if (installed) return (
    <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 20px',background:'#39FF1422',border:'1px solid #39FF14',borderRadius:'8px',color:'#39FF14',fontSize:'14px'}}>
      ✅ App Installed
    </div>
  );

  if (!showButton) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'16px 24px',background:'#1a1a2e',border:'1px solid #333',borderRadius:'12px',color:'#aaa',fontSize:'13px',textAlign:'center',maxWidth:'280px'}}>
      <span style={{fontSize:'24px'}}>📺</span>
      <strong style={{color:'#fff'}}>Install Family Binge</strong>
      <span>Open this page in your device browser, then use the browser menu to <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></span>
    </div>
  );

  return (
    <button
      onClick={handleInstall}
      style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 28px',background:'linear-gradient(135deg,#39FF14,#00cc00)',border:'none',borderRadius:'10px',color:'#000',fontWeight:'bold',fontSize:'16px',cursor:'pointer',boxShadow:'0 0 20px #39FF1466'}}
    >
      ⬇️ Install App
    </button>
  );
}
