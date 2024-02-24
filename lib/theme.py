from pydantic import BaseModel, Field


class Theme(BaseModel):
    index: int = Field(description="The index of the theme in the database.",
                       example=0)
    title: str = Field(
        description="The title of the theme, what it deals with.",
        example="Mr Bond, si vous ne me donnez pas le code secret, je vais... "
    )
    top1: str = Field(
        description=
        "Explanation of the top 1 (most 'something') option for that theme.",
        example="Plus petite menace")
    top10: str = Field(
        description=
        "Explanation of the top 10 (most opposite 'something') option for that theme.",
        example="Plus grande menace")

    def __str__(self) -> str:
        return f"- Title: {self.title}\n- Top 1 : {self.top1}\n- Top 10 : {self.top10}"
