from typing import Annotated
from pydantic import BaseModel, Field, SecretStr
from hashlib import sha256
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import json

router = APIRouter(prefix="/authentication", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="authentication/login")

users_database_path = "app/authentication/users.json"

with open(users_database_path, "r") as input_file:
    users_database = json.load(input_file)


class User(BaseModel):
    username: str = Field(
        description="The username that will be used for authentication.",
        example="johndoe")
    full_name: str | None = Field(description="User's full name.",
                                  default=None)


class UserInDB(User):
    hashed_password: str = Field(
        description="The user password as encoded in the database.")


def hash_password(password: str) -> str:
    return sha256(password.encode('utf-8')).hexdigest()


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def decode_token(token: str) -> User:
    """
    Decodes a token to find the corresponding user.

    :param token: The token containing the user information
    :return: The corresponding user.
    """
    user = get_user(users_database, token)
    return user


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def get_current_active_user(
        current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@router.post("/login", include_in_schema=False)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    if form_data.username not in users_database.keys():
        raise HTTPException(
            status_code=400,
            detail="User doesn't exits, make sure to signup first.")
    user_dict = users_database.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400,
                            detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400,
                            detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}


@router.post("/signup")
def signup(username: str,
           password: SecretStr,
           repeat_password: SecretStr,
           full_name: str | None = None):
    if username in users_database.keys():
        raise HTTPException(status_code=400,
                            detail=f"Username '{username}' already taken.")
    if password != repeat_password:
        raise HTTPException(status_code=400,
                            detail="Make sure password entries are identical.")
    users_database[username] = {
        "username": username,
        "full_name": full_name,
        "hashed_password": hash_password(password.get_secret_value()),
    }
    with open(users_database_path, "w") as output_file:
        json.dump(users_database, output_file, indent=2)


@router.get("/users/me")
def read_users_me(current_user: Annotated[User,
                                          Depends(get_current_active_user)]):
    return current_user
