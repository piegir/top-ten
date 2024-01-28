from fastapi import APIRouter
from pydantic import BaseModel, Field

from lib.game import Game
from lib.player import Player

router = APIRouter(prefix="/game", tags=["Game setup"])


class ActionStatus(BaseModel):
    """
    Container of the status of a game. Extends `pydantic.BaseModel`.
    """
    status: bool = Field(description="True if action succeeded.", example=True)
    message: str = Field(description="Some info about the game.",
                         example="Action succeeded.")


current_game: Game | None = None


@router.post("/start")
def start_game(players_list: list[Player]) -> ActionStatus:
    """
    API call to start a game.

    :param players_list: The list of players that will be part of the game.
    :return: The game status.
    """
    global current_game

    current_game = Game(players_list)

    return ActionStatus(started=True, message="Game is started.")


@router.post("/start_new_round")
def start_new_round() -> ActionStatus:
    """
    API call to start a game.

    :param players_list: The list of players that will be part of the game.
    :return: The game status.
    """
    global current_game

    current_game = Game(players_list)

    return ActionStatus(started=True, message="Game is started.")
