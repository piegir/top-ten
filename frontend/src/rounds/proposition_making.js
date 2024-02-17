import "./player_propositions.css"

import React, {Component} from "react";
import {getColorFromScale, makeGetCall, makePostCall, repeat} from "../common/common";

function getUserNumber() {
    return makeGetCall("/rounds/get_number");
}

function setPlayerProposition(proposition) {
    return makePostCall("/rounds/set_player_proposition", {proposition: proposition});
}

export function getPlayerPropositions() {
    return makeGetCall("/rounds/get_player_propositions");
}

export class CurrentUserNumber extends Component {

    state = {topNumber: null};

    componentDidMount() {
        getUserNumber().then((topNumber) => {
            this.setState({topNumber: topNumber});
        });
    }

    render () {
        return (
            <div>
                <p className="ShowCurrentUserNumber">
                    Your Top Number:<br/>
                    <span className="CurrentUserNumber" style={{color: getColorFromScale(this.state.topNumber, 1, 10)}}>
                        {this.state.topNumber}
                    </span>
                </p>
            </div>
        )
    }
}

export class PlayerPropositions extends Component {

    state = {playerPropositions: []};

    checkPlayerTurn = () => {
        getPlayerPropositions().then((playerPropositions) => {
            this.setState({playerPropositions: playerPropositions});
            if (!this.props.checkOnlyOnce) {
                this.isPlayerTurnCheckingId = repeat(this.checkPlayerTurn, 100);
            }
        });
    }

    isPlayerTurnCheckingId = repeat(this.checkPlayerTurn, 100);

    componentWillUnmount() {
        clearTimeout(this.isPlayerTurnCheckingId);
    }

    render () {
        return (
            <div className="PlayersBox">
                <div className="SubTitle">
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
            if (!success.status) {
                alert(success.message);
            }
        });
    }

    render() {
        return (
            <div className="UserActionBox">
                <div className="SubTitle">
                    Make your proposition
                </div>
                <div className="PropositionMaking">
                <textarea autoFocus={true} onChange={this.liveUpdateProposition} cols="50" rows="7"></textarea>
                </div>
                <div className="ButtonBox">
                    <button onClick={this.makePropositionHandler} className="UserActionButton">
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

export class WaitPropositionMade extends Component {
    render() {
        return (
            <div className="UserActionBox">
                <div className="SubTitle">
                    Waiting for {this.props.currentPlayer} to make a proposition...
                </div>
            </div>
        );
    }
}
