import itertools


class Round:
    id_round = itertools.count()

    def __init__(self):
        self.id = next(Round.id_round)
        self.complete = False
        self.theme = ""
        self.propositions = []
        self.player_card = {}
