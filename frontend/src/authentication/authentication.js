import './authentication.css';
import React, {Component} from "react";
import {makeGetCall, makePostCall, repeat} from "../common/common.js";

export let currentUser = {
    username: null,
    loggedIn: false,
};

export function userLogin() {
    return makePostCall("/authentication/login");
}

export function userLogout() {
    return makePostCall("/authentication/logout");
}

class Login extends Component {
    state = {username: ""};

    liveUpdateUsername = (event) => {
        this.setState({username: event.target.value});
    }

    loginHandler = (e) => {
        e.preventDefault();

        // Store username as provided by the user
        currentUser.username = this.state.username;
        currentUser.loggedIn = true;

        // Perform REST API login
        userLogin()
            .then((loginSuccess) => {
                if (loginSuccess.status) {
                    this.props.goToGamePreparationHandler();
                } else {
                    currentUser.username = null;
                    currentUser.loggedIn = false;
                    alert(loginSuccess.message);
                }
            });
    }


    render() {
        return (
            <div className="LoginBox">
                <div className="SubTitle">
                    Choose a username:
                </div>
                <form onSubmit={this.loginHandler}>
                    <input onChange={this.liveUpdateUsername}
                           type="text"
                           autoFocus={true}
                           className="InputBox"
                    />
                    <div className="ButtonBox">
                        <button type="submit">
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}


export class Username extends Component {

    checkUserStillConnected = () => {
        makeGetCall("/authentication/check_user_connected").then((connected) => {
            if (!connected) {
                currentUser.username = null;
                currentUser.loggedIn = false;
                this.props.goToAskCredentialsHandler();
            }
            else {
                this.checkUserStillConnectedId = repeat(this.checkUserStillConnected, 100);
            }
        })
    }

    checkUserStillConnectedId = repeat(this.checkUserStillConnected, 100);

    componentWillUnmount() {
        clearTimeout(this.checkUserStillConnectedId);
    }

    logoutHandler = () => {
        if (window.confirm("Logging out will make you leave the game you are part of. Are you sure?")) {
            userLogout()
                .then((logoutSuccess) => {
                    if (logoutSuccess.status) {
                        currentUser.username = null;
                        currentUser.loggedIn = false;
                        this.props.goToAskCredentialsHandler();
                    } else {
                        alert(logoutSuccess.message);
                    }
                });
        }
    }

    render () {
        return (
            <div className="Username">
                <span className="UsernameText">{currentUser.username}<br/></span>
                <button onClick={this.logoutHandler}>
                    Logout
                </button>
            </div>
        )
    }
}


export class AskCredentials extends Component {
    render() {
        return (
            <div className="GlobalGrid">
                <div className="HeadBox">
                    <div className="Title">
                        Top Ten
                    </div>
                </div>
                <Login goToGamePreparationHandler={this.props.goToGamePreparationHandler}/>
            </div>
        );
    }
}
