import './game.css';
import React from "react";

export function GameSetup() {
    let gameOptions = {
        "Number of rounds": 7,
        "Number of themes per card": 3,
    }

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
