from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated

from app.utils import ActionStatus

router = APIRouter(prefix="/authentication", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="authentication/oauth2_login")

connected_users: list[str] = []


def user_connected(username: str) -> bool:
    return username in connected_users


def add_user(username: str) -> ActionStatus:
    """
    Add user to the list of connected users, first checks if the user already exists.

    :param username: The user's username
    :return: The status of adding the user.
    """
    if user_connected(username):
        return ActionStatus(status=False,
                            message=f"Username '{username}' already taken.")
    connected_users.append(username)
    return ActionStatus(status=True, message=f"Connected as {username}.")


def remove_user(username: str) -> ActionStatus:
    """
    Remove user from the list of connected users, first checks if the user is actually connected.

    :param username: The user's username
    :return: The status of adding the user.
    """
    if not user_connected(username):
        return ActionStatus(status=False, message=f"{username} not connected.")
    connected_users.remove(username)
    return ActionStatus(status=True,
                        message=f"{username} properly disconnected.")


@router.post("/oauth2_login", include_in_schema=False)
def oauth2_login(
        form_data: Annotated[OAuth2PasswordRequestForm,
                             Depends()]) -> dict:
    """
    Allow user login via OAuth2.

    :param form_data: The OAuth2 form that requests username and password (unused) for user login
    :return: A JSON object containing the 'access_token' (here the username) and the 'token_type' (here 'bearer').
    """
    return {"access_token": form_data.username, "token_type": "bearer"}


@router.post("/login")
def login(username: Annotated[str, Depends(oauth2_scheme)]) -> ActionStatus:
    """
    API call to allow new user to login.

    :param username: The username of the user to login (automatically detected)
    :return: The status success of the login.
    """
    return add_user(username)


@router.post("/logout")
def logout(username: Annotated[str, Depends(oauth2_scheme)]) -> ActionStatus:
    """
    API call to log out user.

    :param username: The username of the user to log out (automatically detected)
    :return: The status success of the logout.
    """
    return remove_user(username)


@router.post("/force_logout")
def force_logout(username: str) -> ActionStatus:
    """
    API call to forcefully log out user.

    :param username: The username of the user to log out
    :return: The status success of the logout.
    """
    return remove_user(username)


@router.get("/get_username")
def get_username(username: Annotated[str, Depends(oauth2_scheme)]) -> str:
    """
    API call to access currently logged-in user's username.

    :param username: The currently logged-in user's username (automatically detected)
    :return: The currently logged-in user's username
    """
    return username


@router.get("/get_connected_users")
def get_connected_users(
        username: Annotated[str, Depends(oauth2_scheme)]) -> list[str]:
    """
    API call to get the list of all users connected to the server.

    :param username: Automatically check that the user requesting this is logged-in (value unused)
    :return: The list of all connected users.
    """
    return connected_users


@router.get("/check_user_connected")
def check_user_connected(
        username: Annotated[str, Depends(oauth2_scheme)]) -> bool:
    """
    API call to check that the user is still connected.

    :param username: The currently logged-in user's username (automatically detected)
    :return: True if the user is still logged-in, False otherwise.
    """
    return username in connected_users
