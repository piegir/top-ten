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
        themes = []
        for i in range(len(selected_themes)):
            index = selected_themes.iloc[i].name
            title = selected_themes.iloc[i].title
            top1 = selected_themes.iloc[i].top1
            top10 = selected_themes.iloc[i].top10
            themes.append(Theme(index, title, top1, top10))
        return themes
