from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Annotated

from app.authentication.authentication import User, get_current_user, check_user_connected
from app.utils import ActionStatus
from lib.game import Game

router = APIRouter(prefix="/game", tags=["Game setup"])

current_game: Game | None = None


class GameConfig(BaseModel):
    """
    Container of the game configuration. Extends `pydantic.BaseModel`.
    """
    players_list: list[str] = Field(
        description=
        "List of usernames of the players that will participate in the game.",
        example=["player1", "player2", "player3", "player4"])
    max_nb_rounds: int = Field(
        description="Total number of rounds to be played in the game.",
        example=7)
    starting_player_index: int = Field(
        description="Index of starting player in the players list.", default=0)
    nb_themes_per_card: int = Field(
        description="Number of themes provided per card.", default=3)


def check_game_created(action_description: str):
    """
    Check if game was created.

    :param action_description: The description of the action desired to be performed on the round.
    """
    if current_game is None:
        raise HTTPException(
            status_code=400,
            detail=f"Couldn't {action_description}, game wasn't started.")


def check_all_players_connected(players_list: list[str]):
    """
    Check that all players are connected to the server.

    :param players_list: The list of players usernames
    """
    if not all(check_user_connected(username) for username in players_list):
        raise HTTPException(status_code=400,
                            detail="Some selected players are not connected.")


def check_player_in_game(player: str, action_description: str):
    """
    Check if player is part of the game.

    :param player: The username of the player to be checked
    :param action_description: The description of the action desired to be performed by the player.
    """
    if player not in current_game.players_list:
        raise HTTPException(
            status_code=400,
            detail=
            f"Couldn't {action_description}, player '{player}' not part of the game."
        )


@router.post("/start")
def start_game(
        game_config: GameConfig,
        current_user: Annotated[User,
                                Depends(get_current_user)]) -> ActionStatus:
    """
    API call to start a game.

    :param game_config: The game configuration
    :param current_user: Current user performing the request (automatically obtained)
    :return: The status of starting the game.
    """
    global current_game
    check_all_players_connected(game_config.players_list)
    if current_user.username not in game_config.players_list:
        return ActionStatus(
            status=False,
            message="Game couldn't be started. "
            f"Requesting player '{current_user.username}' not part of the game."
        )

    try:
        current_game = Game(game_config.players_list,
                            game_config.max_nb_rounds,
                            game_config.starting_player_index,
                            game_config.nb_themes_per_card)
        return ActionStatus(
            status=True,
            message="Game was properly started. "
            "You can now start the first round (/game/start_new_round)")
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Game couldn't be started. {error}")


@router.post("/start_new_round")
def start_new_round(
        current_user: Annotated[User,
                                Depends(get_current_user)]) -> ActionStatus:
    """
    API call to start a new round for the current game.

    :param current_user: Current user performing the request (automatically obtained)
    :return: The status of starting the round.
    """
    description = "start new round"
    check_game_created(description)
    check_player_in_game(current_user.username, description)

    try:
        current_game.start_new_round()
        first_player = current_game.rounds[-1].players_list[
            current_game.rounds[-1].playing_player_index]
        return ActionStatus(
            status=True,
            message=f"Round was properly started. "
            f"{first_player} should pick a theme from the provided card (/rounds/get_card)."
        )
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Round couldn't be started. {error}")


@router.get("/is_round_in_progress")
def is_round_in_progress(
        current_user: Annotated[User, Depends(get_current_user)]) -> bool:
    """
    API call to check if a round is currently in progress in the game.

    :param current_user: Current user performing the request (automatically obtained)
    :return: True if a round is progress, False otherwise.
    """
    description = "check round in progress"
    check_game_created(description)
    check_player_in_game(current_user.username, description)

    return current_game.is_round_in_progress()


@router.get("/is_game_complete")
def is_game_complete(
        current_user: Annotated[User, Depends(get_current_user)]) -> bool:
    """
    API call to check if the game is complete.

    :param current_user: Current user performing the request (automatically obtained)
    :return: True if the game is complete, False otherwise.
    """
    description = "start new round"
    check_game_created(description)
    check_player_in_game(current_user.username, description)

    return current_game.is_game_complete()


@router.get("/is_game_won")
def is_game_won(
        current_user: Annotated[User, Depends(get_current_user)]) -> bool:
    """
    API call to check if the game is won.

    :param current_user: Current user performing the request (automatically obtained)
    :return: True if the game is won, False otherwise.
    """
    description = "check for game win"
    check_game_created(description)
    check_player_in_game(current_user.username, description)

    return current_game.is_game_won()
