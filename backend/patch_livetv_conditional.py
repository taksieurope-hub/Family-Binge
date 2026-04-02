# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\LiveTVPage.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = """  if (accessBlocked) return (
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
  );"""

new = ""

if old in c:
    c = c.replace(old, new)
    # Now find the main return statement and wrap it
    c = c.replace(
        "  return (\n    <div",
        """  if (accessBlocked) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">??</div>
      <h2 className="text-white text-2xl font-bold mb-2">Subscription Required</h2>
      <p className="text-gray-400 mb-6">Your free trial has ended. Subscribe to keep watching Live TV.</p>
      <button onClick={() => navigate('/app#pricing')} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">View Plans</button>
      <button onClick={() => navigate('/app')} className="mt-3 text-gray-500 hover:text-white text-sm transition-colors">Go Back</button>
    </div>
  );

  return (
    <div""",
        1
    )
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
