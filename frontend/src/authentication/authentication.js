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
