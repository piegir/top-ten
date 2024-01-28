from fastapi import FastAPI
from version import version
from starlette.responses import RedirectResponse

from app.game import game
from app.rounds import rounds

description = """
Top Ten API
"""

tags_metadata = [{
    "name": "Game setup",
    "description": "Operations to setup the game.",
}, {
    "name": "Round control",
    "description": "Operations to control game rounds.",
}]

top_ten_app = FastAPI(title="Top Ten API",
                      description=description,
                      version=version,
                      openapi_tags=tags_metadata)

top_ten_app.include_router(game.router)
top_ten_app.include_router(rounds.router)


@top_ten_app.get("/")
def root() -> RedirectResponse:
    """
    API call to get to the root page. Redirects to the auto-generated 'docs' page.
    """
    return RedirectResponse(url="docs")
