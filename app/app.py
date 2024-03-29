from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from version import version

from app.authentication import authentication
from app.game import game
from app.rounds import rounds

description = """
Top Ten API
"""

tags_metadata = [
    {
        "name": "Authentication",
        "description": "Operations to control user authentication.",
    },
    {
        "name": "Game setup",
        "description": "Operations to setup the game.",
    },
    {
        "name": "Round control",
        "description": "Operations to control game rounds.",
    },
]

origins = [
    "https://top-ten-game.netlify.app",
    "http://localhost:3000",  # For local testing
]

top_ten_app = FastAPI(title="Top Ten API",
                      description=description,
                      version=version,
                      openapi_tags=tags_metadata)

top_ten_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

top_ten_app.include_router(authentication.router)
top_ten_app.include_router(game.router)
top_ten_app.include_router(rounds.router)


@top_ten_app.get("/")
def root() -> RedirectResponse:
    """
    API call to get to the root page. Redirects to the auto-generated 'docs' page.
    """
    return RedirectResponse(url="docs")


@top_ten_app.post("/reset")
def reset():
    """
    API call to reset the app, clears game, rounds and disconnects all users.
    """
    game.current_game = None
    game.temp_game_config = game.GameConfig(players_list=[],
                                            starting_player=None)
    rounds.temp_hypothesis = []
    authentication.connected_users = []
