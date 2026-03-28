import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx')
content = src.read_text(encoding='utf-8')

# Fix 1: video element - remove autoPlay, add muted so browser allows autoplay, we unmute via JS
content = content.replace(
    '<video ref={videoRef} style={{ width: \'100%\', height: \'100%\', objectFit: \'contain\' }} controls playsInline autoPlay />',
    '<video ref={videoRef} style={{ width: \'100%\', height: \'100%\', objectFit: \'contain\' }} controls playsInline muted />'
)

# Fix 2: HLS - wait for canplay event, then play and unmute
old_hls = "hls.on(window.Hls.Events.MANIFEST_PARSED, () => { setLoading(false); videoRef.current?.play().catch(() => {}); });"
new_hls = """hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
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
content = content.replace(old_hls, new_hls)

# Fix 3: Native HLS (Safari) - same pattern
old_native = "videoRef.current.onloadedmetadata = () => { setLoading(false); videoRef.current?.play().catch(() => {}); };"
new_native = """videoRef.current.onloadedmetadata = () => {
        setLoading(false);
        const vid = videoRef.current;
        if (!vid) return;
        vid.muted = true;
        vid.play().then(() => { vid.muted = false; }).catch(() => {});
      };"""
content = content.replace(old_native, new_native)

src.write_text(content, encoding='utf-8')
print('Done!')
