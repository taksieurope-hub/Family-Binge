import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ProfilePage.jsx')
content = src.read_text(encoding='utf-8')

# Add imports
old_import = "import { doc, getDoc } from 'firebase/firestore';"
new_import = "import { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { channels } from './LiveTVSection';\nimport { Tv } from 'lucide-react';"
content = content.replace(old_import, new_import)

# Add hiddenChannels state after existing useState declarations
old_state = "  const [showCancelModal, setShowCancelModal] = useState(false);\n  const [cancelling, setCancelling] = useState(false);"
new_state = """  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [hiddenChannels, setHiddenChannels] = useState([]);

  useEffect(() => {
    const loadHidden = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'hidden_channels', user.uid));
        if (snap.exists()) setHiddenChannels(snap.data().ids || []);
      } catch(e) {}
    };
    loadHidden();
  }, []);

  const unhideChannel = async (id) => {
    const next = hiddenChannels.filter(i => i !== id);
    setHiddenChannels(next);
    const user = auth.currentUser;
    if (user) await setDoc(doc(db, 'hidden_channels', user.uid), { ids: next });
  };

  const unhideAll = async () => {
    setHiddenChannels([]);
    const user = auth.currentUser;
    if (user) await setDoc(doc(db, 'hidden_channels', user.uid), { ids: [] });
  };"""
content = content.replace(old_state, new_state)

# Add Hidden Channels section before the Invite Friends section
old_section = "        {/* Invite Friends */}\n        <InviteSection compact />"
new_section = """        {/* Hidden Channels */}
        {hiddenChannels.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
              <Tv className="w-6 h-6 text-red-400" />
              Hidden Channels ({hiddenChannels.length})
            </h2>
            <div className="bg-zinc-900 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400 text-sm">These channels are hidden from your Live TV</p>
                <button onClick={unhideAll} className="text-xs bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors">
                  Restore All
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {hiddenChannels.map(id => {
                  const ch = channels.find(c => c.id === id);
                  if (!ch) return null;
                  return (
                    <div key={id} className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Tv className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-white text-sm font-medium">{ch.name}</p>
                          <p className="text-gray-500 text-xs">CH {ch.id} · {ch.category}</p>
                        </div>
                      </div>
                      <button onClick={() => unhideChannel(id)} className="text-xs bg-zinc-700 hover:bg-green-700 text-white px-3 py-1.5 rounded-full transition-colors">
                        Restore
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Invite Friends */}
        <InviteSection compact />"""
content = content.replace(old_section, new_section)

src.write_text(content, encoding='utf-8')
print('Done! Hidden Channels section added to ProfilePage.')
