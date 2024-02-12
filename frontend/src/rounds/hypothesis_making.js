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
                let isFirstPlayer = currentUser.username === currentPlayers[0];
                setTemporaryHypothesis(playerPropositions).then(() => {
                    this.setState({hypothesis: playerPropositions, isFirstPlayer: isFirstPlayer});
                });
            });
        });
    }

    state = {
        hypothesis: [{player: null, proposition: null,},],
        isFirstPlayer: false,
    };

    hypothesisMadeCheckingId = setInterval(() => {
        checkRoundComplete().then((complete) => {
            if (complete) {
                this.props.goToRoundResultsCheckingHandler();
                return;
            }
            if (!this.state.isFirstPlayer) {
                getTemporaryHypothesis().then((hypothesis) => {
                    this.setState({hypothesis: hypothesis, isFirstPlayer: this.state.isFirstPlayer});
                })
            }
        })
    }, 1000, []);

    componentWillUnmount() {
        clearInterval(this.hypothesisMadeCheckingId);
    }

    raise = (index) => {
        let newHypothesis = this.state.hypothesis;
        [newHypothesis[index - 1], newHypothesis[index]] = [newHypothesis[index], newHypothesis[index - 1]];
        this.setState({hypothesis: newHypothesis, isFirstPlayer: this.state.isFirstPlayer});
        setTemporaryHypothesis(newHypothesis).then();
    };

    lower = (index) => {
        let newHypothesis = this.state.hypothesis;
        [newHypothesis[index + 1], newHypothesis[index]] = [newHypothesis[index], newHypothesis[index + 1]];
        this.setState({hypothesis: newHypothesis, isFirstPlayer: this.state.isFirstPlayer});
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
                <div className="BoxTitle">
                    Make your hypothesis
                </div>
                <table className="PlayerPropositionsTable">
                    <tr>
                        {this.state.isFirstPlayer ? <th></th> : null}
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
                                {this.state.isFirstPlayer ?
                                    <td>
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
                {this.state.isFirstPlayer ?
                    <div className="UserActionButtonBox">
                        <button onClick={this.makeHypothesisHandler} className="UserActionButton">
                            Submit
                        </button>
                    </div> : null}
            </div>
        );
    }
}
