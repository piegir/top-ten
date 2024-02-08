import './App.css';
import React from "react";
import {Username} from "./authentication/authentication.js";
import {Players} from "./players/players.js"
import {GameSetup, StartRound, roundStarted, GameProgress} from "./game/game.js"
import {CurrentUserNumber, SelectTheme, CurrentTheme, MakeProposition} from "./rounds/rounds"


function GamePreparation() {
    return (
        <div className="App">
            <Username/>
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

function RoundStarting() {
    return (
        <div className="App">
            <GameProgress/>
            <Username/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <Players/>
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
                <Players/>
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
            <CurrentUserNumber/>
            <div className="Grid">
                <div className="Title">
                    Top Ten
                </div>
                <Players/>
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
                <Players/>
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
                <Players/>
            </div>
        </div>

    );
}



function App() {
    return (
        <PropositionMaking/>
    )
}

export default App;
