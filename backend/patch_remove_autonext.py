# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx'
c = open(path, 'r', encoding='utf-8').read()

removals = [
    "// Auto next episode countdown (seconds before end of episode)\nconst AUTO_NEXT_COUNTDOWN = 15;\n// Approximate episode duration in ms (40 min) - triggers the \"Up Next\" overlay\nconst EPISODE_DURATION_MS = 40 * 60 * 1000;\n",
    "  const [showNextOverlay, setShowNextOverlay] = useState(false);\n",
    "  const [nextCountdown, setNextCountdown] = useState(AUTO_NEXT_COUNTDOWN);\n",
    "  const episodeTimerRef = useRef(null);\n",
    "  const countdownIntervalRef = useRef(null);\n",
]

for old in removals:
    if old in c:
        c = c.replace(old, '')
        print(f"Removed: {old[:60].strip()}")
    else:
        print(f"NOT FOUND: {old[:60].strip()}")

# Remove the clearNextTimers function
import re
c = re.sub(r'  // Clear auto-next timers\n  const clearNextTimers.*?}\), \[\]\);\n', '', c, flags=re.DOTALL)
# Remove the startAutoNextTimer function
c = re.sub(r'  // Start auto-next countdown.*?}\), \[clearNextTimers\]\);\n', '', c, flags=re.DOTALL)
# Remove clearNextTimers from useEffect cleanup and deps
c = c.replace('      clearNextTimers();\n', '')
c = c.replace(', clearNextTimers]', ']')

open(path, 'w', encoding='utf-8').write(c)
print("Done!")
