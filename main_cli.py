from lib.game import Game

# Game config
max_nb_rounds = 3
starting_player_index = 0
nb_themes_per_card = 3


def play():
    players = []
    while True:
        player_name = input(
            "Enter the name of a player that will be part of the game (empty to confirm the current list): "
        )
        if player_name == "":
            try:
                game = Game(players, max_nb_rounds, starting_player_index,
                            nb_themes_per_card)
                break
            except Exception as e:
                print(e)
        else:
            if player_name in players:
                print(
                    f"'{player_name}' already taken, please choose another username."
                )
            else:
                players.append(player_name)
        print(f"Current players registered for the game: {players}")
    while not game.is_game_complete():
        input(
            f"Press enter to start new round (rounds left: {max_nb_rounds - len(game.rounds)})"
        )
        print("New round!\n")
        game.start_new_round()
        current_round = game.rounds[-1]
        first_player = current_round.players_list[
            current_round.playing_player_index]
        print(str(first_player) + ", pick a theme:")
        for i, theme in enumerate(current_round.card):
            print(f"{i}:\n{theme}")
        theme_index = input("Enter the index of the chosen theme: ")
        while not theme_index.isnumeric() or int(theme_index) < 0 or int(
                theme_index) >= len(current_round.card):
            print(
                f"Index should be between 0 and {len(current_round.card)-1}.")
            theme_index = input("Enter the index of the chosen theme: ")
        theme = current_round.card[int(theme_index)]
        print(f"Selected theme:\n{theme}")
        print()
        current_round.set_theme(theme)
        for player_proposition in current_round.numbered_player_propositions:
            print(
                f"{player_proposition.player_proposition.player} gets number {player_proposition.number}."
            )
        print()

        while not current_round.all_propositions_made():
            playing_player = current_round.players_list[
                current_round.playing_player_index]
            proposition = input(f"{playing_player}, enter your proposition: ")
            current_round.set_player_proposition(proposition, playing_player)

        name_to_prop = {
            prop.player_proposition.player: prop.player_proposition
            for prop in current_round.numbered_player_propositions
        }
        available_choices = list(name_to_prop.keys())
        hypothesis = []
        print()
        print("Propositions recap:")
        for name, prop in name_to_prop.items():
            print(f"{name}: {prop.proposition}")
        print(
            f"{first_player}, make a hypothesis on the correct order "
            f"(from '{current_round.theme.top1}' to '{current_round.theme.top10}') "
            f"using the players usernames.")
        i = 0
        for player in players:
            hypothesis_name = input(f"{i}: ")
            while hypothesis_name not in available_choices:
                print("Enter a valid player username.")
                hypothesis_name = input(f"{i}: ")
            hypothesis.append(name_to_prop[hypothesis_name])
            available_choices.remove(hypothesis_name)
            i += 1
        print()

        current_round.make_hypothesis(hypothesis)
        print("Correct order was:")
        sorted_propositions = sorted(
            current_round.numbered_player_propositions, key=lambda x: x.number)
        for numbered_proposition in sorted_propositions:
            print(numbered_proposition)
            print()
        print(
            f"The success rate of this round was {current_round.result * 100}%"
        )
        print()

    print("The success rate of all rounds of the game were:")
    print([f"{this_round.result * 100}%" for this_round in game.rounds])


if __name__ == '__main__':
    play()
