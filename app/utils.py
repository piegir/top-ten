from pydantic import BaseModel, Field


class ActionStatus(BaseModel):
    """
    Container of the status of an action. Extends `pydantic.BaseModel`.
    """
    status: bool = Field(description="True if action succeeded.", example=True)
    message: str = Field(description="A message about the action.",
                         example="Action succeeded.")
