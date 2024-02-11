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

export class Username extends Component {
    render () {
        return (
            <div className="Username">
                <p>
                    Username:<br/>
                    {currentUser.username}
                </p>
                <button onClick={this.props.logOutHandler}>
                    Logout
                </button>
            </div>
        )
    }
}

export class Login extends Component {
    state = {username: ""};

    liveUpdateUsername = (event) => {
        this.setState({username: event.target.value});
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
                    <button onClick={() => {
                        this.props.loginHandler(this.state);
                    }
                    }>
                        Confirm
                    </button>
                </div>
            </div>
        );
    }
}
