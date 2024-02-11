import React, {Component} from "react";
import {playersList, userNumbers, playerPropositions} from "./proposition_making.js"

let hypothesis = [];

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
                        this.props.goToResultsCheckingHandler();
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
                    <button onClick={this.props.goToRoundStartingHandler} className="UserActionButton">
                        Start a new round
                    </button>
                </div>
            </div>
        );
    }
}
