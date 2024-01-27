import itertools
from typing import Iterator


class Player:
    id_player: Iterator[int] = itertools.count(1)

    def __init__(self, name):
        self.id: int = next(Player.id_player)
        self.name: str = name

    def __str__(self):
        return "%s (#%s)" % (self.name, self.id)
