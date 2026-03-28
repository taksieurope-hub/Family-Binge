import pathlib

f = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx')
c = f.read_text(encoding='utf-8')

old = """  const handleIframeLoad = () => {
    setPlayerReady(true);
    setIsAutoSwitching(false);
    // Enter fullscreen when player is ready
    setTimeout(() => enterFullscreen(), 300);
    // Start auto-next timer for series
    startAutoNextTimer(details, selectedSeason, selectedEpisode);
  };"""

new = """  const handleIframeLoad = () => {
    if (autoSwitchTimeoutRef.current) clearTimeout(autoSwitchTimeoutRef.current);
    setPlayerReady(true);
    setIsAutoSwitching(false);
    setTimeout(() => enterFullscreen(), 300);
    startAutoNextTimer(details, selectedSeason, selectedEpisode);
  };

  // Auto-switch to next source after 8 seconds if not ready
  useEffect(() => {
    if (!isPlaying) return;
    if (playerReady) return;
    if (autoSwitchTimeoutRef.current) clearTimeout(autoSwitchTimeoutRef.current);
    autoSwitchTimeoutRef.current = setTimeout(() => {
      if (!playerReady) {
        const next = currentSourceIndex + 1;
        if (next < VIDEO_SOURCES.length) {
          setCurrentSourceIndex(next);
          setPlayerReady(false);
          setIsAutoSwitching(true);
        }
      }
    }, 8000);
    return () => { if (autoSwitchTimeoutRef.current) clearTimeout(autoSwitchTimeoutRef.current); };
  }, [isPlaying, currentSourceIndex, playerReady]);"""

if old in c:
    c = c.replace(old, new)
    f.write_text(c, encoding='utf-8')
    print('SUCCESS!')
else:
    print('NOT FOUND')
