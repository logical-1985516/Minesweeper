from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/user_statistics/{username}")
async def get_user_statistics(username: str):
    # Simulate fetching user statistics from a database
    return {
        "username": username,
        "games_played": 42,
        "wins": 27
    }
