import "./game_progress.css"

import {Component} from "react";

import {colors, getColorFromScale, makeGetCall} from "../common/common";

import {getGameOptionsFromConfig} from "./game_start";

function getRoundsHistory() { return makeGetCall("/game/get_rounds_history"); }

function getGameOptions() {
  return makeGetCall("/game/get_config")
      .then((gameConfig) => { return getGameOptionsFromConfig(gameConfig); });
}

let status = {
  notStarted : null,
  inProgress : -1,
}

function displayRoundPercentage(rawResult) {
  switch (rawResult) {
  case status.notStarted:
    return (
        <td>

        </td>
            );
        case status.inProgress:
            return (
                <td>
                    ?
                </td>);
  default:
    let roundResult = Math.round(rawResult * 1000) / 10; // XX.X%
    return (
        <td style = {
          {
            color: getColorFromScale({
              value : roundResult,
              beginColor : colors.red,
              endColor : colors.darkGreen,
              middleColor : colors.gold
            })
          }
        }>{roundResult} %
            </td>
            );
    }
}


export class GameProgress extends Component {

    state = {roundsHistory: []};

    componentDidMount() {
        getGameOptions().then((gameOptions) => {
            let newRoundsHistory = Array(gameOptions["Number of rounds"]).fill({
                result: null,
                capten: null,
                theme: null,
            });
            getRoundsHistory().then((roundsHistory) => {
                for (let roundIndex in roundsHistory) {
                    newRoundsHistory[roundIndex] = roundsHistory[roundIndex];
                }
                this.setState({roundsHistory: newRoundsHistory});
            })

        })
    }

    render() {
        return (
            <div>
                <table className="GameProgress">
                    <tr>
                        <td>
                            Round
                        </td>{
                this.state.roundsHistory.map(
                    (roundSummary, roundIndex) => {return (
                        <td>{
                            roundIndex + 1} < /td>
                            )
                        })}
                    </tr > <tr><td>Cap'Ten </td>
                        {this.state.roundsHistory.map((roundSummary) => {
                            return (
                                <td>
                                    {roundSummary.capten}
                                </td>)})} <
        /tr>
                    <tr>
                        <td>
                            Status
                        </td >
        {this.state.roundsHistory.map((roundSummary) => {
          return displayRoundPercentage(roundSummary.result);
        })} < /tr>
                </table >
        </div>
        )
    }
}


export class GameSummary extends GameProgress {

    render() {
        return (
            <div>
                <table className="GameProgress">
                    <tr>
                        <td>
                            Round
                        </td>
        <td>Cap'Ten <
            /td>
                        <td>
                            Theme
                        </td>
        <td>Status</td>
                    </tr>{this.state.roundsHistory.map(
            (roundSummary, roundIndex) => {return (
                <tr><td>{roundIndex + 1} <
                /td>
                                <td>
                                    {roundSummary.capten}
                                </td >
                <td>{roundSummary.theme.title} <
                /td>
                                {displayRoundPercentage(roundSummary.result)}
                            </tr >)})} <
        /table>
            </div >)
  }
}
