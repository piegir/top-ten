import "./game_progress.css"

import {Component} from "react";
import {getGameOptionsFromConfig} from "./game_start";
import {makeGetCall} from "../common/common";


function getRoundsHistory() {
    return makeGetCall("/game/get_rounds_history");
}

function getGameOptions() {
    return makeGetCall("/game/get_config").then((gameConfig) => {
        return getGameOptionsFromConfig(gameConfig);
    });
}

let status = {
    notStarted: null,
    inProgress: 0,
    won: 1,
    lost: 2,
}

export class GameProgress extends Component {
    constructor(props) {
        super(props);
        getGameOptions().then((gameOptions) => {
            let newRoundsHistory = Array(gameOptions["Number of rounds"]).fill(null);
            getRoundsHistory().then((roundsHistory) => {
                for (let roundIndex in roundsHistory) {
                    newRoundsHistory[roundIndex] = roundsHistory[roundIndex];
                }
                this.setState({roundsHistory: newRoundsHistory});
            })

        })
    }
    state = {roundsHistory: []};

    render () {
        return (
            <div>
                <table className="GameProgress">
                    <tr>
                        <td>
                            Round
                        </td>
                        {this.state.roundsHistory.map((roundStatus, roundIndex) => {
                            return (
                                <td>
                                    {roundIndex + 1}
                                </td>
                            )
                        })}
                    </tr>
                    <tr>
                        <td>
                            Status
                        </td>
                        {this.state.roundsHistory.map((roundStatus) => {
                            switch (roundStatus) {
                                case status.notStarted:
                                    return (
                                        <td>

                                        </td>
                                    );
                                case status.inProgress:
                                    return (
                                        <td>
                                            ?
                                        </td>
                                    );
                                case status.won:
                                    return (
                                        <td style={{color: "green"}}>
                                            W
                                        </td>
                                    );
                                case status.lost:
                                    return (
                                        <td style={{color: "red"}}>
                                            L
                                        </td>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </tr>
                </table>
            </div>
        )
    }
}
