path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx'
c = open(path, 'r', encoding='utf-8').read()

# The broken pattern: useEffect starts, then channels get injected before closing
bad = """const url = activeChannel.streams[streamIndex];
  { id: 321, name: 'Comedy Central',"""

good = """const url = activeChannel.streams[streamIndex];
    if (!url) return;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, () => {
        if (streamIndex + 1 < activeChannel.streams.length) setStreamIndex(i => i + 1);
      });
      video.play().catch(() => {});
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(() => {});
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [activeChannel, streamIndex]);

  const selectChannel = (ch) => { setActiveChannel(ch); setStreamIndex(0); };
"""

if bad[:50] in c:
    # Find the bad useEffect and the duplicate closing
    # Remove everything between "const url = ..." and the second "if (!url) return;"
    import re
    
    # Pattern: from "const url = activeChannel.streams[streamIndex];" 
    # followed by channel data, up to the legitimate "if (!url) return;"
    pattern = r"const url = activeChannel\.streams\[streamIndex\];\n  \{ id: 321.*?\n    if \(!url\) return;.*?}, \[activeChannel, streamIndex\]\);\n\n  const selectChannel"
    
    replacement = good + "\n  const selectChannel"
    
    new_c = re.sub(pattern, replacement, c, flags=re.DOTALL)
    
    if new_c != c:
        open(path, 'w', encoding='utf-8').write(new_c)
        print("Fixed!")
    else:
        print("Pattern not matched, trying alternative...")
        # Find the two occurrences of "if (!url) return;" and remove the duplicate block
        idx1 = c.find("const url = activeChannel.streams[streamIndex];")
        idx2 = c.find("if (!url) return;", idx1)
        
        # Replace everything from idx1 to idx2 with the correct code
        new_c = c[:idx1] + "const url = activeChannel.streams[streamIndex];\n    " + c[idx2:]
        open(path, 'w', encoding='utf-8').write(new_c)
        print("Fixed with alternative method!")
else:
    print("File may already be fixed or pattern changed")
    print("First 200 chars around useEffect:")
    idx = c.find("const url = activeChannel")
    print(repr(c[idx:idx+200]))
