from pydantic import BaseModel, Field


class Player(BaseModel):
    """
    Container of a player information. Extends `pydantic.BaseModel`.
    """
    name: str = Field(description="The player name", example="John Doe")
    id: int = Field(description="The player id", example=0)

    def __str__(self) -> str:
        return f"{self.name} (#{self.id})"
