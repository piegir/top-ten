import './App.css';
import React from "react";
import {currentUser} from "./authentication/authentication.js";
import {Players} from "./players/players.js"
import {GameSetup} from "./game/game.js"

function App() {
    // SetCurrentUser();
    // let userInAPI = GetUserInfo();
    return (
        <div className="App">
            <div className="Username">
                <p>
                    Username:<br />
                    {currentUser.username}
                </p>
            </div>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <Players/>
                <GameSetup/>
            </div>
        </div>

    );
}

export default App;
