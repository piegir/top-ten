import React, {Component} from "react";
import {getRoundPlayers} from "../rounds/rounds.js";
import {currentUser} from "../authentication/authentication";
import {makeGetCall, makePostCall} from "../common/common";

function checkGameComplete() {
    return makeGetCall("/game/is_game_complete");
}


export class RoundResult extends Component {
    render() {
        return (
            <div className="Result">
                {this.props.success !== null ?
                    this.props.success ?
                        <div>Round Won!!!</div> :
                        <div>Round Lost...</div> :
                    null}
            </div>
        );
    }
}

export class Reality extends Component {
    render() {
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
                    {this.props.reality !== null ?
                        this.props.reality.map((numberedProposition) => {
                            return (
                                <tr>
                                    <td>
                                        {numberedProposition["player_proposition"].player}
                                    </td>
                                    <td style={{textAlign: "center"}}>
                                        {numberedProposition.number}
                                    </td>
                                    <td>
                                        {numberedProposition["player_proposition"].proposition}
                                    </td>
                                </tr>
                            )
                        }) :
                        null}
                </table>
            </div>
        );
    }
}

export class Hypothesis extends Component {

    constructor(props) {
        super(props);
        checkGameComplete().then((gameComplete) => {
            getRoundPlayers().then((currentPlayers) => {
                this.setState(
                    {
                        gameComplete: gameComplete,
                        isFirstPlayer: currentUser.username === currentPlayers[0]
                    });
            });
        });
    }

    state = {
        gameComplete: null,
        isFirstPlayer: false
    };

    roundStartingHandler = () => {
        makePostCall("/game/start_new_round").then((startSuccess) => {
            if (startSuccess.status) {
                this.props.goToThemeSelectionHandler();
            } else {
                alert(startSuccess.message);
            }
        });
    }

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
                        {this.props.hypothesis !== null ?
                            this.props.hypothesis.map((proposition) => {
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
                            }) :
                            null}
                    </table>
                </div>
                {this.state.gameComplete ?
                    <div className="UserActionButtonBox">
                        <button onClick={this.props.goToGameResultsCheckingHandler} className="UserActionButton">
                            View game results
                        </button>
                    </div> :
                    this.state.isFirstPlayer ?
                        <div className="UserActionButtonBox">
                            <button onClick={this.roundStartingHandler} className="UserActionButton">
                                Start a new round
                            </button>
                        </div> :
                        null}
            </div>
        );
    }
}
