from typing import Annotated
from fastapi import APIRouter, HTTPException, Depends
from app.authentication.authentication import User, get_current_user

from lib.player_proposition import PlayerProposition
from lib.theme import Theme

from app.utils import ActionStatus
import app.game.game as game

router = APIRouter(prefix="/rounds", tags=["Round control"])


def check_round_valid(action_description: str):
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


def check_player_in_game(player: str, action_description: str):
    """
    Check if player is part of the game.

    :param player: The username of the player to be checked
    :param action_description: The description of the action desired to be performed by the player.
    """
    if player not in game.current_game.rounds[-1].players_list:
        raise HTTPException(
            status_code=400,
            detail=
            f"Couldn't {action_description}, player '{player}' not part of the game."
        )


def check_player_is_first(player: str, action_description: str):
    """
    Check if player is the first player of the game, i.e. if he's the player that can make the main interactions.

    :param player: The username of the player to be checked
    :param action_description: The description of the action desired to be performed by the player.
    """
    first_player = game.current_game.rounds[-1].players_list[0]
    if player != first_player:
        raise HTTPException(
            status_code=400,
            detail=
            f"Only first player '{first_player}' can {action_description}.")


@router.get("/get_card")
def get_card(
        current_user: Annotated[User,
                                Depends(get_current_user)]) -> list[Theme]:
    """
    API call to get the card from the current round.

    :param current_user: Current user performing the request (automatically obtained)
    :return: The list of themes on the card
    """
    description = "get a card"
    check_round_valid(description)
    check_player_in_game(current_user.username, description)
    check_player_is_first(current_user.username, description)

    return game.current_game.rounds[-1].card


@router.post("/set_theme")
def set_theme(
        theme: Theme,
        current_user: Annotated[User,
                                Depends(get_current_user)]) -> ActionStatus:
    """
    API call to set the theme of the current round.

    :param theme: The theme to be set
    :param current_user: Current user performing the request (automatically obtained)
    :return: The status of setting the theme.
    """
    description = "set the theme"
    check_round_valid(description)
    check_player_in_game(current_user.username, description)
    check_player_is_first(current_user.username, description)

    game.current_game.rounds[-1].set_theme(theme)
    return ActionStatus(
        status=True,
        message=f"Round theme was properly set. "
        f"First player '{current_user.username}' should make its proposition (/rounds/set_player_proposition)."
    )


@router.get("/get_theme")
def get_theme(
        current_user: Annotated[User,
                                Depends(get_current_user)]) -> Theme | None:
    """
    API call to get the theme from the current round.

    :param current_user: Current user performing the request (automatically obtained)
    :return: The list of themes on the card
    """
    description = "get the theme"
    check_round_valid(description)
    check_player_in_game(current_user.username, description)

    return game.current_game.rounds[-1].theme


@router.get("/get_number")
def get_number(
        current_user: Annotated[User, Depends(get_current_user)]) -> int:
    """
    API call to get own 'top' number.

    :param current_user: Current user performing the request (automatically obtained)
    :return: The player's number.
    """
    description = "get player number"
    check_round_valid(description)
    check_player_in_game(current_user.username, description)

    player_to_number = {
        numbered_prop.player_proposition.player: numbered_prop.number
        for numbered_prop in
        game.current_game.rounds[-1].numbered_player_propositions
    }
    return player_to_number[current_user.username]


@router.post("/set_player_proposition")
def set_player_proposition(
        proposition: str,
        current_user: Annotated[User,
                                Depends(get_current_user)]) -> ActionStatus:
    """
    API call to set a player's proposition.

    :param proposition: The content of the proposition made
    :param current_user: Current user performing the request (automatically obtained)
    :return: The status of setting the player's proposition.
    """
    description = "set player proposition"
    check_round_valid(description)
    check_player_in_game(current_user.username, description)
    # Check that not all propositions have already been made
    if game.current_game.rounds[-1].all_propositions_made():
        starting_player = game.current_game.rounds[-1].players_list[0]
        return ActionStatus(
            status=False,
            message=f"All propositions have already been made. "
            f"{starting_player} should make a hypothesis (/rounds/make_hypothesis)"
        )

    # Try setting the player's proposition
    try:
        game.current_game.rounds[-1].set_player_proposition(
            proposition, current_user.username)
        # Check if all propositions have been made
        if game.current_game.rounds[-1].all_propositions_made():
            starting_player = game.current_game.rounds[-1].players_list[0]
            return ActionStatus(
                status=True,
                message=
                f"{current_user.username}'s proposition '{proposition}' was properly set. "
                f"All propositions have been made. "
                f"{starting_player} should make a hypothesis (/rounds/make_hypothesis)"
            )
        else:
            current_player = game.current_game.rounds[-1].players_list[
                game.current_game.rounds[-1].playing_player_index]
            return ActionStatus(
                status=True,
                message=
                f"{current_user.username}'s proposition '{proposition}' was properly set. "
                f"It is now {current_player}'s turn to make its proposition")
    except Exception as error:
        return ActionStatus(
            status=False,
            message=
            f"{current_user.username}'s proposition '{proposition}' couldn't be set. {error}"
        )


@router.get("/get_player_propositions")
def get_player_propositions(
    current_user: Annotated[User, Depends(get_current_user)]
) -> list[PlayerProposition]:
    """
    API call to get all player propositions.

    :param current_user: Current user performing the request (automatically obtained)
    :return: The list of all player propositions (ordered with the round order).
    """
    description = "get player propositions"
    check_round_valid(description)
    check_player_in_game(current_user.username, description)

    player_propositions = [
        numbered_prop.player_proposition for numbered_prop in
        game.current_game.rounds[-1].numbered_player_propositions
    ]
    return player_propositions


@router.post("/make_hypothesis")
def make_hypothesis(
        hypothesis_names: list[int],
        current_user: Annotated[User,
                                Depends(get_current_user)]) -> ActionStatus:
    """
    API call to set a hypothesis about correct order of propositions.

    :param hypothesis_names: The list of player usernames as ordered for the hypothesis
    :param current_user: Current user performing the request (automatically obtained)
    :return: The status of setting the hypothesis.
    """
    description = "make the hypothesis"
    check_round_valid(description)
    check_player_in_game(current_user.username, description)
    check_player_is_first(current_user.username, description)

    player_to_prop = {
        prop.player_proposition.player: prop.player_proposition
        for prop in game.current_game.rounds[-1].numbered_player_propositions
    }
    hypothesis = [
        player_to_prop[hypothesis_id] for hypothesis_id in hypothesis_names
    ]
    try:
        game.current_game.rounds[-1].make_hypothesis(hypothesis)
        return ActionStatus(status=True,
                            message=f"Hypothesis was properly made.")
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Hypothesis couldn't be made. {error}")


@router.get("/check_round_result")
def check_round_result(
        current_user: Annotated[User, Depends(get_current_user)]) -> bool:
    """
    API call to check round result.

    :param current_user: Current user performing the request (automatically obtained)
    :return: True if round was won, False otherwise.
    """
    description = "check round result"
    if game.current_game is None:
        raise HTTPException(
            status_code=400,
            detail=f"Couldn't {description}, game wasn't started.")
    check_player_in_game(current_user.username, description)

    return game.current_game.rounds[-1].is_complete(
    ) and game.current_game.rounds[-1].success
