import random

from lib.player import Player
from lib.theme import Theme


class Round:

    def __init__(self, players):
        self.complete: bool = False
        self.theme: Theme = self.get_theme()
        self.propositions: list[str] = []
        self.player_number: dict = {}
        self.assign_numbers(players)

        print(self.theme)
        self.show_player_number()

    def get_theme(self) -> Theme:
        return Theme()

    def show_player_number(self):
        for player, number in self.player_number.items():
            print(f"{player}: {number}")

    def assign_numbers(self, players: list[Player]):
        """
        Assign a number to each player
        :param players:
        :return:
        """
        for nb, player in zip(random.sample(range(1, 11), len(players)),
                              players):
            self.player_number[player]: int = nb
