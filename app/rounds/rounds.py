from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from lib.player import Player
from lib.player_proposition import PlayerProposition
from lib.theme import Theme

from app.utils import ActionStatus
from app.game.game import current_game

router = APIRouter(prefix="/rounds", tags=["Round control"])


def check_round_valid(action_description: str = "perform action"):
    """
    Check if there is a valid round ongoing.

    :param action_description: The description of the action desired to be performed on the round.
    """
    if current_game is None:
        raise HTTPException(
            status_code=400,
            detail=f"Couldn't {action_description}, game wasn't started.")

    if not current_game.is_round_in_progress():
        raise HTTPException(
            status_code=400,
            detail=f"Couldn't {action_description}, no round in progress.")


@router.get("/get_card")
def get_card() -> list[Theme]:
    """
    API call to get the 'Card' from the current round.

    :return: The list of themes on the card
    """
    check_round_valid("get a card")
    return current_game.rounds[-1].card


@router.post("/set_theme")
def set_theme(theme: Theme) -> ActionStatus:
    """
    API call to set the theme of the current round.

    :return: The status of setting the theme.
    """
    check_round_valid("set the theme")
    current_game.rounds[-1].set_theme(theme)
    return ActionStatus(status=True, message="Round theme was properly set.")


@router.post("/set_player_proposition")
def set_player_proposition(proposition: str, player: Player) -> ActionStatus:
    """
    Set a player's proposition.

    :param proposition: The content of the proposition made
    :param player: The player that made it
    :return: The status of setting the player's propositom.
    """
    check_round_valid("set player proposition")
    current_game.rounds[-1].set_player_proposition(proposition, player)
    return ActionStatus(
        status=True, message=f"Player {player} proposition was properly set.")


@router.post("/make_hypothesis")
def make_hypothesis(hypothesis: list[PlayerProposition]) -> ActionStatus:
    """
    Set a hypothesis about correct order of propositions.

    :param hypothesis: An ordered list of propositions
    :return: The status of setting the hypothesis.
    """
    check_round_valid("make hypothesis")
    current_game.rounds[-1].make_hypothesis(hypothesis)
    return ActionStatus(status=True, message=f"Hypothesis was properly made.")


@router.post("/check_round_result")
def check_round_result() -> bool:
    """
    Check round result.

    :return: True if round was won, False otherwise.
    """
    check_round_valid("check round result")
    return current_game.rounds[-1].success
