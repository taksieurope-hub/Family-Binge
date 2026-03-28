import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# Fix 1: Replace the broken category buttons section
old_buttons = '''        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {<button
              key="all"
              onClick={() => setSelectedCategory("")}
              style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: !selectedCategory ? "#a855f7" : "#1a1a2e", color: !selectedCategory ? "#fff" : "#aaa" }}
            >
              All Channels
            </button>
            {categories.map(cat => {
            const count = cat === 'All' ? channels.length : visibleChannels.filter(c => c.category === cat).length;
            if (count === 0) return null;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'}`}>
                {cat} ({count})
              </button>
            );
          })}
        </div>'''

new_buttons = '''        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['All', ...categories].filter((v, i, a) => a.indexOf(v) === i).map(cat => {
            const count = cat === 'All' ? visibleChannels.length : visibleChannels.filter(c => c.category === cat).length;
            if (count === 0) return null;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'}`}>
                {cat === 'All' ? 'All Channels' : cat} ({count})
              </button>
            );
          })}
        </div>'''

if old_buttons in content:
    content = content.replace(old_buttons, new_buttons)
    print('Category buttons fixed!')
else:
    print('ERROR: Could not find the button block. No changes made.')

src.write_text(content, encoding='utf-8')
