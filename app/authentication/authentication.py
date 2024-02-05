import argon2
import json
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, SecretStr
from typing import Annotated

from app.utils import ActionStatus

router = APIRouter(prefix="/authentication", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="authentication/login")

users_database_path = "app/authentication/users.json"

with open(users_database_path, "r") as input_file:
    users_database = json.load(input_file)

connected_users = set()


class User(BaseModel):
    username: str = Field(
        description="The username that will be used for authentication.",
        example="johndoe")
    full_name: str | None = Field(description="User's full name.",
                                  default=None)
    hashed_password: str = Field(
        description="The user password as encoded in the database.")


def hash_password(password: str) -> str:
    """
    Encrypt password using argon2 algorithm.

    :param password: Raw password
    :return: Encrypted password
    """
    return argon2.hash_password(password.encode('utf-8')).decode('utf-8')


def verify_password(hashed_password: str, password: str) -> bool:
    """
    Verify password using argon2 algorithm.

    :param hashed_password: Encrypted password
    :param password: Raw password
    :return: True if password matches the hashed password, False otherwise.
    """
    return argon2.verify_password(hashed_password.encode('utf-8'),
                                  password.encode('utf-8'))


def check_user_connected(username: str) -> bool:
    return username in connected_users


def get_user(username: str) -> User:
    """
    Access the user with the given username.

    :param username: The username
    :return: The corresponding user.
    """
    if username not in users_database:
        raise HTTPException(
            status_code=400,
            detail=
            f"User {username} doesn't exist. Create a user with /authentication/signup."
        )
    user_dict = users_database[username]
    return User(**user_dict)


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    """
    Get the current user via its token.

    :param token: The authentication token that contains the username
    :return: The corresponding current user.
    """
    return get_user(token)


@router.post("/login", include_in_schema=False)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> dict:
    """
    Allow user login via OAuth2.

    :param form_data: The OAuth2 form that requests username and password for user login
    :return: A JSON object containing the 'access_token' (here the username) and the 'token_type' (here 'bearer').
    """
    user = get_user(form_data.username)
    if not verify_password(user.hashed_password, form_data.password):
        raise HTTPException(status_code=400,
                            detail="Incorrect username or password")
    connected_users.add(user.username)
    return {"access_token": user.username, "token_type": "bearer"}


@router.post("/signup")
def signup(username: str,
           password: SecretStr,
           repeat_password: SecretStr,
           full_name: str | None = None) -> ActionStatus:
    """
    API call to allow new user to be created (added to the user database).

    :param username: Asks the user for a username
    :param password: Asks the user to provide a password
    :param repeat_password: Asks the user to repeat the password
    :param full_name: Asks the user for their full name (Optional)
    :return: The status success of signing up.
    """
    if username in users_database:
        return ActionStatus(status=False,
                            message=f"Username '{username}' already taken.")
    if password != repeat_password:
        return ActionStatus(
            status=False, message="Make sure password entries are identical.")
    users_database[username] = {
        "username": username,
        "full_name": full_name,
        "hashed_password": hash_password(password.get_secret_value()),
    }
    with open(users_database_path, "w") as output_file:
        json.dump(users_database, output_file, indent=2)
    return ActionStatus(status=True,
                        message=f"New user '{username}' registered.")


@router.get("/get_my_info")
def get_my_info(
        current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """
    API call to access currently logged-in user info.

    :param current_user: The currently logged-in user (automatically detected)
    :return: The currently logged-in user
    """
    return current_user


@router.get("/get_connected_users")
def get_connected_users(
        token: Annotated[str, Depends(oauth2_scheme)]) -> list[str]:
    """
    API call to get the list of all users connected to the server.

    :param token: Automatically check that the user requesting this is logged-in (value unused)
    :return: the list of all connected users.
    """
    return list(connected_users)
