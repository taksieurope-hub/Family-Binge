# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = "            <button onClick={() => { setIsPlaying(false); }} className=\"p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors\">\n              <X className=\"w-4 h-4 text-white\" />\n            </button>"

new = """            {details?.type === 'series' && (
              <button
                onClick={() => {
                  const nextEp = selectedEpisode + 1;
                  setSelectedEpisode(nextEp);
                  setCurrentSourceIndex(0);
                  setPlayerReady(false);
                  setIsAutoSwitching(true);
                  saveToWatchHistory(details, selectedSeason, nextEp, 0);
                  window.dispatchEvent(new Event('watchHistoryUpdated'));
                }}
                className="flex items-center gap-1 px-3 py-2 bg-purple-600/80 hover:bg-purple-600 rounded-lg transition-colors text-white text-xs font-semibold"
              >
                <SkipForward className="w-4 h-4" /> Next
              </button>
            )}
            <button onClick={() => { setIsPlaying(false); }} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>"""

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
