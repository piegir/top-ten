import './game.css';
import React from "react";


let gameOptions = {
    "Number of rounds": 7,
    "Number of themes per card": 3,
}

export let roundStarted = true;

let roundHistory = [
    1,
    2,
    1,
    0,
    null,
    null,
    null,
];

export function GameSetup() {
    return (
        <div className="UserActionBox">
            <div className="UserActionTitle">
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
            <div className="UserActionButton">
                <button>
                    Start Game
                </button>
            </div>
        </div>
    );
}

export function StartRound() {
    return (
        <div className="UserActionBox">
            <div className="UserActionTitle">
                Start Round
            </div>
            <div className="UserActionButton">
                <button>
                    Start Round
                </button>
            </div>
        </div>
    );
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
