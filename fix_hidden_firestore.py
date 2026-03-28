import pathlib, re

src = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx')
content = src.read_text(encoding='utf-8')

# Replace the import line
old_import = "import { channels } from './LiveTVSection';"
new_import = """import { channels } from './LiveTVSection';
import { useAuth } from '../services/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';"""

content = content.replace(old_import, new_import)

# Replace the deletedIds useState and add firestore sync
old_state = """  const [deletedIds, setDeletedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fb_deleted') || '[]'); } catch(e) { return []; }
  });"""

new_state = """  const { user } = useAuth();
  const [deletedIds, setDeletedIds] = useState([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'hidden_channels', user.uid));
        if (snap.exists()) setDeletedIds(snap.data().ids || []);
      } catch(e) {}
    };
    load();
  }, [user]);"""

content = content.replace(old_state, new_state)

# Replace handleDelete
old_delete = """  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Hide this channel?')) return;
    const next = [...deletedIds, id];
    setDeletedIds(next);
    localStorage.setItem('fb_deleted', JSON.stringify(next));
  };

  const handleRestoreAll = () => {
    setDeletedIds([]);
    localStorage.removeItem('fb_deleted');
  };"""

new_delete = """  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Hide this channel?')) return;
    const next = [...deletedIds, id];
    setDeletedIds(next);
    if (user) setDoc(doc(db, 'hidden_channels', user.uid), { ids: next });
  };

  const handleRestoreAll = () => {
    setDeletedIds([]);
    if (user) setDoc(doc(db, 'hidden_channels', user.uid), { ids: [] });
  };"""

content = content.replace(old_delete, new_delete)

src.write_text(content, encoding='utf-8')
print('Done! Hidden channels now saved to Firestore per user.')
