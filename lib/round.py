import itertools
from typing import Iterator


class Round:
    id_round: Iterator[int] = itertools.count(1)

    def __init__(self):
        self.id: int = next(Round.id_round)
        self.complete: bool = False
        self.theme: str = ""
        self.propositions: list[str] = []
        self.player_card: dict = {}
