from player import Player


class Game:

    def __init__(self, players_list: list[Player]):
        self.players = players_list
        self.rounds = []
        self.rounds_won = 0
        self.rounds_lost = 0
        self.complete = False
