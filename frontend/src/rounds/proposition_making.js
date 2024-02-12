import {currentUser} from "../authentication/authentication";
import React, {Component} from "react";
import {makeGetCall, makePostCall} from "../common/common";


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

function getUserNumber() {
    return makeGetCall("/rounds/get_number");
}

function setPlayerProposition(proposition) {
    return makePostCall("/rounds/set_player_proposition", {proposition: proposition});
}

function getPlayerPropositions() {
    return makeGetCall("/rounds/get_player_propositions");
}

export class CurrentUserNumber extends Component {

    constructor(props) {
        super(props);
        getUserNumber().then((topNumber) => {
            this.setState({topNumber: topNumber});
        });
    }

    state = {topNumber: null};

    render () {
        return (
            <div className="CurrentUserNumber">
                <p>
                    Your Top Number:<br/>
                    {this.state.topNumber}
                </p>
            </div>
        )
    }
}

export class PlayerPropositions extends Component {

    state = {playerPropositions: []};

    isPlayerTurnCheckingId = setInterval(() => {
        getPlayerPropositions().then((playerPropositions) => {
            this.setState({playerPropositions: playerPropositions});
        });
    }, 1000);

    componentWillUnmount() {
        clearInterval(this.isPlayerTurnCheckingId);
    }

    render () {
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
                    {this.state.playerPropositions.map((playerProposition) => {
                        return (
                            <tr>
                                <td>
                                    {playerProposition.player}
                                </td>
                                <td>
                                    {playerProposition.proposition}
                                </td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        );
    }
}

export class MakeProposition extends Component {

    state = {proposition: null}

    liveUpdateProposition = (event) => {
        this.setState({proposition: event.target.value});
    }

    makePropositionHandler = () => {
        setPlayerProposition(this.state.proposition).then((success) => {
            if (success.status) {
                this.props.goToHypothesisMakingHandler();
            }
            else {
                alert(success.message);
            }
        });
    }

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
                        <textarea onChange={this.liveUpdateProposition} name="Text1" cols="40" rows="5"></textarea>
                    </div>
                </div>
                <div className="UserActionButtonBox">
                    <button onClick={this.makePropositionHandler} className="UserActionButton">
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}
