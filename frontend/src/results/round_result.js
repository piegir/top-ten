import "./player_top_table.css"

import React, {Component} from "react";
import {getRoundPlayers} from "../rounds/rounds.js";
import {currentUser} from "../authentication/authentication";
import {colors, getColorFromScale, makeGetCall, makePostCall} from "../common/common";

function checkGameComplete() {
    return makeGetCall("/game/is_game_complete");
}


export class RoundResult extends Component {
    render() {
        return (
            <div className="Result">
                <p className="ResultText" style={{color: getColorFromScale(this.props.result * 100, 0, 100, colors.red, colors.darkGreen)}}>
                    Round Result: {this.props.result * 100}%
                </p>
            </div>
        );
    }
}

export class Reality extends Component {
    render() {
        return (
            <div className="PlayersBox">
                <div className="SubTitle">
                    Reality
                </div>
                <table className="PlayerTopTable">
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
                                <tr style={{color: getColorFromScale(numberedProposition.number, 1, 10)}}>
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

    state = {
        gameComplete: null,
        isFirstPlayer: false
    };

    componentDidMount() {
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
                <div className="SubTitle">
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
                    <div className="ButtonBox">
                        <button onClick={this.props.goToGameResultsCheckingHandler} className="UserActionButton">
                            View game results
                        </button>
                    </div> :
                    this.state.isFirstPlayer ?
                        <div className="ButtonBox">
                            <button onClick={this.roundStartingHandler} className="UserActionButton">
                                Start a new round
                            </button>
                        </div> :
                        null}
            </div>
        );
    }
}
