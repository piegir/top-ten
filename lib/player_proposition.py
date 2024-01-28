from pydantic import BaseModel, Field, field_validator

from lib.player import Player


class PlayerProposition(BaseModel):
    player: Player = Field(description="The player that made the proposition.",
                           example=Player())
    number: int = Field(
        description="The 'top' number of the player, between 1 and 10.",
        example=5)
    proposition: str | None = Field(
        description="The content of the proposition made.", default=None)

    @field_validator("number")
    def validate_number(self, number):
        if not 1 <= number <= 10:
            raise ValueError("'Top' number should be between 1 and 10.")
        return number
