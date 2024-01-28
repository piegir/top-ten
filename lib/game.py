from lib.player import Player
from lib.round import Round
from lib.theme import Theme


class Game:

    def __init__(self, players_list: list[Player], max_nb_rounds: int,
                 starting_player: int, nb_themes: int):
        self.players_list: list[Player] = players_list
        self.max_nb_rounds: int = max_nb_rounds
        self.starting_player: int = starting_player
        self.nb_themes: int = nb_themes
        self.is_round_in_progress: bool = False
        self.nb_rounds_won: int = 0
        self.nb_rounds_lost: int = 0
        self.played_themes: list[Theme] = []
        self.rounds: list[Round] = []
        self.is_game_complete: bool = False

    def start_new_round(self):
        """
        Start a new round
        :return:
        """
        return
