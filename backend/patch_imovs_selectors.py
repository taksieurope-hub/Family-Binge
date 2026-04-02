# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\backend\routers\imovs.py'
c = open(path, 'r', encoding='utf-8').read()

old = '    for item in soup.select(".short-item, .th-item, article, .movie-item, .news-item"):'
new = '    for item in soup.select(".post"):'

old2 = '''        href = a.get("href", "")
        if "imovs.ge" not in href and not href.startswith("/"):
            continue
        movies.append({
            "title": title_el.get_text(strip=True) if title_el else (img.get("alt", "") if img else ""),
            "url": href if href.startswith("http") else f"https://www.imovs.ge{href}",
            "poster": img.get("src", "") if img else "",
        })'''

new2 = '''        href = a.get("href", "")
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

c = c.replace(old, new).replace(old2, new2)
open(path, 'w', encoding='utf-8').write(c)
print("Done!")
