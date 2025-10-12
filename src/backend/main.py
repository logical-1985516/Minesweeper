from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

from KVStore import KVStore

app = FastAPI()
kv = KVStore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/user_statistics/{username}")
async def get_user_statistics(username: str):
    user_statistics = await kv.get(username)
    if not user_statistics:
        await kv.set(username, {"username": username, "games_played": 0, "wins": 0})
        user_statistics = await kv.get(username)
    return json.loads(user_statistics)
