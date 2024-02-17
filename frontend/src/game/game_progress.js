import "./game_progress.css"

import {Component} from "react";
import {getGameOptionsFromConfig} from "./game_start";
import {colors, getColorFromScale, makeGetCall} from "../common/common";


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
    inProgress: -1,
}

export class GameProgress extends Component {

    state = {roundsHistory: []};

    componentDidMount() {
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
                                default:
                                    let roundResult = Math.round(roundStatus * 1000) / 10; // XX.X%
                                    return (
                                        <td style={{color: getColorFromScale({value: roundResult, beginColor: colors.red, endColor: colors.darkGreen})}}>
                                            {roundResult}%
                                        </td>
                                    );
                            }
                        })}
                    </tr>
                </table>
            </div>
        )
    }
}
