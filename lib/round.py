import random

from lib.player import Player
from lib.theme import Theme
from lib.player_proposition import PlayerProposition, NumberedPlayerProposition
from database.database import database


class Round:

    def __init__(self, players_list: list[Player], nb_themes_per_card: int,
                 played_themes: list[Theme]):
        self.players_list: list[Player] = players_list
        self.card: list[Theme] = database.pick_random_card(
            nb_themes_per_card, played_themes)

        self.numbered_player_propositions: list[
            NumberedPlayerProposition] = self.assign_numbers()

        self.playing_player_index: int = 0
        self.complete: bool = False
        self.success: bool = False
        self.order_hypothesis: list[PlayerProposition] = []
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

    def set_player_proposition(self, proposition: str, player: Player):
        """
        Sets the proposition for a player
        :param proposition: the proposition
        :param player: the player
        :return:
        """
        player_index = self.players_list.index(player)
        if player_index == self.playing_player_index:
            self.numbered_player_propositions[
                player_index].player_proposition.proposition = proposition
            self.playing_player_index += 1
        else:
            return "Wait for your turn!"

    def all_propositions_made(self) -> bool:
        """
        Checks if all propositions have been made.
        :return: True if all propositions have been made, False otherwise.
        """
        for numbered_proposition in self.numbered_player_propositions:
            if numbered_proposition.player_proposition.proposition is None:
                return False
        return True

    def make_hypothesis(self, hypothesis: list[PlayerProposition]) -> bool:
        """
        Sets order_hypothesis
        :param hypothesis: the order hypothesis
        :return:
        """
        if not self.all_propositions_made():
            print("Wait for your friends to make their propositions!")
            return False
        self.order_hypothesis = hypothesis
        sorted_propositions = sorted(self.numbered_player_propositions,
                                     key=lambda x: x.number)
        return [prop.player_proposition
                for prop in sorted_propositions] == hypothesis
