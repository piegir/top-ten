import random

from lib.player import Player
from lib.theme import Theme
from lib.player_proposition import PlayerProposition
from database.database import DataBase


class Round:

    def __init__(self, players_list: list[Player], nb_themes_per_card: int):
        self.players_list: list[Player] = players_list
        self.playing_player_index: int = 0
        self.card: list[Theme] = self.pick_random_card(nb_themes_per_card)
        self.theme: Theme | None = None
        self.player_numbers: list[int] = self.assign_numbers()
        self.player_propositions: list[PlayerProposition] = []
        self.order_hypothesis: list[PlayerProposition] = []
        self.round_complete: bool = False
        self.success: bool = False

    def pick_random_card(self, nb_themes_per_card: int):
        """
        Called by the playing player, sets the card to list of nb_themes themes
        :param nb_themes_per_card: number of themes on the card
        """
        return []

    def set_theme(self, theme_index: int):
        """
        Called by the playing player, sets the theme to their choice
        :param theme_index: the index of the theme in the card
        """
        self.theme = self.card[theme_index]

    def assign_numbers(self):
        """
        Assigns a different random number between 1 and 10 to each player
        """
        return random.sample(range(1, 11), len(self.players_list))

    def set_player_proposition(self, proposition: str, player: Player):
        """
        Sets the proposition for a player
        :param proposition: The proposition of the player
        :param player: The player setting the proposition
        :return:
        """
        return

    def make_hypothesis(self, hypothesis: list[PlayerProposition]) -> bool:
        """
        Sets order_hypothesis and checks its correctness
        :param hypothesis: The order hypothesis
        :return: isHypothesisCorrect
        """
        return False
