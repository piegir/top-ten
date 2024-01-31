import pandas as pd

from lib.theme import Theme


class DataBase:

    def __init__(self):
        self.themes = pd.read_csv("database/themes.csv")

    def get_n_themes(self,
                     n: int,
                     excluded_indices: list[int] | None = None) -> list[Theme]:
        """
        Get some random themes from the database, potentially excluding some themes.

        :param n: Number of themes to be obtained
        :param excluded_indices: The indices of the themes that are not allowed to be picked
        :return: The randomly selected themes
        """
        if excluded_indices is not None:
            possible_themes = self.themes.drop(excluded_indices)
        else:
            possible_themes = self.themes
        selected_themes = possible_themes.sample(n).sort_index()

        themes = [
            Theme(index=selected_themes.iloc[i].name,
                  title=selected_themes.iloc[i].title,
                  top1=selected_themes.iloc[i].top1,
                  top10=selected_themes.iloc[i].top10)
            for i in range(len(selected_themes))
        ]
        return themes

    def pick_random_card(self, nb_themes_per_card: int,
                         played_themes: list[Theme]) -> list[Theme]:
        """
        Called by the playing player, sets the card to list of nb_themes themes
        :param nb_themes_per_card: number of themes on the card
        :param played_themes: themes already played
        :return: the list of random themes
        """
        played_indices = [theme.index for theme in played_themes]
        return self.get_n_themes(nb_themes_per_card, played_indices)


database = DataBase()
