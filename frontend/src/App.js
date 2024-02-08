import './App.css';
import React from "react";
import {Username} from "./authentication/authentication.js";
import {Users} from "./users/users.js"
import {GameSetup, StartRound, roundStarted, GameProgress} from "./game/game.js"
import {CurrentUserNumber, PlayerPropositions, SelectTheme, CurrentTheme, MakeProposition, MakeHypothesis} from "./rounds/rounds"


function GamePreparation() {
    return (
        <div className="App">
            <Username/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <Users/>
                <GameSetup/>
            </div>
        </div>

    );
}

function RoundStarting() {
    return (
        <div className="App">
            <GameProgress/>
            <Username/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <Users/>
                <StartRound/>
            </div>
        </div>

    );
}

function ThemeSelection() {
    return (
        <div className="App">
            <GameProgress/>
            <Username/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <Users/>
                <SelectTheme/>
            </div>
        </div>

    );
}

function WaitThemeSelection() {
    return (
        <div className="App">
            <GameProgress/>
            <Username/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <CurrentUserNumber/>
                <Users/>
                <div className="UserActionBox"/>
            </div>
        </div>

    );
}

function PropositionMaking() {
    return (
        <div className="App">
            <GameProgress/>
            <Username/>
            <CurrentUserNumber/>
            <CurrentTheme/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <PlayerPropositions/>
                <MakeProposition/>
            </div>
        </div>

    );
}

function WaitPropositionMaking() {
    return (
        <div className="App">
            <GameProgress/>
            <Username/>
            <CurrentUserNumber/>
            <CurrentTheme/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <PlayerPropositions/>
                <div className="UserActionBox"/>
            </div>
        </div>

    );
}

function HypothesisMaking() {
    return (
        <div className="App">
            <GameProgress/>
            <Username/>
            <CurrentUserNumber/>
            <CurrentTheme/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <PlayerPropositions/>
                <MakeHypothesis/>
            </div>
        </div>

    );
}



function App() {
    return (
        <HypothesisMaking/>
    )
}

export default App;
