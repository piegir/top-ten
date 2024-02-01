from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from lib.player import Player
from lib.player_proposition import PlayerProposition
from lib.theme import Theme

from app.utils import ActionStatus
import app.game.game as game

router = APIRouter(prefix="/rounds", tags=["Round control"])


def check_round_valid(action_description: str = "perform action"):
    """
    Check if there is a valid round ongoing.

    :param action_description: The description of the action desired to be performed on the round.
    """
    if game.current_game is None:
        raise HTTPException(
            status_code=400,
            detail=f"Couldn't {action_description}, game wasn't started.")

    if not game.current_game.is_round_in_progress():
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
    return game.current_game.rounds[-1].card


@router.post("/set_theme")
def set_theme(theme: Theme) -> ActionStatus:
    """
    API call to set the theme of the current round.

    :return: The status of setting the theme.
    """
    check_round_valid("set the theme")
    game.current_game.rounds[-1].set_theme(theme)
    current_player = game.current_game.rounds[-1].players_list[
        game.current_game.rounds[-1].playing_player_index]
    return ActionStatus(
        status=True,
        message=f"Round theme was properly set. "
        f"{current_player} should make its proposition (/rounds/set_player_proposition)."
    )


@router.get("/get_player_number{player_id}")
def get_player_number(player_id: int) -> int:
    """
    Get all player propositions.

    :param player_id: The player id whose number we want to obtain
    :return: The player's number.
    """
    check_round_valid("get player number")
    player_to_number = {
        numbered_prop.player_proposition.player.id: numbered_prop.number
        for numbered_prop in
        game.current_game.rounds[-1].numbered_player_propositions
    }
    return player_to_number[player_id]


@router.post("/set_player_proposition")
def set_player_proposition(proposition: str, player_id: int) -> ActionStatus:
    """
    Set a player's proposition.

    :param proposition: The content of the proposition made
    :param player_id: The id of the player that made it
    :return: The status of setting the player's proposition.
    """
    check_round_valid("set player proposition")
    player = next(player
                  for player in game.current_game.rounds[-1].players_list
                  if player.id == player_id)
    if game.current_game.rounds[-1].all_propositions_made():
        starting_player = game.current_game.rounds[-1].players_list[0]
        return ActionStatus(
            status=False,
            message=f"All propositions have already been made. "
            f"{starting_player} should make a hypothesis (/rounds//make_hypothesis)"
        )
    try:
        game.current_game.rounds[-1].set_player_proposition(
            proposition, player)
        if game.current_game.rounds[-1].all_propositions_made():
            starting_player = game.current_game.rounds[-1].players_list[0]
            return ActionStatus(
                status=True,
                message=
                f"{player}'s proposition '{proposition}' was properly set. "
                f"All propositions have been made. "
                f"{starting_player} should make a hypothesis (/rounds//make_hypothesis)"
            )
        else:
            current_player = game.current_game.rounds[-1].players_list[
                game.current_game.rounds[-1].playing_player_index]
            return ActionStatus(
                status=True,
                message=
                f"{player}'s proposition '{proposition}' was properly set. "
                f"It is now {current_player}'s turn to make its proposition")
    except Exception as error:
        return ActionStatus(
            status=False,
            message=
            f"{player}'s proposition '{proposition}' couldn't be set. {error}")


@router.get("/get_player_propositions")
def get_player_propositions() -> list[PlayerProposition]:
    """
    Get all player propositions.

    :return: The list of all player propositions (ordered with the round order).
    """
    check_round_valid("get player propositions")
    player_propositions = [
        numbered_prop.player_proposition for numbered_prop in
        game.current_game.rounds[-1].numbered_player_propositions
    ]
    return player_propositions


@router.post("/make_hypothesis")
def make_hypothesis(hypothesis_ids: list[int]) -> ActionStatus:
    """
    Set a hypothesis about correct order of propositions.

    :param hypothesis_ids: The list of player ids as ordered for the hypothesis
    :return: The status of setting the hypothesis.
    """
    check_round_valid("make hypothesis")
    id_to_prop = {
        prop.player_proposition.player.id: prop.player_proposition
        for prop in game.current_game.rounds[-1].numbered_player_propositions
    }
    hypothesis = [
        id_to_prop[hypothesis_id] for hypothesis_id in hypothesis_ids
    ]
    try:
        game.current_game.rounds[-1].make_hypothesis(hypothesis)
        return ActionStatus(status=True,
                            message=f"Hypothesis was properly made.")
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Hypothesis couldn't be made. {error}")


@router.get("/check_round_result")
def check_round_result() -> bool:
    """
    Check round result.

    :return: True if round was won, False otherwise.
    """
    if game.current_game is None:
        raise HTTPException(
            status_code=400,
            detail="Couldn't check round result, game wasn't started.")
    return game.current_game.rounds[-1].is_complete(
    ) and game.current_game.rounds[-1].success
