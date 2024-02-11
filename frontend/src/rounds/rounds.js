import './rounds.css';
import React, {Component} from "react";
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
        theme: "A person who is always but really always tired",
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
    "Player1": "My Neighbor is bds dsgafe afbgsbakjdca fdgrshgaez dsfghgtsasrg ghdrxadefrgs",
    "Player2": "Hitler",
    "Player3": "Martin Luther King",
    "Player4": "Donald Trump",
};

let hypothesis = [];

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
        <div>
            <table className="CurrentTheme">
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
                        Top
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
                            <td style={{textAlign:"center"}}>
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
    render() {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Select a theme
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
                                    <button className="LogoutButton" onClick={this.props.themeSelectedHandler}>
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
    render() {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Make your proposition
                </div>
                <div className="UserActionInput">
                    <div className="UserActionInputOption">
                        Your proposition:
                    </div>
                    <div className="UserActionInputField">
                        <textarea name="Text1" cols="40" rows="5"></textarea>
                    </div>
                </div>
                <div className="UserActionButtonBox">
                    <button onClick={this.props.propositionMadeHandler} className="UserActionButton">
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

export class MakeHypothesis extends Component {

    state = {data: [
        {
            player: "Player1",
            proposition: "My Neighbor",
        },
        {
            player: "Player2",
            proposition: "Hitler",
        },
        {
            player: "Player3",
            proposition: "Martin Luther King",
        },
        {
            player: "Player4",
            proposition: "Donald Trump",
        },
    ]};


    raise = (index) => {
        let newHypothesis = [...this.state.data];
        [newHypothesis[index-1], newHypothesis[index]] = [newHypothesis[index], newHypothesis[index-1]];
        this.setState({data: newHypothesis});
    };

    lower = (index) => {
        let newHypothesis = [...this.state.data];
        [newHypothesis[index+1], newHypothesis[index]] = [newHypothesis[index], newHypothesis[index+1]];
        this.setState({data: newHypothesis});
    };


    render() {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Make your hypothesis
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
                    {this.state.data.map((proposition, index) => {
                        return (
                            <tr>
                                <td>
                                    <div className="UpDownButtons">
                                        {index > 0 ? <button onClick={() => {
                                            this.raise(index)
                                        }} className="UpButton">
                                            ^
                                        </button> : null}
                                        {index < this.state.data.length - 1 ?<button onClick={() => {
                                            this.lower(index)
                                        }} className="DownButton">
                                            v
                                        </button> : null}
                                    </div>
                                </td>
                                <td>
                                    {proposition.player}
                                </td>
                                <td>
                                    {proposition.proposition}
                                </td>
                            </tr>
                        )
                    })}
                </table>
                <div className="UserActionButtonBox">
                    <button onClick={() => {
                        hypothesis = this.state.data;
                        this.props.hypothesisMadeHandler();
                    }} className="UserActionButton">
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

export class CheckResults extends Component {
    render() {
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
                        {hypothesis.map((proposition) => {
                            return (
                                <tr>
                                    <td>
                                        {proposition.player}
                                    </td>
                                    <td>
                                        {proposition.proposition}
                                    </td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
                <div className="UserActionButtonBox">
                    <button onClick={this.props.roundFinishedHandler} className="UserActionButton">
                        Start a new round
                    </button>
                </div>
            </div>
        );
    }
}
