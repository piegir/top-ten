from lib.player import Player
from lib.round import Round


class Game:

    def __init__(self, players_list: list[Player]):
        self.players: list[Player] = players_list
        self.rounds: list[Round] = []
        self.rounds_won: int = 0
        self.rounds_lost: int = 0
        self.complete: bool = False

    def get_players(self):
        for player in self.players:
            print(player)

    def new_round(self):
        current_round: Round = Round()
        self.rounds.append(current_round)
        current_round.play(self.players)
