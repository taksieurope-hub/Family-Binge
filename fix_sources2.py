import pathlib

f = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx')
c = f.read_text(encoding='utf-8')

old = """const VIDEO_SOURCES = [
  { name: 'VidSrc Pro',  getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` : `https://vidsrc.pro/embed/movie/${id}` },
  { name: 'VidSrc CC',   getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: 'VidSrc XYZ',  getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}` },
  { name: 'Smashy',      getUrl: (type, id, s, e) => type === 'series' ? `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}` : `https://player.smashy.stream/movie/${id}` },
  { name: 'MultiEmbed',  getUrl: (type, id, s, e) => type === 'series' ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
];"""

new = """const VIDEO_SOURCES = [
  { name: 'VidSrc Pro',  getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` : `https://vidsrc.pro/embed/movie/${id}` },
  { name: 'Embed.su',    getUrl: (type, id, s, e) => type === 'series' ? `https://embed.su/embed/tv/${id}/${s}/${e}` : `https://embed.su/embed/movie/${id}` },
  { name: 'VidSrc CC',   getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: 'VidSrc XYZ',  getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}` },
  { name: 'Smashy',      getUrl: (type, id, s, e) => type === 'series' ? `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}` : `https://player.smashy.stream/movie/${id}` },
  { name: 'MultiEmbed',  getUrl: (type, id, s, e) => type === 'series' ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
];"""

if old in c:
    c = c.replace(old, new)
    f.write_text(c, encoding='utf-8')
    print('SUCCESS!')
else:
    print('NOT FOUND')
