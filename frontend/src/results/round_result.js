import "./player_top_table.css"

import {Component} from "react";

import {currentUser} from "../authentication/authentication";
import {
  colors,
  getColorFromScale,
  makeGetCall,
  makePostCall
} from "../common/common";
import {getRoundPlayers} from "../rounds/rounds.js";

function checkGameComplete() { return makeGetCall("/game/is_game_complete"); }

export class RoundResult extends Component {
  roundResult = Math.round(+this.props.result * 1000) / 10; // XX.X%
  render() {
        return (
            <div className="Result">
                <p className="ResultText"
                   style={{
      color: getColorFromScale({
        value : this.roundResult,
        beginColor : colors.red,
        endColor : colors.darkGreen,
        middleColor : colors.gold
      })}}>
                    Round Result: {this.roundResult}%
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
                                <tr style={{"background-color": getColorFromScale({value: numberedProposition.number, minValue: 1, maxValue: 10, opacity: 0.5})}}>
                                    <td>
                                        {numberedProposition["player_proposition"].player}
                                    </td>
                                    <td style={{
      textAlign: "center"}}>
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
        } else { alert(startSuccess.message); }
  });
}

render() {
  return (<div className = "UserActionBox"><div className = "SubTitle">Hypothesis</div>
                <div>
                    <table className="PlayerTopTable">
                        <tr>
                            <th>
                                Players
                            </th><th>Top<
              /th>
                            <th>
                                Propositions
                            </th></tr>
                        {((this.props.hypothesis !== null) && (this.props.reality !== null)) ?
                            this.props.hypothesis.map((proposition, index) => {
                                let thisNumber = this.props.reality[this.props.reality.findIndex(numberedProposition => numberedProposition["player_proposition"].player === proposition.player)].number;
                                return (
                                    <tr style={{"background-color": getColorFromScale({value: thisNumber, minValue: 1, maxValue: 10, opacity: 0.5})}}>
                                        <td>
                                            {proposition.player}
                                        </td><
              td style = {{ textAlign: "center" }}>{
              thisNumber} < /td>
                                        <td>
                                            {proposition.proposition}
                                        </td > </tr>
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
          </div>
                    :
                    this.state.isFirstPlayer ?
                        <div className="ButtonBox">
                            <button onClick={this.roundStartingHandler} className="UserActionButton">
                                Start a new round
                            </button>
          </div>
                        :
                        null}
            </div>);
}
}
