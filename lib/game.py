from lib.player import Player
from lib.round import Round
from lib.theme import Theme


class Game:

    def __init__(self, players_list: list[Player], max_nb_rounds: int,
                 starting_player: int, nb_themes_per_card: int):
        self.players_list: list[Player] = players_list
        self.max_nb_rounds: int = max_nb_rounds
        self.starting_player: int = starting_player
        self.nb_themes_per_card: int = nb_themes_per_card
        self.nb_rounds_won: int = 0
        self.nb_rounds_lost: int = 0
        self.played_themes: list[Theme] = []
        self.rounds: list[Round] = []

    def start_new_round(self):
        """
        Start a new round
        :return:
        """
        return

    def is_round_in_progress(self) -> bool:
        """
        Checks if a round is in progress
        :return:
        """
        return False

    def is_game_complete(self) -> bool:
        """
        Checks if the game is complete
        :return:
        """
        return False
