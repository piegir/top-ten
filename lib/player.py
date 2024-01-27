import itertools


class Player:
    id_player = itertools.count()

    def __init__(self, name):
        self.id = next(Player.id_player)
        self.name = name

    def __str__(self):
        return "Name: %s, ID: %s" % (self.name, self.id)
