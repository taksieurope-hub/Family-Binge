# -*- coding: utf-8 -*-

# Remove from LoginPage - banner inside trial info screen
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LoginPage.jsx'
c = open(path, 'r', encoding='utf-8').read()
c = c.replace('      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">\n        <p className="text-yellow-400 text-sm">Due to database upgrades, please sign up again. We apologize for the inconvenience this upgrade may have caused while we aim to improve your experience.</p>\n      </div>\n', '')
c = c.replace('        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">\n          <p className="text-yellow-400 text-xs">Due to database upgrades, please sign up again. We apologize for any inconvenience.</p>\n        </div>\n', '')
open(path, 'w', encoding='utf-8').write(c)
print("LoginPage: Done!")

# Remove from SignupPage
path2 = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\SignupPage.jsx'
c2 = open(path2, 'r', encoding='utf-8').read()
c2 = c2.replace('      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">\n        <p className="text-yellow-400 text-sm">Due to database upgrades, please sign up again. We apologize for the inconvenience this upgrade may have caused while we aim to improve your experience.</p>\n      </div>\n', '')
open(path2, 'w', encoding='utf-8').write(c2)
print("SignupPage: Done!")

# Remove from LandingPage
path3 = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LandingPage.jsx'
c3 = open(path3, 'r', encoding='utf-8').read()
c3 = c3.replace('      <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500/90 text-black text-center py-2 px-4 text-sm font-medium">\n        Due to database upgrades, please sign up again. We apologize for any inconvenience while we improve your experience.\n      </div>\n', '')
c3 = c3.replace('    <>\n', '').replace('\n    </>', '')
open(path3, 'w', encoding='utf-8').write(c3)
print("LandingPage: Done!")
