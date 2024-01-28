from fastapi import APIRouter, HTTPException

from app.utils import ActionStatus

from lib.game import Game
from lib.player import Player

router = APIRouter(prefix="/game", tags=["Game setup"])

current_game: Game | None = None


@router.post("/start")
def start_game(players_list: list[Player]) -> ActionStatus:
    """
    API call to start a game.

    :param players_list: The list of players that will be part of the game.
    :return: The status of starting the game.
    """
    global current_game

    current_game = Game(players_list)

    return ActionStatus(status=True, message="Game was properly started.")


@router.post("/start_new_round")
def start_new_round() -> ActionStatus:
    """
    API call to start a new round for the current game.

    :return: The status of starting the round.
    """
    global current_game

    if current_game is None:
        raise HTTPException(
            status_code=400,
            detail="Couldn't start round, game wasn't started.")

    current_game.start_new_round()

    return ActionStatus(status=True, message="Round was properly started.")


@router.get("/is_round_in_progress")
def is_round_in_progress() -> bool:
    """
    API call to check if a round is currently in progress in the game.

    :return: True if a round is progress, False otherwise.
    """
    global current_game

    if current_game is None:
        raise HTTPException(
            status_code=400,
            detail="Couldn't check for round in progress, game wasn't started."
        )

    return current_game.is_round_in_progress()


@router.get("/is_game_complete")
def is_game_complete() -> bool:
    """
    API call to check if the game is complete.

    :return: True if the game is complete, False otherwise.
    """
    global current_game

    if current_game is None:
        raise HTTPException(
            status_code=400,
            detail="Couldn't check for game completeness, game wasn't started."
        )

    return current_game.is_game_complete()
