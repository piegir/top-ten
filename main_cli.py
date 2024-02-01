from lib.game import Game


def play():
    player1 = "Pierre"
    player2 = "Eloise"
    player3 = "Dylan"
    player4 = "Cindy"
    players = [player1, player2, player3, player4]
    game = Game(players, 3, 0, 3)
    while not game.is_game_complete():
        input("Press enter to start new round")
        print("New round!\n")
        game.start_new_round()
        current_round = game.rounds[-1]
        first_player = current_round.players_list[
            current_round.playing_player_index]
        print(str(first_player) + ", pick a theme:")
        for i, theme in enumerate(current_round.card):
            print(f"{i}: {theme}")
        theme_index = input("Enter the index of the chosen theme: ")
        while not theme_index.isnumeric() or int(theme_index) < 0 or int(
                theme_index) >= len(current_round.card):
            print(
                f"Index should be between 0 and {len(current_round.card)-1}.")
            theme_index = input("Enter the index of the chosen theme: ")
        theme = current_round.card[int(theme_index)]
        current_round.set_theme(theme)
        for player_proposition in current_round.numbered_player_propositions:
            print(
                f"{player_proposition.player_proposition.player} gets number {player_proposition.number}."
            )

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
        print(
            f"{first_player}, you will have to enter the usernames of the players in the correct order ({current_round.theme.top1} to {current_round.theme.top10})."
        )
        i = 0
        for player in players:
            hypothesis_name = input(f"{i}: ")
            while hypothesis_name not in available_choices:
                print("Enter a valid player username.")
                hypothesis_name = input(f"{i}: ")
            hypothesis.append(name_to_prop[hypothesis_name])
            available_choices.remove(hypothesis_name)
            i += 1

        current_round.make_hypothesis(hypothesis)
        if current_round.success:
            print("You won this round!")
        else:
            print("You lost this round! Correct order was:")
            sorted_propositions = sorted(
                current_round.numbered_player_propositions,
                key=lambda x: x.number)
            print([
                prop.player_proposition.proposition
                for prop in sorted_propositions
            ])
        print()

    if game.is_game_won():
        print("Yay! You won this game!")
    else:
        print("Booooo, you lost this game!")


if __name__ == '__main__':
    play()
