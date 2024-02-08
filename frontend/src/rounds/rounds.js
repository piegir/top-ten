import './rounds.css';
import {Component} from "react";
import {currentUser} from "../authentication/authentication.js"

let userNumbers = {
    "Player1": 5,
    "Player2": 10,
    "Player3": 2,
    "Player4": 8,
};
let playersList = [
    "Player1",
    "Player2",
    "Player3",
    "Player4"
]
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
let currentTheme = themes[0];
let playerPropositions = {
    "Player1": "My Neighbor",
    "Player2": "Hitler",
    "Player3": "Martin Luther King",
    "Player4": "Donald Trump",
};

let hypothesis = {
    "Player3": "Martin Luther King",
    "Player1": "My Neighbor",
    "Player4": "Donald Trump",
    "Player2": "Hitler",
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

export function PlayerPropositions() {
    return (
        <div className="PlayersBox">
            <div className="BoxTitle">
                Player Propositions
            </div>
            <table className="PlayerPropositionsTable">
                <tr>
                    <th>
                        Players
                    </th>
                    <th>
                        Propositions
                    </th>
                </tr>
                {playersList.map((playerName) => {
                    return (
                        <tr>
                            <td>
                                {playerName}
                            </td>
                            <td>
                                {playerPropositions[playerName]}
                            </td>
                        </tr>
                    )
                })}
            </table>
        </div>
    );
}

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

export function PlayerNumberedPropositions() {
    let sortedPlayersList = [...playersList];
    sortedPlayersList.sort((a, b) => {
        return userNumbers[a] > userNumbers[b] ? 1 : -1;
    })
    return (
        <div className="PlayersBox">
            <div className="BoxTitle">
                Reality
            </div>
            <table className="PlayerPropositionsTable">
                <tr>
                    <th>
                        Players
                    </th>
                    <th>
                        Numbers
                    </th>
                    <th>
                        Propositions
                    </th>
                </tr>
                {sortedPlayersList.map((playerName) => {
                    return (
                        <tr>
                            <td>
                                {playerName}
                            </td>
                            <td>
                                {userNumbers[playerName]}
                            </td>
                            <td>
                                {playerPropositions[playerName]}
                            </td>
                        </tr>
                    )
                })}
            </table>
        </div>
    );
}

export class SelectTheme extends Component {
    render () {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Select Theme
                </div>
                <table className="ThemesTable">
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
                                    <button onClick={this.props.handler}>
                                        Select theme {themeIndex + 1}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
}

export class MakeProposition extends Component {
    render () {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
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
                <div className="UserActionButtonBox">
                    <button onClick={this.props.handler} className="UserActionButton">
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

export class MakeHypothesis extends Component {
    render () {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Make Hypothesis
                </div>
                <table className="PlayerPropositionsTable">
                    <tr>
                        <th>
                        </th>
                        <th>
                            Players
                        </th>
                        <th>
                            Propositions
                        </th>
                    </tr>
                    {Object.entries(hypothesis).map(([playerName, proposition]) => {
                        return (
                            <tr>
                                <td>
                                    <button>
                                        ^
                                    </button>
                                    <button>
                                        v
                                    </button>
                                </td>
                                <td>
                                    {playerName}
                                </td>
                                <td>
                                    {proposition}
                                </td>
                            </tr>
                        )
                    })}
                </table>
                <div className="UserActionButtonBox">
                    <button onClick={this.props.handler} className="UserActionButton">
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

export class CheckResults extends Component {
    render () {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Hypothesis
                </div>
                <div>
                    <table className="PlayerPropositionsTable">
                        <tr>
                            <th>
                                Players
                            </th>
                            <th>
                                Propositions
                            </th>
                        </tr>
                        {Object.entries(hypothesis).map(([playerName, proposition]) => {
                            return (
                                <tr>
                                    <td>
                                        {playerName}
                                    </td>
                                    <td>
                                        {proposition}
                                    </td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
                <div className="UserActionButtonBox">
                    <button onClick={this.props.handler} className="UserActionButton">
                        Start a new round
                    </button>
                </div>
            </div>
        );
    }
}
