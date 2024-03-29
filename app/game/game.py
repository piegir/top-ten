from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Annotated

from app.authentication.authentication import oauth2_scheme, user_connected, connected_users
from app.utils import ActionStatus
from lib.game import Game
from lib.theme import Theme

router = APIRouter(prefix="/game", tags=["Game setup"])

current_game: Game | None = None


class RoundSummary(BaseModel):
    result: float | None = Field(
        description="-1 if the round is still in progress."
        "A number between 0 and 1 representing the accuracy of the round otherwise.",
        example=-1,
        default=None)
    capten: str | None = Field(
        description="The Cap'Ten of the round, i.e. the first player.",
        example="John Doe",
        default=None)
    theme: Theme | None = Field(description="The theme of the round.",
                                default=None)


class GameConfig(BaseModel):
    """
    Container of the game configuration. Extends `pydantic.BaseModel`.
    """
    players_list: list[str] = Field(
        description=
        "List of usernames of the players that will participate in the game.",
        example=["player1", "player2", "player3", "player4"])
    starting_player: str | None = Field(
        description="Name of the starting player.", example="John Doe")
    max_nb_rounds: int = Field(
        description="Total number of rounds to be played in the game.",
        default=5)
    nb_themes_per_card: int = Field(
        description="Number of themes provided per card.", default=3)
    themes_language: str = Field(
        description=
        "Language to be used for the themes of the game (as a IETF language tag).",
        default="en")


temp_game_config: GameConfig = GameConfig(players_list=[],
                                          starting_player=None)


def game_created():
    """
    Check if game was created.

    :return: True if game was created, False otherwise.
    """
    return current_game is not None


def all_players_connected(players_list: list[str]):
    """
    Check that all players are connected to the server.

    :param players_list: The list of players usernames
    :return: True if all players mentioned are connected, False otherwise.
    """
    return all(user_connected(username) for username in players_list)


def player_in_game(player: str):
    """
    Check if player is part of the game.

    :param player: The username of the player to be checked
    :return: True if the specified player is part of the game, False otherwise.
    """
    return player in current_game.players_list


@router.post("/set_temp_config")
def set_temp_game_config(game_config: GameConfig,
                         current_username: Annotated[str,
                                                     Depends(oauth2_scheme)]):
    """
    API call to temporarily store the game config (for live update between users).

    :param game_config: The temporary game configuration
    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    """
    global temp_game_config
    temp_game_config = game_config


@router.get("/get_temp_config")
def get_temp_game_config(
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> GameConfig:
    """
    API call to access the temporarily stored game config (for live update between users).

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The temporary game configuration.
    """
    global temp_game_config
    if temp_game_config.starting_player is None and len(connected_users) > 0:
        temp_game_config.starting_player = connected_users[0]
    return temp_game_config


@router.post("/start")
def start_game(
        game_config: GameConfig,
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> ActionStatus:
    """
    API call to start a game.

    :param game_config: The game configuration
    :param current_username: Username of the current user performing the request (automatically obtained)
    :return: The status of starting the game.
    """
    global current_game

    if current_username not in game_config.players_list:
        return ActionStatus(
            status=False,
            message="Game couldn't be started. "
            f"Requesting player '{current_username}' must be part of the players list."
        )

    if not all_players_connected(game_config.players_list):
        return ActionStatus(status=False,
                            message="Game couldn't be started. "
                            f"Some players are not connected.")

    try:
        current_game = Game(game_config.players_list,
                            game_config.max_nb_rounds,
                            game_config.starting_player,
                            game_config.nb_themes_per_card,
                            game_config.themes_language)
        return ActionStatus(status=True, message="Game was properly started.")
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Game couldn't be started. {error}")


@router.get("/is_started")
def is_started(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> bool:
    """
    API call to check if a game is started.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: True if a game is started, False otherwise.
    """
    return game_created()


@router.get("/get_players")
def get_players(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> list[str]:
    """
    API call to get the username of all players of the game.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The list of players in the game (in order).
    """
    return current_game.players_list


@router.post("/start_new_round")
def start_new_round(
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> ActionStatus:
    """
    API call to start a new round for the current game.

    :param current_username: Username of the current user performing the request (automatically obtained)
    :return: The status of starting the round.
    """
    description = "start new round"
    if not game_created():
        return ActionStatus(
            status=False,
            message=f"Couldn't {description}, game wasn't started.")
    if not player_in_game(current_username):
        return ActionStatus(
            status=False,
            message=
            f"Couldn't {description}, requesting player '{current_username}' must be part of the game."
        )

    try:
        current_game.start_new_round()
        return ActionStatus(status=True,
                            message=f"Round was properly started.")
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Round couldn't be started. {error}")


@router.get("/is_round_in_progress")
def is_round_in_progress(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> bool:
    """
    API call to check if a round is currently in progress in the game.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: True if a round is progress, False otherwise.
    """
    return game_created() and current_game.is_round_in_progress()


@router.get("/get_rounds_history")
def get_rounds_history(
    current_username: Annotated[str, Depends(oauth2_scheme)]
) -> list[RoundSummary | None]:
    """
    API call to obtain the history of the different rounds of the game represented as summaries (result + capten name).

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The list of round summaries.
    """
    rounds_history = [RoundSummary()] * current_game.max_nb_rounds
    for i, game_round in enumerate(current_game.rounds):
        rounds_history[i] = RoundSummary(result=game_round.result,
                                         capten=game_round.players_list[0],
                                         theme=game_round.theme)
    return rounds_history


@router.get("/is_game_complete")
def is_game_complete(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> bool:
    """
    API call to check if the game is complete.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: True if the game is complete, False otherwise.
    """
    return game_created() and current_game.is_game_complete()
