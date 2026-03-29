import pathlib

f = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx')
c = f.read_text(encoding='utf-8')

old = """          {!playerReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <Loader2 className="w-14 h-14 text-purple-500 animate-spin" />
              <p className="text-white mt-5 font-medium">Connecting to best server...</p>
            </div>
          )}"""

new = """          {!playerReady && currentSourceIndex !== -1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <Loader2 className="w-14 h-14 text-purple-500 animate-spin" />
              <p className="text-white mt-5 font-medium">Connecting to best server...</p>
            </div>
          )}
          {currentSourceIndex === -1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 text-center px-6">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Film className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">Content Not Available</h2>
              <p className="text-gray-400 text-sm max-w-md">This title is not yet available on our database. We are working on adding it in the near future.</p>
              <button onClick={() => { setIsPlaying(false); clearNextTimers(); }} className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors">
                Go Back
              </button>
            </div>
          )}"""

if old in c:
    c = c.replace(old, new)
    f.write_text(c, encoding='utf-8')
    print('SUCCESS!')
else:
    print('NOT FOUND')
