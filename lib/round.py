import random

from database.database import pick_random_card
from lib.player_proposition import PlayerProposition, NumberedPlayerProposition
from lib.theme import Theme


class Round:

    def __init__(self, players_list: list[str], nb_themes_per_card: int,
                 themes_language: str, played_themes: list[Theme]):
        self.players_list: list[str] = players_list
        self.card: list[Theme] = pick_random_card(nb_themes_per_card,
                                                  themes_language,
                                                  played_themes)

        self.numbered_player_propositions: list[
            NumberedPlayerProposition] = self.assign_numbers()

        self.playing_player_index: int = 0
        self.result: float = -1
        self.order_hypothesis: list[PlayerProposition] | None = None
        self.theme: Theme | None = None

    def set_theme(self, theme: Theme):
        """
        Called by the playing player, sets the theme to their choice
        :param theme: the desired theme
        """
        self.theme = theme

    def assign_numbers(self) -> list[NumberedPlayerProposition]:
        """
        Assigns a different random number between 1 and 10 to each player
        :return: the list of 'PlayerProposition' containing those numbers
        """
        player_numbers = random.sample(range(1, 11), len(self.players_list))
        return [
            NumberedPlayerProposition(
                number=number,
                player_proposition=PlayerProposition(player=player))
            for player, number in zip(self.players_list, player_numbers)
        ]

    def set_player_proposition(self, proposition: str, player: str):
        """
        Sets the proposition for a player
        :param proposition: the proposition
        :param player: the player's username
        :return:
        """
        player_index = self.players_list.index(player)
        if player_index == self.playing_player_index:
            self.numbered_player_propositions[
                player_index].player_proposition.proposition = proposition
            self.playing_player_index = (self.playing_player_index + 1) % len(
                self.players_list)
        else:
            raise ValueError(
                f"Player {player} tried playing during {self.players_list[self.playing_player_index]}'s turn."
            )

    def all_propositions_made(self) -> bool:
        """
        Checks if all propositions have been made.
        :return: True if all propositions have been made, False otherwise.
        """
        for numbered_proposition in self.numbered_player_propositions:
            if numbered_proposition.player_proposition.proposition is None:
                return False
        return True

    def make_hypothesis(self, hypothesis: list[PlayerProposition]):
        """
        Make hypothesis on proposition ordering, compare to ground truth, complete the round and set according variables
        :param hypothesis: the order hypothesis
        """
        if not self.all_propositions_made():
            raise RuntimeError("Not all propositions have been made.")
        self.order_hypothesis = hypothesis
        sorted_propositions = sorted(self.numbered_player_propositions,
                                     key=lambda x: x.number)
        comparison = [
            prop.player_proposition == hyp
            for prop, hyp in zip(sorted_propositions, hypothesis)
        ]
        self.result = sum(comparison) / len(comparison)

    def is_complete(self):
        return self.order_hypothesis is not None
