import random
import itertools
from typing import Iterator

from lib.player import Player


class Round:
    id_round: Iterator[int] = itertools.count(1)

    def __init__(self):
        self.id: int = next(Round.id_round)
        self.complete: bool = False
        self.theme: str = ""
        self.propositions: list[str] = []
        self.player_card: dict = {}

    def get_theme(self):
        return ("Mr Bond, si vous ne me donnez pas le code secret, je vais... "
                "Complétez de la petite menace à la grande menace")

    def show_player_card(self):
        for player, card in self.player_card.items():
            print("%s: %s" % (player, card))

    def play(self, players: list[Player]):
        self.theme = self.get_theme()
        print(self.theme)
        self.assign_cards(players)
        self.show_player_card()

    def assign_cards(self, players: list[Player]):
        for nb, player in zip(random.sample(range(1, 11), len(players)),
                              players):
            self.player_card[player]: int = nb
