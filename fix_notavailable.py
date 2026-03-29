import pathlib

f = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx')
c = f.read_text(encoding='utf-8')

old = """        const next = currentSourceIndex + 1;
        if (next < VIDEO_SOURCES.length) {
          setCurrentSourceIndex(next);
          setPlayerReady(false);
          setIsAutoSwitching(true);
        }"""

new = """        const next = currentSourceIndex + 1;
        if (next < VIDEO_SOURCES.length) {
          setCurrentSourceIndex(next);
          setPlayerReady(false);
          setIsAutoSwitching(true);
        } else {
          setIsAutoSwitching(false);
          setPlayerReady(false);
          setCurrentSourceIndex(-1);
        }"""

if old in c:
    c = c.replace(old, new)
    f.write_text(c, encoding='utf-8')
    print('SUCCESS!')
else:
    print('NOT FOUND')
