# -*- coding: utf-8 -*-
import os

message = "Due to database upgrades, please sign up again. We apologize for the inconvenience this upgrade may have caused while we aim to improve your experience."

for filename in ['LoginPage.jsx', 'SignupPage.jsx']:
    path = rf'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\{filename}'
    if not os.path.exists(path):
        print(f"NOT FOUND: {filename}")
        continue
    c = open(path, 'r', encoding='utf-8').read()
    banner = f'''      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center">
        <p className="text-yellow-400 text-sm">{message}</p>
      </div>\n'''
    # Insert after the opening form/container div
    if 'mb-6 p-4 bg-yellow-500/10' in c:
        print(f"{filename}: banner already exists")
        continue
    # Find a good insertion point - after the title/heading
    insert_after = '<h2 '
    idx = c.find(insert_after)
    if idx == -1:
        insert_after = '<h1 '
        idx = c.find(insert_after)
    if idx != -1:
        # Find end of that line
        end = c.find('\n', idx) + 1
        c = c[:end] + banner + c[end:]
        open(path, 'w', encoding='utf-8').write(c)
        print(f"{filename}: Done!")
    else:
        print(f"{filename}: ERROR - insertion point not found")
