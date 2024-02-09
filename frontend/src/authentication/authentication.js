import './authentication.css';
import React, {useState, useEffect, Component} from "react";
import {restApiIp, restApiPort} from "../common/common.js";

export let currentUser = {
    username: "Player1",
};

export function SetCurrentUser() {
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    useEffect(() => {
        setUsername(prompt("What is your username?"));
        setFullName(prompt("What is your full name?"));
    }, []);
    currentUser.username = username;
    currentUser.fullName = fullName;
}

export function GetUserInfo() {
    const [username, setUserName] = useState(null);
    const [fullName, setFullName] = useState(null);

    useEffect(() => {
        fetch(`http://${restApiIp}:${restApiPort}/authentication/get_my_info`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${currentUser.username}`,
            },
        })
            .then((response) => response.json())
            .then((userData) => {
                setUserName(userData.username);
                setFullName(userData.full_name);
            })
            .catch((error) => alert(error));
    });

    return {
        username: username,
        fullName: fullName,
    }
}

export function Username() {
    return (
        <div className="Username">
            <p>
                Username:<br/>
                {currentUser.username}
            </p>
        </div>
    )
}


class Login extends Component {
    state = {username: ""};

    liveUpdateUsername = (event) => {
        this.setState({username: event.target.value});
    }

    setUsername = () => {
        currentUser.username = this.state.username;
    }

    render() {
        return (
            <div>
                <div className="LoginUsername">
                    <div>
                        Username:
                    </div>
                    <div>
                        <input onChange={this.liveUpdateUsername}
                            type="text"
                        />
                    </div>
                </div>
                <div className="LoginPassword">
                    <div>
                        Password:
                    </div>
                    <div>
                        <input
                            type="password"
                        />
                    </div>
                </div>
                <div className="LoginButton">
                    <button onClick={() => {
                            this.setUsername();
                            this.props.handler();
                        }
                    }>
                        Login
                    </button>
                </div>
            </div>
        );
    }
}


class Signup extends Component {
    state = {username: ""};

    liveUpdateUsername = (event) => {
        this.setState({username: event.target.value});
    }

    setUsername = () => {
        currentUser.username = this.state.username;
    }

    render() {
        return (
            <div>
                <div className="LoginUsername">
                    <div>
                        Username:
                    </div>
                    <div>
                        <input onChange={this.liveUpdateUsername}
                               type="text"
                        />
                    </div>
                </div>
                <div className="LoginPassword">
                    <div>
                        Password:
                    </div>
                    <div>
                        <input
                            type="password"
                        />
                    </div>
                </div>
                <div className="LoginPassword">
                    <div>
                        Confirm password:
                    </div>
                    <div>
                        <input
                            type="password"
                        />
                    </div>
                </div>
                <div className="LoginButton">
                    <button onClick={() => {
                        this.setUsername();
                        this.props.handler();
                    }
                    }>
                        Signup
                    </button>
                </div>
            </div>
        );
    }
}

export class LoginSignup extends Component {
    state = {signup: false};

    switchToSignup = () => {
        this.setState({signup: true});
    }

    switchToLogin = () => {
        this.setState({signup: false});
    }

    render() {
        return (
            <div className="LoginSignupBox">
                <div className="LoginSignupTabButtons">
                    <button onClick={this.switchToLogin}>
                        Login
                    </button>
                    <button onClick={this.switchToSignup}>
                        Signup
                    </button>
                </div>
                <div>
                    {this.state.signup ?
                        <Signup handler={() => {
                            this.props.handler();
                        }}/> :
                        <Login handler={() => {
                            this.props.handler();
                        }}/>}
                </div>
            </div>
        );
    }
}
