from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Annotated

from app.authentication.authentication import oauth2_scheme
from app.utils import ActionStatus
from app.game import game
from lib.player_proposition import Proposition, PlayerProposition, NumberedPlayerProposition
from lib.theme import Theme

router = APIRouter(prefix="/rounds", tags=["Round control"])

temp_hypothesis: list[PlayerProposition] = []


class RoundResult(BaseModel):
    result: float = Field(
        description="-1 if the round is still in progress."
        "A number between 0 and 1 representing the accuracy of the round otherwise.",
        example=-1)
    hypothesis: list[PlayerProposition] = Field(
        description=
        "The hypothesis of proposition ordering made by the player.",
        example=[PlayerProposition(player="John Doe")])
    reality: list[NumberedPlayerProposition] = Field(
        description="The reality of proposition ordering (with numbers).",
        example=[
            NumberedPlayerProposition(
                number=1,
                player_proposition=PlayerProposition(player="John Doe"))
        ])


def round_valid() -> bool:
    """
    Check if there is a valid round ongoing.

    :return: True if there is a valid round, False otherwise.
    """
    return game.current_game is not None and game.current_game.is_round_in_progress(
    )


@router.get("/get_players")
def get_players(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> list[str]:
    """
    API call to get the username of all players of the round.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The list of players in the round (in order).
    """
    return game.current_game.rounds[-1].players_list


@router.get("/get_card")
def get_card(
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> list[Theme]:
    """
    API call to get the card from the current round.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The list of themes on the card
    """
    return game.current_game.rounds[-1].card


@router.post("/set_theme")
def set_theme(
        theme: Theme,
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> ActionStatus:
    """
    API call to set the theme of the current round.

    :param theme: The theme to be set
    :param current_username: Username of the current user performing the request (automatically obtained)
    :return: The status of setting the theme.
    """
    description = "set the theme"
    if game.current_game is None:
        return ActionStatus(
            status=False,
            message=f"Couldn't {description}, game wasn't started.")

    if not game.current_game.is_round_in_progress():
        return ActionStatus(
            status=False,
            message=f"Couldn't {description}, no round in progress.")
    if current_username not in game.current_game.rounds[-1].players_list:
        return ActionStatus(
            status=False,
            message=
            f"Couldn't {description}, player '{current_username}' not part of the game."
        )
    first_player = game.current_game.rounds[-1].players_list[0]
    if current_username != first_player:
        return ActionStatus(
            status=False,
            message=f"Only first player '{first_player}' can {description}.")

    game.current_game.rounds[-1].set_theme(theme)
    return ActionStatus(
        status=True,
        message=f"Round theme was properly set. "
        f"First player '{current_username}' should make a proposition (/rounds/set_player_proposition)."
    )


@router.get("/get_theme")
def get_theme(
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> Theme | None:
    """
    API call to get the theme from the current round.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The list of themes on the card
    """
    return game.current_game.rounds[-1].theme


@router.get("/get_number")
def get_number(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> int:
    """
    API call to get own 'top' number.

    :param current_username: Username of the current user performing the request (automatically obtained)
    :return: The player's number.
    """

    player_to_number = {
        numbered_prop.player_proposition.player: numbered_prop.number
        for numbered_prop in
        game.current_game.rounds[-1].numbered_player_propositions
    }
    return player_to_number[current_username]


@router.get("/get_current_player")
def get_current_player(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> str:
    """
    API call to get the current player whose turn it is.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The player's username.
    """
    return game.current_game.rounds[-1].players_list[
        game.current_game.rounds[-1].playing_player_index]


@router.post("/set_player_proposition")
def set_player_proposition(
        proposition: Proposition,
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> ActionStatus:
    """
    API call to set a player's proposition.

    :param proposition: The proposition made
    :param current_username: Username of the current user performing the request (automatically obtained)
    :return: The status of setting the player's proposition.
    """
    description = "set player proposition"
    if game.current_game is None:
        return ActionStatus(
            status=False,
            message=f"Couldn't {description}, game wasn't started.")

    if not game.current_game.is_round_in_progress():
        return ActionStatus(
            status=False,
            message=f"Couldn't {description}, no round in progress.")
    if current_username not in game.current_game.rounds[-1].players_list:
        return ActionStatus(
            status=False,
            message=
            f"Couldn't {description}, player '{current_username}' not part of the game."
        )
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
            proposition.proposition, current_username)
        # Check if all propositions have been made
        if game.current_game.rounds[-1].all_propositions_made():
            starting_player = game.current_game.rounds[-1].players_list[0]
            return ActionStatus(
                status=True,
                message=
                f"{current_username}'s proposition '{proposition.proposition}' was properly set. "
                f"All propositions have been made. "
                f"{starting_player} should make a hypothesis (/rounds/make_hypothesis)"
            )
        else:
            current_player = game.current_game.rounds[-1].players_list[
                game.current_game.rounds[-1].playing_player_index]
            return ActionStatus(
                status=True,
                message=
                f"{current_username}'s proposition '{proposition.proposition}' was properly set. "
                f"It is now {current_player}'s turn to make a proposition")
    except Exception as error:
        return ActionStatus(
            status=False,
            message=
            f"{current_username}'s proposition '{proposition.proposition}' couldn't be set. {error}"
        )


@router.get("/get_player_propositions")
def get_player_propositions(
    current_username: Annotated[str, Depends(oauth2_scheme)]
) -> list[PlayerProposition]:
    """
    API call to get all player propositions.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The list of all player propositions (ordered with the round order).
    """
    player_propositions = [
        numbered_prop.player_proposition for numbered_prop in
        game.current_game.rounds[-1].numbered_player_propositions
    ]
    return player_propositions


@router.get("/check_all_propositions_made")
def check_all_propositions_made(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> bool:
    """
    API call to check that all player propositions have been made.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: True if all propositions have been made, False otherwise.
    """
    return game.current_game.rounds[-1].all_propositions_made()


@router.post("/set_hypothesis")
def set_temporary_hypothesis(
        hypothesis: list[PlayerProposition],
        current_username: Annotated[str, Depends(oauth2_scheme)]):
    """
    API call to temporarily store the hypothesis (for live update between users).

    :param hypothesis: The list of player propositions as ordered for the temporary hypothesis
    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    """
    global temp_hypothesis
    temp_hypothesis = hypothesis


@router.get("/get_hypothesis")
def get_temporary_hypothesis(
    current_username: Annotated[str, Depends(oauth2_scheme)]
) -> list[PlayerProposition]:
    """
    API call to access the temporarily stored hypothesis (for live update between users).

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The temporary hypothesis.
    """
    return temp_hypothesis


@router.post("/make_hypothesis")
def make_hypothesis(
        hypothesis: list[PlayerProposition],
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> ActionStatus:
    """
    API call to set a hypothesis about correct order of propositions.

    :param hypothesis: The list of player propositions as ordered for the hypothesis
    :param current_username: Username of the current user performing the request (automatically obtained)
    :return: The status of setting the hypothesis.
    """
    description = "make the hypothesis"
    if game.current_game is None:
        return ActionStatus(
            status=False,
            message=f"Couldn't {description}, game wasn't started.")

    if not game.current_game.is_round_in_progress():
        return ActionStatus(
            status=False,
            message=f"Couldn't {description}, no round in progress.")
    if current_username not in game.current_game.rounds[-1].players_list:
        return ActionStatus(
            status=False,
            message=
            f"Couldn't {description}, player '{current_username}' not part of the game."
        )
    first_player = game.current_game.rounds[-1].players_list[0]
    if current_username != first_player:
        return ActionStatus(
            status=False,
            message=f"Only first player '{first_player}' can {description}.")

    try:
        game.current_game.rounds[-1].make_hypothesis(hypothesis)
        return ActionStatus(status=True,
                            message=f"Hypothesis was properly made.")
    except Exception as error:
        return ActionStatus(status=False,
                            message=f"Hypothesis couldn't be made. {error}")


@router.get("/check_round_complete")
def check_round_complete(
        current_username: Annotated[str, Depends(oauth2_scheme)]) -> bool:
    """
    API call to check if round is complete.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: True if round is complete, False otherwise.
    """
    return game.current_game.rounds[-1].is_complete()


@router.get("/check_round_result")
def check_round_result(
        current_username: Annotated[str,
                                    Depends(oauth2_scheme)]) -> RoundResult:
    """
    API call to check round result.

    :param current_username: Automatically check that the user requesting this is logged-in (value unused)
    :return: True if round was won, False otherwise.
    """
    current_round = game.current_game.rounds[-1]
    sorted_numbered_propositions = sorted(
        current_round.numbered_player_propositions, key=lambda x: x.number)
    return RoundResult(result=current_round.result,
                       hypothesis=current_round.order_hypothesis,
                       reality=sorted_numbered_propositions)
