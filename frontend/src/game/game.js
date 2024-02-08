import './game.css';
import {Component} from "react";

let gameOptions = {
    "Number of rounds": 7,
    "Number of themes per card": 3,
}
let roundHistory = [
    1,
    2,
    1,
    0,
    null,
    null,
    null,
];
export let roundStarted = true;

export class GameSetup extends Component {
    render () {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Game Preparation
                </div>
                <div>
                    {Object.entries(gameOptions).map(([optionName, optionValue]) => {
                        return (
                            <div className="UserActionInput">
                                <div className="UserActionInputOption">
                                    {optionName}:
                                </div>
                                <div className="UserActionInputField">
                                    <input
                                        type="text"
                                        value={optionValue}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="UserActionButtonBox">
                    <button onClick={this.props.handler} className="UserActionButton">
                        Start Game
                    </button>
                </div>
            </div>
        );
    }
}

export class StartRound extends Component {
    render () {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Ready to start the round?
                </div>
                <div className="UserActionButtonBox">
                    <button onClick={this.props.handler} className="UserActionButton">
                        Start Round
                    </button>
                </div>
            </div>
        );
    }
}

export function GameProgress() {
    return (
        <div className="GameProgress">
            <table>
                <tr>
                    <td>
                        Round
                    </td>
                    {roundHistory.map((roundStatus, roundIndex) => {
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
                    {roundHistory.map((roundStatus, roundIndex) => {
                        switch (roundStatus) {
                            case null:
                                return (
                                    <td>

                                    </td>
                                );
                            case 0:
                                return (
                                    <td>
                                        ?
                                    </td>
                                );
                            case 1:
                                return (
                                    <td style={{color: "green"}}>
                                        W
                                    </td>
                                );
                            case 2:
                                return (
                                    <td style={{color: "red"}}>
                                        L
                                    </td>
                                );

                        }
                    })}
                </tr>
            </table>
        </div>
    )

}
