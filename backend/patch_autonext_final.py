# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx'
c = open(path, 'r', encoding='utf-8').read()

import re

# Remove clearNextTimers function
c = re.sub(r'  // Clear auto-next timers\n  const clearNextTimers = useCallback\(\(\) => \{.*?\}, \[\]\);\n', '', c, flags=re.DOTALL)

# Remove startAutoNextTimer function
c = re.sub(r'  // Start auto-next countdown.*?}, \[clearNextTimers\]\);\n', '', c, flags=re.DOTALL)

# Remove handleNext function
c = re.sub(r'  const handleNext = useCallback\(\(\) => \{.*?\}, \[details, selectedEpisode, selectedSeason, onClose\]\);\n', '', c, flags=re.DOTALL)

# Remove handleDismissNext function
c = c.replace('  // Dismiss next overlay without skipping\n  const handleDismissNext = () => {\n    clearNextTimers();\n  };\n', '')

# Remove clearNextTimers() calls
c = c.replace('  clearNextTimers();\n', '')
c = c.replace(' clearNextTimers();', '')

# Remove startAutoNextTimer call
c = c.replace('\n    startAutoNextTimer(details, selectedSeason, selectedEpisode);\n', '')

# Remove the showNextOverlay JSX block
c = re.sub(r'\s*\{/\* Auto Next Episode Overlay \*/\}\s*\{showNextOverlay.*?</div>\s*\)\s*\}\s*\}', '', c, flags=re.DOTALL)

# Remove handleNext button in header
c = re.sub(r'\s*<Button onClick=\{handleNext\}.*?Next\s*</Button>', '', c, flags=re.DOTALL)

open(path, 'w', encoding='utf-8').write(c)
print("Done!")
