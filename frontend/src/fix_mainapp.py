import pathlib

path = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx')
c = path.read_text(encoding='utf-8')

# Remove LiveTVSection import
c = c.replace('import LiveTVSection from "./components/LiveTVSection";\n', '')

# Remove LiveTVSection from the JSX and fix the series div
old = '      <div id="series">\n        <div id="livetv"><LiveTVSection accessStatus={accessStatus} onExpiredClick={() => setShowPaywall(true)} /></div>\n        <ContentSection type="series" onSelectContent={handleSelectContent} />\n      </div>'
new = '      <div id="series">\n        <ContentSection type="series" onSelectContent={handleSelectContent} />\n      </div>'

if old in c:
    c = c.replace(old, new)
    path.write_text(c, encoding='utf-8')
    print('Done! LiveTVSection removed from home page, series fixed.')
else:
    print('ERROR: pattern not found - paste the file contents')
