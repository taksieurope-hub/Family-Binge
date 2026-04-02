# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = "  const { user } = useAuth();"
new = """  const { user } = useAuth();
  const [accessBlocked, setAccessBlocked] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const checkAccess = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!snap.exists()) { setAccessBlocked(true); return; }
        const data = snap.data();
        const status = data.subscriptionStatus;
        const trialEnd = data.trialEndsAt?.toDate ? data.trialEndsAt.toDate() : new Date(data.trialEndsAt);
        const subEnd = data.subscriptionEndsAt?.toDate ? data.subscriptionEndsAt.toDate() : new Date(data.subscriptionEndsAt);
        const now = new Date();
        const trialActive = data.trialEndsAt && trialEnd > now;
        const subActive = status === 'active' && data.subscriptionEndsAt && subEnd > now;
        if (!trialActive && !subActive) setAccessBlocked(true);
      } catch(e) { console.error(e); }
    };
    checkAccess();
  }, [user, navigate]);"""

if old in c:
    c = c.replace(old, new)
    # Add blocked screen before the return
    old2 = "  const visibleChannels = channels.filter"
    new2 = """  if (accessBlocked) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">??</div>
      <h2 className="text-white text-2xl font-bold mb-2">Subscription Required</h2>
      <p className="text-gray-400 mb-6">Your free trial has ended. Subscribe to keep watching Live TV.</p>
      <button onClick={() => navigate('/app#pricing')} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
        View Plans
      </button>
      <button onClick={() => navigate('/app')} className="mt-3 text-gray-500 hover:text-white text-sm transition-colors">
        Go Back
      </button>
    </div>
  );

  const visibleChannels = channels.filter"""
    c = c.replace(old2, new2)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
