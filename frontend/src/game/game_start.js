import {Component} from "react";
import {makeGetCall, makePostCall} from "../common/common";
import {getConnectedUsers} from "../authentication/users";
import {currentUser} from "../authentication/authentication";


function createGameConfigFromOptions(gameOptions) {
    return getConnectedUsers().then((playersList) => {
        return {
            "players_list": playersList,
            "max_nb_rounds": gameOptions["Number of rounds"],
            "starting_player_index": gameOptions["Starting Player Index"],
            "nb_themes_per_card": gameOptions["Number of themes per card"],
        };
    });
}

function getGameOptionsFromConfig(gameConfig) {
    return {
        "Number of rounds": gameConfig["max_nb_rounds"],
        "Starting Player Index": gameConfig["starting_player_index"],
        "Number of themes per card": gameConfig["nb_themes_per_card"],
    };
}

function setGameConfig(gameOptions) {
    return createGameConfigFromOptions(gameOptions).then((gameConfig) => {
        return makePostCall("/game/set_config", gameConfig);
    });
}

export function getGameOptions() {
    return makeGetCall("/game/get_config").then((gameConfig) => {
        return getGameOptionsFromConfig(gameConfig);
    });
}

function startGame(gameOptions) {
    return createGameConfigFromOptions(gameOptions).then((gameConfig) => {
        return makePostCall("/game/start", gameConfig);
    });
}

function isGameStarted() {
    return makeGetCall("/game/is_started");
}


export class GameSetup extends Component {
    constructor(props) {
        super(props);
        setGameConfig(this.state.gameOptions)
            .then(() => {
                this.setState({
                    gameOptions: this.state.gameOptions,
                    gameStarted: this.state.gameStarted,
                    isFirstPlayer: this.state.isFirstPlayer,
                    areOptionsSet: true,
                });
            }
        );
    }

    state = {
        gameOptions: {
            "Number of rounds": 7,
            "Number of themes per card": 3,
            "Starting Player Index": 0,
        },
        gameStarted: false,
        isFirstPlayer: false,
        areOptionsSet: false,
    };

    /**
     * Repeatedly check for multiple things regarding the game:
     * - Checks if the game has already been started, if yes, switch to round starting view
     * - Checks if the current user is the first game user, i.e. if he can edit the game options
     * - Does the live visual update of options for other users
     * @type {number}
     */
    gameCheckingId = setInterval(() => {
        isGameStarted().then((gameStarted) => {
            if (gameStarted) {
                this.props.goToRoundStartingHandler();
                return;
            }
            getConnectedUsers().then((playersList) => {
                let isFirstPlayer = currentUser.username === playersList[0];
                if (isFirstPlayer) {
                    this.setState({
                        gameOptions: this.state.gameOptions,
                        gameStarted: gameStarted,
                        isFirstPlayer: isFirstPlayer,
                        areOptionsSet: this.state.areOptionsSet,
                    });
                }
                else if (this.state.areOptionsSet) {
                    getGameOptions().then((gameOptions) => {
                        this.setState({
                            gameOptions: gameOptions,
                            gameStarted: gameStarted,
                            isFirstPlayer: isFirstPlayer,
                            areOptionsSet: this.state.areOptionsSet,
                        });
                    });
                }
            });
        })
    }, 1000, []);

    componentWillUnmount() {
        clearInterval(this.gameCheckingId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.isFirstPlayer && this.state.gameOptions !== prevState.gameOptions) {
            setGameConfig(this.state.gameOptions).then();
        }
    }

    liveUpdateNumberOfRounds = (event) => {
        this.setState({
            gameOptions: {
                "Number of rounds": event.target.value,
                "Number of themes per card": this.state.gameOptions["Number of themes per card"],
                "Starting Player Index": this.state.gameOptions["Starting Player Index"],
            },
            gameStarted: this.state.gameStarted,
            isFirstPlayer: this.state.isFirstPlayer,
            areOptionsSet: this.state.areOptionsSet,
        });
    }

    liveUpdateNumberOfThemesPerCard = (event) => {
        this.setState({
            gameOptions: {
                "Number of rounds": this.state.gameOptions["Number of rounds"],
                "Number of themes per card": event.target.value,
                "Starting Player Index": this.state.gameOptions["Starting Player Index"],
            },
            gameStarted: this.state.gameStarted,
            isFirstPlayer: this.state.isFirstPlayer,
            areOptionsSet: this.state.areOptionsSet,
        });
    }

    liveUpdateStartingPlayerIndex = (event) => {
        this.setState({
            gameOptions: {
                "Number of rounds": this.state.gameOptions["Number of rounds"],
                "Number of themes per card": this.state.gameOptions["Number of themes per card"],
                "Starting Player Index": event.target.value,
            },
            gameStarted: this.state.gameStarted,
            isFirstPlayer: this.state.isFirstPlayer,
            areOptionsSet: this.state.areOptionsSet,
        });
    }

    optionsCallbacks = {
        "Number of rounds": this.liveUpdateNumberOfRounds,
        "Number of themes per card": this.liveUpdateNumberOfThemesPerCard,
        "Starting Player Index": this.liveUpdateStartingPlayerIndex,
    }

    startGameHandler = () => {
        startGame(this.state.gameOptions).then((startGameSuccess) => {
            if (startGameSuccess.status) {
                alert(startGameSuccess.message);
                this.props.goToRoundStartingHandler();
            } else {
                alert(startGameSuccess.message);
            }
        });
    }

    render() {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Game Preparation
                </div>
                <div>
                    {Object.keys(this.optionsCallbacks).map((optionName) => {
                        return (
                            <div className="UserActionInput">
                                <div className="UserActionInputOption">
                                    {optionName}:
                                </div>
                                <div className="UserActionInputField">
                                    {this.state.isFirstPlayer ? <input
                                        type="text"
                                        value={this.state.gameOptions[optionName]}
                                        className="NumberInput"
                                        onChange={this.optionsCallbacks[optionName]}
                                    /> : this.state.gameOptions[optionName]}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {this.state.isFirstPlayer ? <div className="UserActionButtonBox">
                    <button onClick={this.startGameHandler}
                            className="UserActionButton">
                        Start Game
                    </button>
                </div> : null}
            </div>
        );
    }
}
