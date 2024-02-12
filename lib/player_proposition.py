from pydantic import BaseModel, Field, field_validator


class Proposition(BaseModel):
    proposition: str | None = Field(
        description="The content of the proposition made.", default=None)


class PlayerProposition(BaseModel):
    player: str = Field(
        description="The username of the player that made the proposition.",
        example="johndoe")
    proposition: str | None = Field(
        description="The content of the proposition made.", default=None)


class NumberedPlayerProposition(BaseModel):
    number: int = Field(
        description="The 'top' number of the player, between 1 and 10.",
        example=5)
    player_proposition: PlayerProposition = Field(
        description="The player proposition.",
        example=PlayerProposition(player="johndoe"))

    @field_validator('number')
    def check_number_in_1_10(cls, v: int):
        if not 1 <= v <= 10:
            raise ValueError("'Top' number should be between 1 and 10.")
        return v
