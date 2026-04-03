# -*- coding: utf-8 -*-
import os

banner = '''        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
          <p className="text-yellow-400 text-sm">Due to database upgrades, please sign up again. We apologize for the inconvenience this upgrade may have caused while we aim to improve your experience.</p>
        </div>'''

# Fix LoginPage - remove wrong banner and add in right place
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LoginPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Remove the wrongly placed empty banner
c = c.replace('      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">\n      </div>\n', '')

# Add banner before the form
old = '        <form onSubmit={handleSubmit} className="space-y-6">'
new = banner + '\n        <form onSubmit={handleSubmit} className="space-y-6">'
c = c.replace(old, new)
open(path, 'w', encoding='utf-8').write(c)
print("LoginPage: Done!")

# Add to LandingPage - find the hero section
path2 = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LandingPage.jsx'
c2 = open(path2, 'r', encoding='utf-8').read()
if 'database upgrades' in c2:
    print("LandingPage: already has banner")
else:
    # Add as a fixed top banner
    old2 = 'return ('
    new2 = '''return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500/90 text-black text-center py-2 px-4 text-sm font-medium">
        Due to database upgrades, please sign up again. We apologize for any inconvenience while we improve your experience.
      </div>'''
    c2 = c2.replace(old2, new2, 1)
    # Close the fragment at the end
    c2 = c2.replace('  );\n};\n\nexport default LandingPage;', '    </>\n  );\n};\n\nexport default LandingPage;')
    open(path2, 'w', encoding='utf-8').write(c2)
    print("LandingPage: Done!")
