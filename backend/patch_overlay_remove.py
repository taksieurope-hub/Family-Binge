# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Find and remove the overlay block
start = c.find('          {/* Auto Next Episode Overlay */}')
end = c.find('        </div>\n      </div>\n    );\n  }\n\n  // --- DETAILS VIEW ---')

if start == -1:
    print("ERROR: start not found")
elif end == -1:
    print("ERROR: end not found")
else:
    c = c[:start] + c[end:]
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
