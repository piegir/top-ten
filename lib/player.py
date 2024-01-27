class Player:

    def __init__(self, name, id):
        self.name: str = name
        self.id: int = id

    def __str__(self) -> str:
        return f"{self.name} (#{self.id})"
