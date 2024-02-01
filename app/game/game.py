from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from app.authentication.authentication import oauth2_scheme
from app.utils import ActionStatus

from lib.game import Game
from lib.player import Player

router = APIRouter(prefix="/game", tags=["Game setup"])

current_game: Game | None = None


class GameConfig(BaseModel):
    """
    Container of the game configuration. Extends `pydantic.BaseModel`.
    """
    players_list: list[Player] = Field(
        description="List of players that will participate in the game.",
        example=[
            Player(name="John Doe", id=0),
            Player(name="Jane Doe", id=1),
            Player(name="James Doe", id=2),
            Player(name="Joanne Doe", id=3)
        ])
    max_nb_rounds: int = Field(
        description="Total number of rounds to be played in the game.",
        example=7)
    starting_player: int = Field(
        description="Index of starting player in the players list.", default=0)
    nb_themes_per_card: int = Field(
        description="Number of themes provided per card.", default=3)


@router.post("/start")
def start_game(game_config: GameConfig,
               token: Annotated[str, Depends(oauth2_scheme)]) -> ActionStatus:
    """
    API call to start a game.

    :param game_config: The game configuration.
    :param token: The authentication token.
    :return: The status of starting the game.
    """
    global current_game
    print(token)
    try:
        current_game = Game(game_config.players_list,
                            game_config.max_nb_rounds,
                            game_config.starting_player,
                            game_config.nb_themes_per_card)
        return ActionStatus(
            status=True,
            message="Game was properly started. "
            "You can now start the first round (/game/start_new_round)")
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Game couldn't be started. {error}")


@router.post("/start_new_round")
def start_new_round() -> ActionStatus:
    """
    API call to start a new round for the current game.

    :return: The status of starting the round.
    """
    global current_game

    if current_game is None:
        return ActionStatus(
            status=False,
            message="Round couldn't be started since game was not created.")

    try:
        current_game.start_new_round()
        first_player = current_game.rounds[-1].players_list[
            current_game.rounds[-1].playing_player_index]
        return ActionStatus(
            status=True,
            message=
            f"Round was properly started. {first_player} should pick a theme from the provided card (/rounds/get_card)."
        )
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Round couldn't be started. {error}")


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


@router.get("/is_game_won")
def is_game_won() -> bool:
    """
    API call to check if the game is won.

    :return: True if the game is won, False otherwise.
    """
    global current_game

    if current_game is None:
        raise HTTPException(
            status_code=400,
            detail="Couldn't check for game win, game wasn't started.")

    return current_game.is_game_won()
