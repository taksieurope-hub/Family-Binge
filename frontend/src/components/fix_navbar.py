import pathlib

path = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\Navbar.jsx')
c = path.read_text(encoding='utf-8')

old = "  const scrollToSection = (id) => {\n    setActiveSection(id);\n    setMobileMenuOpen(false);\n\n    if (id === 'home') {\n      window.scrollTo({ top: 0, behavior: 'smooth' });\n      return;\n    }\n\n    const element = document.getElementById(id);\n    if (element) {\n      element.scrollIntoView({ behavior: 'smooth', block: 'start' });\n    }\n  };"

new = "  const scrollToSection = (id) => {\n    if (id === 'livetv') {\n      navigate('/livetv');\n      setMobileMenuOpen(false);\n      return;\n    }\n    setActiveSection(id);\n    setMobileMenuOpen(false);\n\n    if (id === 'home') {\n      window.scrollTo({ top: 0, behavior: 'smooth' });\n      return;\n    }\n\n    const element = document.getElementById(id);\n    if (element) {\n      element.scrollIntoView({ behavior: 'smooth', block: 'start' });\n    }\n  };"

if old in c:
    c = c.replace(old, new)
    path.write_text(c, encoding='utf-8')
    print('Fixed! Live TV now navigates to /livetv')
else:
    print('ERROR: could not find scrollToSection - check manually')
