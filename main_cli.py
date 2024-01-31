from lib.player import Player
from lib.game import Game


def play():
    player1 = Player(name="Pierre", id=0)
    player2 = Player(name="Eloise", id=1)
    player3 = Player(name="Dylan", id=12)
    player4 = Player(name="Cindy", id=36)
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

        id_to_prop = {
            prop.player_proposition.player.id: prop.player_proposition
            for prop in current_round.numbered_player_propositions
        }
        hypothesis = []
        print(
            f"{first_player}, you will have to enter the IDs of the players in the correct order ({current_round.theme.top1} to {current_round.theme.top10}) without the #."
        )
        for player in players:
            hypothesis_id = input("- ")
            while not hypothesis_id.isnumeric() or int(
                    hypothesis_id) not in id_to_prop.keys():
                hypothesis_id = input(
                    "The entered ID is incorrect. Please enter a correct ID: ")
            hypothesis.append(id_to_prop[int(hypothesis_id)])
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
