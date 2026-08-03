
import os

path = "server.py"
if os.path.exists(path):
    code = open(path, "r", encoding="utf-8").read()
    
    fallback_route = """
from fastapi.responses import HTMLResponse

@app.get("/{catchall:path}", include_in_schema=False)
async def spa_fallback(catchall: str):
    if catchall.startswith("api") or "." in catchall.split("/")[-1]:
        raise HTTPException(status_code=404, detail="Not Found")
    index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/build/index.html"))
    if os.path.exists(index_path):
        return HTMLResponse(content=open(index_path, "r", encoding="utf-8").read(), status_code=200)
    alt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist/index.html"))
    if os.path.exists(alt_path):
        return HTMLResponse(content=open(alt_path, "r", encoding="utf-8").read(), status_code=200)
    return HTMLResponse(content="<h1>Frontend build folder not found</h1>", status_code=500)
"""

    if "spa_fallback" not in code:
        marker = "if __name__ == "
        if marker in code:
            code = code.replace(marker, fallback_route + "\n" + marker)
            open(path, "w", encoding="utf-8").write(code)
            print("SUCCESS")
        else:
            print("ERROR: Marker missing")
    else:
        print("ALREADY FIXED")

