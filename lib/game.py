from lib.round import Round
from lib.theme import Theme


class Game:

    def __init__(self,
                 players_list: list[str],
                 max_nb_rounds: int,
                 starting_player_index: int = 0,
                 nb_themes_per_card: int = 3):
        if len(players_list) > 10 or len(players_list) < 2:
            raise ValueError(
                f"Incorrect number of players {len(players_list)}. You need to be between 4 and 10 players."
            )
        self.players_list: list[str] = players_list
        self.max_nb_rounds: int = max_nb_rounds
        self.starting_player_index: int = starting_player_index
        self.nb_themes_per_card: int = nb_themes_per_card
        self.played_themes: list[Theme] = []
        self.rounds: list[Round] = []

    def start_new_round(self):
        """
        Start a new round
        :return:
        """
        if self.is_round_in_progress():
            raise RuntimeError("A round is already in progress.")
        if self.is_game_complete():
            raise RuntimeError("The game is already complete.")
        if len(self.rounds) > 0:
            self.played_themes.append(self.rounds[-1].theme)
            self.starting_player_index = (self.starting_player_index +
                                          1) % len(self.players_list)

        shifted_players_list: list[
            str] = self.players_list[self.starting_player_index:len(
                self.players_list)] + self.players_list[0:self.
                                                        starting_player_index]
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
