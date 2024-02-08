import React from "react";
import {currentUser} from "../authentication/authentication.js"
import './rounds.css';

let userNumbers = {
    "Player1": 5,
    "Player2": 10,
    "Player3": 2,
    "Player4": 8,
};

export function CurrentUserNumber() {
    return (
        <div className="CurrentUserNumber">
            <p>
                Your Top Number:<br/>
                {userNumbers[currentUser.username]}
            </p>
        </div>
    )
}


let themes = [
    {
        theme: "A person",
        top1: "Good",
        top10: "Bad",
    },
    {
        theme: "A task",
        top1: "Easy",
        top10: "Hard",
    },
    {
        theme: "A city",
        top1: "Pretty",
        top10: "Ugly",
    }
];

export function SelectTheme() {
    return (
        <div className="UserActionBox">
            <div className="UserActionTitle">
                Select Theme
            </div>
            <table>
                <tr>
                    <td>
                        Theme
                    </td>
                    <td>
                        Top1
                    </td>
                    <td>
                        Top10
                    </td>
                </tr>
                {themes.map((themeObject, themeIndex) => {
                    return (
                        <tr>
                            <td>
                                {themeObject.theme}
                            </td>
                            <td>
                                {themeObject.top1}
                            </td>
                            <td>
                                {themeObject.top10}
                            </td>
                            <td>
                                <button>
                                    Select Theme {themeIndex + 1}
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
}

let currentTheme = themes[0];

export function CurrentTheme() {
    return (
        <div className="CurrentTheme">
            <table>
                <tr>
                    <th>
                        Theme
                    </th>
                    <th>
                        Top1
                    </th>
                    <th>
                        Top10
                    </th>
                </tr>
                <tr>
                    <td>
                        {currentTheme.theme}
                    </td>
                    <td>
                        {currentTheme.top1}
                    </td>
                    <td>
                        {currentTheme.top10}
                    </td>
                </tr>
            </table>
        </div>
    );
}

let playerPropositions = {
    "Player1": "My Neighbor",
    "Player2": "Hitler",
    "Player3": "Martin Luther King",
    "Player4": "Donald Trump",
};

export function MakeProposition() {
    return (
        <div className="UserActionBox">
            <div className="UserActionTitle">
                Make Proposition
            </div>
            <div className="UserActionInput">
                <div className="UserActionInputOption">
                    Your Proposition:
                </div>
                <div className="UserActionInputField">
                    <input
                        type="text"
                    />
                </div>
            </div>
            <div className="UserActionButton">
                <button>
                    Submit
                </button>
            </div>
        </div>
    );
}

export function MakeHypothesis() {
    return (
        <div className="UserActionBox">
            <div className="UserActionTitle">
                Make Hypothesis
            </div>
            <div className="UserActionOrder">
                <table>
                    <tr>
                        <th>
                            Players
                        </th>
                        <th>
                            Propositions
                        </th>
                    </tr>
                    {Object.entries(playerPropositions).map(([playerName, proposition]) => {
                        return (
                            <tr>
                                <td>
                                    {playerName}
                                </td>
                                <td>
                                    {proposition}
                                </td>
                                <td>
                                    <button>
                                        ^
                                    </button>
                                    <button>
                                        v
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </table>
            </div>
            <div className="UserActionButton">
                <button>
                    Submit
                </button>
            </div>
        </div>
    );
}
