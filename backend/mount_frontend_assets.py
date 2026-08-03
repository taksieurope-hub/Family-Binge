
import os

path = "server.py"
if os.path.exists(path):
    code = open(path, "r", encoding="utf-8").read()
    
    # 1. Add StaticFiles to the FastAPI imports if not present
    old_import = "from fastapi import FastAPI"
    new_import = "from fastapi import FastAPI\nfrom fastapi.staticfiles import StaticFiles"
    if "StaticFiles" not in code:
        code = code.replace(old_import, new_import, 1)

    # 2. Build the exact asset mounting code block
    mount_code = """
# --- Mount Frontend Static Assets ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_BUILD_DIR = os.path.abspath(os.path.join(BASE_DIR, "../frontend/build"))

if os.path.exists(FRONTEND_BUILD_DIR):
    # Mount main static assets folder (js, css, media)
    static_dir = os.path.join(FRONTEND_BUILD_DIR, "static")
    if os.path.exists(static_dir):
        app.mount("/static", StaticFiles(directory=static_dir), name="static")
        
    # Mount the rest of the build directory at root for general assets (manifest, favicon, sw.js)
    app.mount("/assets_root", StaticFiles(directory=FRONTEND_BUILD_DIR), name="frontend_root")
"""

    # Inject it right below the router declarations so API routes have priority
    target_marker = "from routers.auth import auth_router"
    if target_marker in code and "FRONTEND_BUILD_DIR" not in code:
        code = code.replace(target_marker, target_marker + "\n" + mount_code)
        open(path, "w", encoding="utf-8").write(code)
        print("SUCCESS")
    else:
        print("ALREADY INSTALLED OR TARGET NOT FOUND")
else:
    print("ERROR: File not found")

