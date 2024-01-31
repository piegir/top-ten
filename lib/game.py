from lib.player import Player
from lib.round import Round
from lib.theme import Theme


class Game:

    def __init__(self,
                 players_list: list[Player],
                 max_nb_rounds: int,
                 starting_player: int = 0,
                 nb_themes_per_card: int = 3):
        if len(players_list) > 10 or len(players_list) < 4:
            raise ValueError(
                "Nombre de joueurs incorrect. Veuillez être entre 4 et 10.")
        self.players_list: list[Player] = players_list
        self.max_nb_rounds: int = max_nb_rounds
        self.starting_player: int = starting_player
        self.nb_themes_per_card: int = nb_themes_per_card
        self.played_themes: list[Theme] = []
        self.rounds: list[Round] = []

    def start_new_round(self):
        """
        Start a new round
        :return:
        """
        if self.is_round_in_progress():
            print("A round is already in progress.")
            return
        if self.is_game_complete():
            print("The game is already complete.")
            return
        if len(self.rounds) > 0:
            self.played_themes.append(self.rounds[-1].theme)
            self.starting_player = (self.starting_player + 1) % len(
                self.players_list)

        shifted_players_list: list[
            Player] = self.players_list[self.starting_player:len(
                self.players_list)] + self.players_list[0:self.starting_player]
        current_round: Round = Round(shifted_players_list,
                                     self.nb_themes_per_card,
                                     self.played_themes)
        self.rounds.append(current_round)

    def is_round_in_progress(self) -> bool:
        """
        Checks if a round is in progress.
        :return: True if a round is in progress, False if the last round is complete
        """
        if len(self.rounds) == 0:
            return False
        return not self.rounds[-1].is_complete()

    def is_game_complete(self) -> bool:
        """
        Checks if the game is complete
        :return: True if there has been max_nb_rounds played and the last one is complete
        """
        return (len(self.rounds)
                == self.max_nb_rounds) and self.rounds[-1].is_complete()

    def is_game_won(self):
        if not self.is_game_complete():
            return False
        nb_rounds_won = 0
        nb_rounds_lost = 0
        for played_round in self.rounds:
            if played_round.success:
                nb_rounds_won += 1
            else:
                nb_rounds_lost += 1
        return nb_rounds_won > nb_rounds_lost
