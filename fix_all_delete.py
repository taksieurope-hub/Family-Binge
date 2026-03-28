import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVSection.jsx')
content = src.read_text(encoding='utf-8')

# 1. Add deletedIds state + showDeleteButtons + handlers after the existing useState lines
old_state = 'const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(false);'
new_state = '''const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [deletedIds, setDeletedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fb_deleted') || '[]'); } catch(e) { return []; }
  });
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Permanently hide this channel?')) return;
    const next = [...deletedIds, id];
    setDeletedIds(next);
    localStorage.setItem('fb_deleted', JSON.stringify(next));
  };

  const handleRestoreAll = () => {
    setDeletedIds([]);
    localStorage.removeItem('fb_deleted');
  };

  const visibleChannels = channels.filter(c => !deletedIds.includes(c.id));'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)
    print('Step 1 OK: state added')
else:
    print('ERROR Step 1: could not find state block')

# 2. Fix the filtered line to use visibleChannels
content = content.replace(
    'const filtered = visibleChannels.filter(c => {',
    'const filtered = visibleChannels.filter(c => {'
)
# Make sure filtered uses visibleChannels not channels
content = re.sub(r'const filtered = channels\.filter', 'const filtered = visibleChannels.filter', content)

# 3. Replace the category filter bar with one that includes "All Channels" + delete toggle + restore button
old_bar = 'const categories = ['
# Find the full categories line and replace
content = re.sub(
    r"const categories = \[.*?\];",
    "const categories = ['All', 'News', 'Movies', 'Series', 'Entertainment', 'Comedy', 'Sports', 'Business', 'Documentary', 'Nature', 'Travel', 'Cooking', 'Family', 'Science', 'Religious', 'Animation', 'Music', 'Lifestyle', 'Kids', 'Outdoor', 'Weather', 'Shopping', 'Classic', 'Auto', 'Education', 'General'];",
    content,
    flags=re.DOTALL
)
print('Step 3 OK: categories cleaned')

# 4. Replace the category buttons block
old_buttons = '''        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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

new_buttons = '''        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {categories.map(cat => {
            const count = cat === 'All' ? visibleChannels.length : visibleChannels.filter(c => c.category === cat).length;
            if (count === 0) return null;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'}`}>
                {cat === 'All' ? 'All Channels' : cat} ({count})
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowDelete(d => !d)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 ${showDelete ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-red-400 hover:bg-zinc-700'}`}>
            {showDelete ? '✕ Hide Delete Buttons' : '🗑 Manage Channels'}
          </button>
          {deletedIds.length > 0 && (
            <button onClick={handleRestoreAll}
              className="px-4 py-2 rounded-full text-xs font-medium bg-green-700 text-white hover:bg-green-600 transition-all flex-shrink-0">
              ↩ Restore {deletedIds.length} hidden channel{deletedIds.length > 1 ? 's' : ''}
            </button>
          )}
          {showDelete && <span className="text-xs text-red-400">Click ✕ on any channel to permanently hide it</span>}
        </div>'''

if old_buttons in content:
    content = content.replace(old_buttons, new_buttons)
    print('Step 4 OK: buttons replaced')
else:
    # Try to find and replace the broken version from before
    old_buttons2 = '''        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {<button
              key="all"
              onClick={() => setSelectedCategory("")}'''
    if old_buttons2 in content:
        # find end of this block
        start = content.index(old_buttons2)
        end = content.index('</div>', start) + 6
        content = content[:start] + new_buttons + content[end:]
        print('Step 4 OK: replaced broken button block')
    else:
        print('WARNING Step 4: button block not found - may need manual check')

# 5. Add delete button inside each channel card
# Find the channel card button and inject delete button
old_card_inner = '''              <div className="p-2.5 bg-zinc-900">
                <p className="text-white text-xs font-semibold truncate">{channel.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{channel.category}</p>
              </div>
            </button>'''

new_card_inner = '''              <div className="p-2.5 bg-zinc-900">
                <p className="text-white text-xs font-semibold truncate">{channel.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{channel.category}</p>
              </div>
              {showDelete && (
                <button
                  onClick={(e) => handleDelete(e, channel.id)}
                  className="absolute top-1 right-1 z-20 w-6 h-6 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  title="Hide this channel">
                  ✕
                </button>
              )}
            </button>'''

if old_card_inner in content:
    content = content.replace(old_card_inner, new_card_inner)
    print('Step 5 OK: delete button added to cards')
else:
    print('WARNING Step 5: card inner not found - check manually')

# 6. Make sure channel card button has relative positioning
content = content.replace(
    'className={`relative rounded-2xl overflow-hidden border transition-all duration-200 text-left group',
    'className={`relative rounded-2xl overflow-hidden border transition-all duration-200 text-left group'
)

src.write_text(content, encoding='utf-8')
print('\nDone! Summary:')
print('- All Channels filter added (shows all channels)')
print('- Manage Channels button toggles delete mode')
print('- Red X appears on each card in delete mode')
print('- Deleted channels stored in localStorage')
print('- Restore button appears when channels are hidden')
