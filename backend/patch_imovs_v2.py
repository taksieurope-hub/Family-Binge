# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\backend\routers\imovs.py'
c = open(path, 'r', encoding='utf-8').read()

old = '    for item in soup.select(".post"):'
new = '    seen = set()\n    for a in soup.select("a[href*=\'.html\']"):'

old2 = '''        a = item.select_one("a[href]")
        img = item.select_one("img")
        title_el = item.select_one(".short-title, .th-title, h2, h3, .title")
        if not a:
            continue
        href = a.get("href", "")
        if not href or ".html" not in href:
            continue
        full_url = href if href.startswith("http") else f"https://www.imovs.ge{href}"
        title = ""
        if title_el:
            title = title_el.get_text(strip=True)
        elif img:
            title = img.get("alt", "")
        if not title:
            title = a.get_text(strip=True)
        poster = ""
        if img:
            poster = img.get("src", "") or img.get("data-src", "") or img.get("data-lazy-src", "")
            if poster and not poster.startswith("http"):
                poster = "https://www.imovs.ge" + poster
        if not title:
            continue
        movies.append({
            "title": title,
            "url": full_url,
            "poster": poster,
        })'''

new2 = '''        href = a.get("href", "")
        if not href or ".html" not in href:
            continue
        full_url = href if href.startswith("http") else f"https://www.imovs.ge{href}"
        if full_url in seen:
            continue
        seen.add(full_url)
        img = a.find("img")
        title = ""
        if img:
            title = img.get("alt", "")
        if not title:
            title = a.get_text(strip=True).strip()
        poster = ""
        if img:
            poster = img.get("src", "") or img.get("data-src", "") or img.get("data-lazy-src", "")
            if poster and not poster.startswith("http"):
                poster = "https://www.imovs.ge" + poster
        if not title or len(title) < 3:
            continue
        movies.append({
            "title": title,
            "url": full_url,
            "poster": poster,
        })'''

c = c.replace(old, new).replace(old2, new2)
open(path, 'w', encoding='utf-8').write(c)
print("Done!")
