from lib.player import Player


class PlayerProposition:

    def __init__(self, number: int, player: Player):
        self.player: Player = player
        self.number: int = number
        self.proposition: str = ""

    def set_proposition(self, proposition: str):
        self.proposition = proposition
