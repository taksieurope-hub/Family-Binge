import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx')
content = src.read_text(encoding='utf-8')

# Fix video element - remove muted, keep controls and playsInline
content = content.replace(
    '<video ref={videoRef} style={{ width: \'100%\', height: \'100%\', objectFit: \'contain\' }} controls playsInline muted />',
    '<video ref={videoRef} style={{ width: \'100%\', height: \'100%\', objectFit: \'contain\' }} controls playsInline />'
)

# Fix HLS play - just play directly, no mute tricks
old_hls = """hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        const vid = videoRef.current;
        if (!vid) return;
        const tryPlay = () => {
          vid.muted = true;
          vid.play().then(() => { vid.muted = false; }).catch(() => {});
          vid.removeEventListener('canplay', tryPlay);
        };
        if (vid.readyState >= 3) { tryPlay(); }
        else { vid.addEventListener('canplay', tryPlay); }
      });"""
new_hls = "hls.on(window.Hls.Events.MANIFEST_PARSED, () => { setLoading(false); videoRef.current?.play().catch(() => {}); });"
content = content.replace(old_hls, new_hls)

# Fix native HLS play
old_native = """videoRef.current.onloadedmetadata = () => {
        setLoading(false);
        const vid = videoRef.current;
        if (!vid) return;
        vid.muted = true;
        vid.play().then(() => { vid.muted = false; }).catch(() => {});
      };"""
new_native = "videoRef.current.onloadedmetadata = () => { setLoading(false); videoRef.current?.play().catch(() => {}); };"
content = content.replace(old_native, new_native)

src.write_text(content, encoding='utf-8')
print('Done!')
