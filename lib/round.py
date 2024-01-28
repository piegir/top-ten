from lib.player import Player
from lib.theme import Theme
from lib.player_proposition import PlayerProposition


class Round:

    def __init__(self, players_list: list[Player]):
        self.players_list: list[Player] = players_list
        self.playing_player_index: int = 0
        self.card: list[Theme] = []
        self.theme: Theme = Theme()
        self.player_numbers: list[int] = []
        self.player_propositions: list[PlayerProposition] = []
        self.order_hypothesis: list[PlayerProposition] = []
        self.round_complete: bool = False
        self.success: bool = False

    def get_random_card(self, nb_themes: int):
        """
        Called by the playing player, sets the card to list of nb_themes themes
        :param nb_themes: number of themes on the card
        """
        self.card = []

    def set_theme(self, theme_index: int):
        """
        Called by the playing player, sets the theme to their choice
        :param theme_index: the index of the theme in the card
        """
        self.theme = Theme()

    def assign_numbers(self):
        """
        Assigns a different random number between 1 and 10 to each player
        """
        self.player_numbers = []

    def set_player_proposition(self, proposition: str, player: Player):
        """
        Sets the proposition for a player
        :param proposition: The proposition of the player
        :param player: The player setting the proposition
        :return:
        """
        self.player_propositions.append(PlayerProposition())

    def make_hypothesis(self, hypothesis: list[PlayerProposition]) -> bool:
        """
        Sets order_hypothesis and checks its correctness
        :param hypothesis: The order hypothesis
        :return: isHypothesisCorrect
        """
        return False
