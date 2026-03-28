import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx')
content = src.read_text(encoding='utf-8')

content = content.replace(
    "<video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} controls playsInline\n/>",
    "<video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} controls playsInline autoPlay />"
)

src.write_text(content, encoding='utf-8')
print('Done! Result:')
import subprocess
result = subprocess.run(['powershell', '-Command', 'Get-Content "C:\\Users\\edahl\\Desktop\\Family Binge\\frontend\\src\\components\\LiveTVPage.jsx" | Select-String "video ref"'], capture_output=True, text=True)
print(result.stdout)
