import pathlib

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ProfilePage.jsx')
content = src.read_text(encoding='utf-8')

old = """  const unhideChannel = async (id) => {
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

new = """  const unhideChannel = async (id) => {
    const next = hiddenChannels.filter(i => i !== id);
    setHiddenChannels(next);
    const u = auth.currentUser;
    if (u) await setDoc(doc(db, 'hidden_channels', u.uid), { ids: next });
  };

  const unhideAll = async () => {
    setHiddenChannels([]);
    const u = auth.currentUser;
    if (u) await setDoc(doc(db, 'hidden_channels', u.uid), { ids: [] });
  };"""

content = content.replace(old, new)

# Also fix the loadHidden to use auth.currentUser directly
old2 = """    const loadHidden = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'hidden_channels', user.uid));
        if (snap.exists()) setHiddenChannels(snap.data().ids || []);
      } catch(e) {}
    };"""

new2 = """    const loadHidden = async () => {
      const u = auth.currentUser;
      if (!u) { setTimeout(loadHidden, 500); return; }
      try {
        const snap = await getDoc(doc(db, 'hidden_channels', u.uid));
        if (snap.exists()) setHiddenChannels(snap.data().ids || []);
      } catch(e) { console.error('loadHidden error', e); }
    };"""

content = content.replace(old2, new2)
src.write_text(content, encoding='utf-8')
print('Done!')
