import {currentUser} from "../authentication/authentication";
import React, {Component} from "react";


export let playersList = [
    "Player1",
    "Player2",
    "Player3",
    "Player4"
]
export let playerPropositions = {
    "Player1": "My Neighbor",
    "Player2": "Hitler",
    "Player3": "Martin Luther King",
    "Player4": "Donald Trump",
};
export let userNumbers = {
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

export class MakeProposition extends Component {
    render() {
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
