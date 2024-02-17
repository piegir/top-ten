import "./player_propositions.css"

import React, {Component} from "react";
import {getPlayerPropositions} from "./proposition_making.js"
import {getRoundPlayers} from "./rounds";
import {currentUser} from "../authentication/authentication";
import {getColorFromScale, makeGetCall, makePostCall, repeat} from "../common/common";

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

    state = {
        propositions: [],
        hypothesis: [],
    };

    componentDidMount() {
        checkRoundComplete().then((complete) => {
            if (complete) {
                this.props.goToRoundResultsCheckingHandler();
                return;
            }
            getPlayerPropositions().then((playerPropositions) => {
                setTemporaryHypothesis(playerPropositions).then(() => {
                    this.setState({propositions: [...playerPropositions], hypothesis: [...playerPropositions]});
                });
            });
        });
    }

    lower = (index) => {
        [this.state.hypothesis[index + 1], this.state.hypothesis[index]] = [this.state.hypothesis[index], this.state.hypothesis[index + 1]];
        this.setState({propositions: this.state.propositions, hypothesis: this.state.hypothesis})
        setTemporaryHypothesis(this.state.hypothesis).then();
    };

    raise = (index) => {
        [this.state.hypothesis[index - 1], this.state.hypothesis[index]] = [this.state.hypothesis[index], this.state.hypothesis[index - 1]];
        this.setState({propositions: this.state.propositions, hypothesis: this.state.hypothesis})
        setTemporaryHypothesis(this.state.hypothesis).then();
    };

    row;

    dragStarted = (event) => {
        this.row = event.target;
    }

    dragOver = (event) => {
        let children = Array.from(event.target.parentNode.parentNode.children);
        let beforeIndex = children.indexOf(this.row);
        let afterIndex = children.indexOf(event.target.parentNode);
        if (afterIndex > beforeIndex) {
            for (let index = beforeIndex - 1; index < afterIndex - 1; ++index) {
                this.lower(index);
                event.target.parentNode.after(this.row);
            }
        } else if (afterIndex < beforeIndex) {
            for (let index = beforeIndex - 1; index > afterIndex - 1; --index) {
                this.raise(index);
                event.target.parentNode.before(this.row);
            }
        }
    }

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
                    Make your hypothesis by dragging rows
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
                    {this.state.propositions.map((proposition) => {
                        let propHypIndex = this.state.hypothesis.indexOf(proposition);
                        return (
                                <tr draggable={true}
                                    onDragStart={this.dragStarted}
                                    onDragOver={this.dragOver}
                                    style={{
                                        cursor: "all-scroll",
                                        "background-color": getColorFromScale({
                                            value: propHypIndex,
                                            minValue: 0,
                                            maxValue: this.state.propositions.length - 1,
                                            opacity: 0.5
                                        })
                                    }}>
                                    <td>
                                        {proposition.player}
                                    </td>
                                    <td>
                                        {proposition.proposition}
                                    </td>
                                </tr>
                        );
                    })}
                </table>
                <div className="ButtonBox">
                    <button onClick={this.makeHypothesisHandler}>
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

export class WaitHypothesisMade extends Component {

    state = {hypothesis: []};

    componentDidMount() {
        getPlayerPropositions().then((playerPropositions) => {
            this.setState({hypothesis: playerPropositions});
        });
    }

    checkHypothesisMade = () => {
        checkRoundComplete().then((complete) => {
            if (complete) {
                this.props.goToRoundResultsCheckingHandler();
                return;
            }
            getTemporaryHypothesis().then((hypothesis) => {
                this.setState({hypothesis: hypothesis});
                this.hypothesisMadeCheckingId = repeat(this.checkHypothesisMade, 100);
            });
        })
    };

    hypothesisMadeCheckingId = repeat(this.checkHypothesisMade, 100);

    componentWillUnmount() {
        clearTimeout(this.hypothesisMadeCheckingId);
    }

    render() {
        return (
            <div className="UserActionBox">
                <div className="SubTitle">
                    {this.props.firstRoundPlayer} is making a hypothesis...
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
                    {this.state.hypothesis.map((proposition, index) => {
                        return  (
                                <tr style={{
                                    "background-color": getColorFromScale({
                                        value: index,
                                        minValue: 0,
                                        maxValue: this.state.hypothesis.length - 1,
                                        opacity: 0.5
                                    })
                                }}>
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
        );
    }
}
