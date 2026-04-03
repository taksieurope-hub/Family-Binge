# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\Navbar.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = """              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center justify-between px-5 py-3.5 text-left font-medium transition-colors border-b border-white/5 last:border-0 ${activeSection === item.id ? 'text-white bg-purple-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <span>{item.label}</span>
                </button>
              ))}"""

new = """              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center justify-between px-5 py-3.5 text-left font-medium transition-colors border-b border-white/5 last:border-0 ${activeSection === item.id ? 'text-white bg-purple-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="border-t border-white/10 mt-1" />
              <button
                onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-5 py-3.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <User className="w-4 h-4" /> My Profile
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="flex items-center gap-3 px-5 py-3.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border-b border-white/5 font-semibold"
              >
                Free Trial
              </button>
              <button
                onClick={async () => { await signOut(auth); window.location.href = "/"; }}
                className="flex items-center gap-3 px-5 py-3.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>"""

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
