import logo from './logo.svg';
import './App.css';
import React from "react";
import {currentUser, SetCurrentUser, GetUserInfo} from "./authentication/authentication.js";

function App() {
    SetCurrentUser();
    let userInAPI = GetUserInfo();
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <div>
                    Username given: {currentUser.username && currentUser.username}, Username retrieved: {userInAPI.username && userInAPI.username}
                </div>
                <div>
                    Full Name: {currentUser.fullName && currentUser.fullName}, Full Name retrieved: {userInAPI.fullName && userInAPI.fullName}
                </div>
            </header>
        </div>
    );
}

export default App;
