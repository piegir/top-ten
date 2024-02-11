import './authentication.css';
import React, {Component} from "react";
import {makeGetCall, makePostCall} from "../common/common.js";

export let currentUser = {
    username: "Player1",
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

    loginHandler = () => {
        // Store username as provided by the user
        currentUser.username = this.state.username;
        // Perform REST API login
        userLogin()
            .then((loginSuccess) => {
                if (loginSuccess.status) {
                    alert(loginSuccess.message);
                    this.props.goToGamePreparationHandler();
                } else {
                    alert(loginSuccess.message);
                }
            });
    }


    render() {
        return (
            <div className="LoginBox">
                <div className="LoginUsername">
                    <div>
                        Choose a Username:
                    </div>
                    <div>
                        <input onChange={this.liveUpdateUsername}
                               type="text"
                        />
                    </div>
                </div>
                <div className="LoginButton">
                    <button onClick={this.loginHandler}>
                        Confirm
                    </button>
                </div>
            </div>
        );
    }
}


export class Username extends Component {

    logoutHandler = () => {
        if (window.confirm("Logging out will make you leave the game you are part of. Are you sure?")) {
            userLogout()
                .then((logoutSuccess) => {
                    if (logoutSuccess.status) {
                        alert(logoutSuccess.message);
                        currentUser.username = "";
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
                {currentUser.username}<br/>
                <button className="LogoutButton" onClick={this.logoutHandler}>
                    Logout
                </button>
            </div>
        )
    }
}


export class AskCredentials extends Component {
    render() {
        return (
            <div className="App">
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                </div>
                <Login goToGamePreparationHandler={this.props.goToGamePreparationHandler}/>
            </div>

        );
    }
}
