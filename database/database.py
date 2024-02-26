import pandas as pd

from lib.theme import Theme

supported_languages = ["en", "fr"]

themes = {
    language: pd.read_csv(f"database/themes_{language}.csv")
    for language in supported_languages
}


class DataBase:

    def __init__(self, language="en"):
        if language not in supported_languages:
            raise ValueError(
                f"Provided language must be one of the supported languages: {supported_languages}"
            )
        themes_file = f"database/themes_{language}.csv"
        self.themes = pd.read_csv(themes_file)

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


# Store theme database for each language
databases = {language: DataBase(language) for language in supported_languages}


def pick_random_card(nb_themes_per_card: int, language: str,
                     played_themes: list[Theme]) -> list[Theme]:
    """
    Called by the playing player, sets the card to list of nb_themes themes
    :param nb_themes_per_card: number of themes on the card
    :param language: the language to use for the themes on the card
    :param played_themes: themes already played
    :return: the list of random themes
    """
    if language not in supported_languages:
        raise ValueError(
            f"Provided language must be one of the supported languages: {supported_languages}"
        )
    played_indices = [theme.index for theme in played_themes]
    return databases[language].get_n_themes(nb_themes_per_card, played_indices)
