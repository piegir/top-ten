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
        hypothesis: [],
        firstPlayer: null,
    };

    componentDidMount() {
        getPlayerPropositions().then((playerPropositions) => {
            getRoundPlayers().then((currentPlayers) => {
                this.setState({hypothesis: playerPropositions, firstPlayer: currentPlayers[0]});
                if (currentPlayers[0] === currentUser.username) {
                    setTemporaryHypothesis(playerPropositions).then();
                }
            });
        });
    }

    checkHypothesisMade = () => {
        checkRoundComplete().then((complete) => {
            if (complete) {
                this.props.goToRoundResultsCheckingHandler();
                return;
            }
            if (this.state.firstPlayer !== currentUser.username) {
                getTemporaryHypothesis().then((hypothesis) => {
                    this.setState({hypothesis: hypothesis, firstPlayer: this.state.firstPlayer});
                    this.hypothesisMadeCheckingId = repeat(this.checkHypothesisMade, 100);
                })
            } else {
                this.hypothesisMadeCheckingId = repeat(this.checkHypothesisMade, 100);
            }
        })
    };

    hypothesisMadeCheckingId = repeat(this.checkHypothesisMade, 100);

    componentWillUnmount() {
        clearTimeout(this.hypothesisMadeCheckingId);
    }

    lower = (index) => {
        [this.state.hypothesis[index + 1], this.state.hypothesis[index]] = [this.state.hypothesis[index], this.state.hypothesis[index + 1]];
        setTemporaryHypothesis(this.state.hypothesis).then();
    };

    raise = (index) => {
        [this.state.hypothesis[index - 1], this.state.hypothesis[index]] = [this.state.hypothesis[index], this.state.hypothesis[index - 1]];
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
                    {this.state.firstPlayer === currentUser.username ?
                        <>Make your hypothesis by dragging rows</> :
                        <>{this.state.firstPlayer} is making a hypothesis...</>}
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
                        return this.state.firstPlayer === currentUser.username ?
                            (
                                <tr draggable={true}
                                    onDragStart={this.dragStarted}
                                    onDragOver={this.dragOver}
                                    style={{cursor: "all-scroll"}}>
                                    <td>
                                        {proposition.player}
                                    </td>
                                    <td>
                                        {proposition.proposition}
                                    </td>
                                </tr>)
                            :
                            (
                                <tr style={{"background-color": getColorFromScale({value: index, minValue: 0, maxValue: this.state.hypothesis.length - 1, opacity: 0.5})}}>
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
                {this.state.firstPlayer === currentUser.username ?
                    <div className="ButtonBox">
                        <button onClick={this.makeHypothesisHandler}>
                            Submit
                        </button>
                    </div> : null}
            </div>
        );
    }
}
