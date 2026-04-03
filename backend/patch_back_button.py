# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = "  // Listen for selectContent events from other components"
new = """  // Handle mobile back button - prevent going to login
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
    const handlePop = () => {
      window.history.pushState(null, '', window.location.pathname);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Listen for selectContent events from other components"""

if old in c:
    c = c.replace(old, new)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
