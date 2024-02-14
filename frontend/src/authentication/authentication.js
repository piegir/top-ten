import './authentication.css';
import React, {Component} from "react";
import {makeGetCall, makePostCall} from "../common/common.js";

export let currentUser = {
    username: null,
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
        // Perform REST API login
        userLogin()
            .then((loginSuccess) => {
                if (loginSuccess.status) {
                    this.props.goToGamePreparationHandler();
                } else {
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
                this.props.goToAskCredentialsHandler();
            }
            else {
                this.checkUserStillConnectedId = setTimeout(this.checkUserStillConnected, 100);
            }
        })
    }

    checkUserStillConnectedId = setTimeout(this.checkUserStillConnected, 100);

    componentWillUnmount() {
        clearTimeout(this.checkUserStillConnectedId);
    }

    logoutHandler = () => {
        if (window.confirm("Logging out will make you leave the game you are part of. Are you sure?")) {
            userLogout()
                .then((logoutSuccess) => {
                    if (logoutSuccess.status) {
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
