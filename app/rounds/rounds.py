from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.game.game import current_game

router = APIRouter(prefix="/rounds", tags=["Round control"])
