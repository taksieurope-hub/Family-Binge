# -*- coding: utf-8 -*-

# Fix LoginPage mobile padding and banner
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LoginPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

# Fix container padding for mobile
c = c.replace(
    'className="min-h-screen bg-black flex items-center justify-center p-6">\n      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-10">',
    'className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6">\n      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-6 sm:p-10">'
)

# Make banner smaller on mobile
c = c.replace(
    '<div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">\n          <p className="text-yellow-400 text-sm">Due to database upgrades, please sign up again. We apologize for the inconvenience this upgrade may have caused while we aim to improve your experience.</p>\n        </div>',
    '<div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">\n          <p className="text-yellow-400 text-xs">Due to database upgrades, please sign up again. We apologize for any inconvenience.</p>\n        </div>'
)

# Fix title margin
c = c.replace(
    'className="text-4xl font-bold text-center mb-8"',
    'className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8"'
)

open(path, 'w', encoding='utf-8').write(c)
print("LoginPage: Done!")

# Fix Navbar - make user menu visible on mobile
path2 = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\Navbar.jsx'
c2 = open(path2, 'r', encoding='utf-8').read()

# Make user menu show on mobile too
c2 = c2.replace(
    '<div ref={userMenuRef} className="hidden sm:block relative">',
    '<div ref={userMenuRef} className="relative">'
)

# Make bell hidden on mobile still but user menu always visible
open(path2, 'w', encoding='utf-8').write(c2)
print("Navbar: Done!")
