import "./hypothesis_table.css"

import React, {Component} from "react";
import {getPlayerPropositions} from "./proposition_making.js"
import {getRoundPlayers} from "./rounds";
import {currentUser} from "../authentication/authentication";
import {makeGetCall, makePostCall} from "../common/common";

function makeHypothesis(hypothesis) {
    return makePostCall("/rounds/make_hypothesis", hypothesis);
}

function checkRoundComplete() {
    return makeGetCall("/rounds/check_round_complete");
}

function setTemporaryHypothesis(hypothesis) {
    return makePostCall("/rounds/set_hypothesis", hypothesis);
}

export function getTemporaryHypothesis() {
    return makeGetCall("/rounds/get_hypothesis");
}

export class MakeHypothesis extends Component {

    constructor(props) {
        super(props);
        getPlayerPropositions().then((playerPropositions) => {
            getRoundPlayers().then((currentPlayers) => {
                setTemporaryHypothesis(playerPropositions).then(() => {
                    this.setState({hypothesis: playerPropositions, firstPlayer: currentPlayers[0]});
                });
            });
        });
    }

    state = {
        hypothesis: [{player: null, proposition: null,},],
        firstPlayer: null,
    };

    checkHypothesisMade = () => {
        checkRoundComplete().then((complete) => {
            if (complete) {
                this.props.goToRoundResultsCheckingHandler();
                return;
            }
            if (this.state.firstPlayer !== currentUser.username) {
                getTemporaryHypothesis().then((hypothesis) => {
                    this.setState({hypothesis: hypothesis, firstPlayer: this.state.firstPlayer});
                    this.hypothesisMadeCheckingId = setTimeout(this.checkHypothesisMade, 100);
                })
            }
            else {
                this.hypothesisMadeCheckingId = setTimeout(this.checkHypothesisMade, 100);
            }
        })
    };

    hypothesisMadeCheckingId = setTimeout(this.checkHypothesisMade, 100);

    componentWillUnmount() {
        clearTimeout(this.hypothesisMadeCheckingId);
    }

    raise = (index) => {
        let newHypothesis = this.state.hypothesis;
        [newHypothesis[index - 1], newHypothesis[index]] = [newHypothesis[index], newHypothesis[index - 1]];
        this.setState({hypothesis: newHypothesis, firstPlayer: this.state.firstPlayer});
        setTemporaryHypothesis(newHypothesis).then();
    };

    lower = (index) => {
        let newHypothesis = this.state.hypothesis;
        [newHypothesis[index + 1], newHypothesis[index]] = [newHypothesis[index], newHypothesis[index + 1]];
        this.setState({hypothesis: newHypothesis, firstPlayer: this.state.firstPlayer});
        setTemporaryHypothesis(newHypothesis).then();
    };

    makeHypothesisHandler = () => {
        makeHypothesis(this.state.hypothesis).then((success) => {
            if (success.status) {
                this.props.goToRoundResultsCheckingHandler();
            } else {
                alert(success.message);
            }
        });
    }


    render() {
        return (
            <div className="UserActionBox">
                <div className="SubTitle">
                    {this.state.firstPlayer === currentUser.username ?
                        <>Make your hypothesis</> :
                        <>{this.state.firstPlayer} is making a hypothesis...</>}
                </div>
                <table className="HypothesisTable">
                    <tr>
                        {this.state.firstPlayer === currentUser.username ? <th></th> : null}
                        <th>
                            Players
                        </th>
                        <th>
                            Propositions
                        </th>
                    </tr>
                    {this.state.hypothesis.map((proposition, index) => {
                        return (
                            <tr>
                                {this.state.firstPlayer === currentUser.username ?
                                    <td className="ButtonsInTable">
                                        <div className="UpDownButtons">
                                            {index > 0 ? <button onClick={() => {
                                                this.raise(index)
                                            }} className="UpButton">
                                                ^
                                            </button> : null}
                                            {index < this.state.hypothesis.length - 1 ? <button onClick={() => {
                                                this.lower(index)
                                            }} className="DownButton">
                                                v
                                            </button> : null}
                                        </div>
                                    </td> : null}
                                <td className="PlayerColumn">
                                    {proposition.player}
                                </td>
                                <td>
                                    {proposition.proposition}
                                </td>
                            </tr>
                        )
                    })}
                </table>
                {this.state.firstPlayer === currentUser.username ?
                    <div className="UserActionButtonBox">
                        <button onClick={this.makeHypothesisHandler} className="UserActionButton">
                            Submit
                        </button>
                    </div> : null}
            </div>
        );
    }
}
