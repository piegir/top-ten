import {Component} from "react";
import {makeGetCall, makePostCall, repeat} from "../common/common";
import {getConnectedUsers} from "../authentication/users";
import {currentUser} from "../authentication/authentication";
import {getGamePlayers} from "./game";


function createGameConfigFromOptions(gameOptions) {
    return getConnectedUsers().then((usersList) => {
        return {
            "players_list": usersList,
            "max_nb_rounds": gameOptions["Number of rounds"],
            "starting_player_index": gameOptions["Starting Player Index"],
            "nb_themes_per_card": gameOptions["Number of themes per card"],
        };
    });
}

export function getGameOptionsFromConfig(gameConfig) {
    return {
        "Number of rounds": gameConfig["max_nb_rounds"],
        "Starting Player Index": gameConfig["starting_player_index"],
        "Number of themes per card": gameConfig["nb_themes_per_card"],
    };
}

function setTempGameConfig(gameOptions) {
    return createGameConfigFromOptions(gameOptions).then((gameConfig) => {
        return makePostCall("/game/set_temp_config", gameConfig);
    });
}

function getTempGameOptions() {
    return makeGetCall("/game/get_temp_config").then((gameConfig) => {
        return getGameOptionsFromConfig(gameConfig);
    });
}

function startGame(gameOptions) {
    return createGameConfigFromOptions(gameOptions).then((gameConfig) => {
        return makePostCall("/game/start", gameConfig).then((startGameSuccess) => {
            if (startGameSuccess.status) {
                return makePostCall("/game/start_new_round");
            } else {
                alert(startGameSuccess.message);
                return startGameSuccess;
            }
        });
    });
}

function isGameStarted() {
    return makeGetCall("/game/is_started");
}

function isGameComplete() {
    return makeGetCall("/game/is_game_complete");
}


export class GameSetup extends Component {

    state = {
        gameOptions: {
            "Number of rounds": 7,
            "Number of themes per card": 3,
            "Starting Player Index": 0,
        },
        gameStarted: false,
        gameComplete: false,
        firstPlayer: null,
        allowedUser: false,
    };

    componentDidMount() {
        isGameStarted().then((gameStarted) => {
            if (!gameStarted) {
                // A user is allowed to join if no game is started
                this.setState({
                    gameOptions: this.state.gameOptions,
                    gameStarted: gameStarted,
                    gameComplete: false,
                    firstPlayer: this.state.firstPlayer,
                    allowedUser: true,
                });
                return;
            }
            isGameComplete().then((gameComplete) => {
                if (gameComplete) {
                    // A user is allowed to join if the previous game has been completed
                    this.setState({
                        gameOptions: this.state.gameOptions,
                        gameStarted: gameStarted,
                        gameComplete: true,
                        firstPlayer: this.state.firstPlayer,
                        allowedUser: true,
                    });
                    return;
                }
                getGamePlayers().then((playersList) => {
                    if (playersList.includes(currentUser.username)) {
                        // A user is allowed to join if he is part of the current started game, he is sent to the next step of the game
                        this.setState({
                            gameOptions: this.state.gameOptions,
                            gameStarted: this.state.gameStarted,
                            gameComplete: false,
                            firstPlayer: this.state.firstPlayer,
                            allowedUser: true,
                        });
                        this.props.goToThemeSelectionHandler();
                        return;
                    }
                    // In any other case, the user is not allowed to join. Send him back to login page.
                    alert(`You cannot join a game that you are not part of.`);
                    this.props.goToAskCredentialsHandler();
                });
            });
        });
    }

    /**
     * Repeatedly check for multiple things regarding the game:
     * - Checks if the game has already been started (but not completed), if yes, switch to in-game view
     * - Checks if the current user is the first game user, i.e. if he can edit the game options
     * - Does the live visual update of options for other users
     */
    checkGameStatus = () => {
        if (!this.state.allowedUser) {
            this.gameCheckingId = repeat(this.checkGameStatus, 100);
            return;
        }
        isGameStarted().then((gameStarted) => {
            if (gameStarted && !this.state.gameComplete) {
                this.props.goToThemeSelectionHandler();
                return;
            }
            getConnectedUsers().then((usersList) => {
                let firstPlayer = usersList[0];
                if (firstPlayer === currentUser.username) {
                    this.setState({
                        gameOptions: this.state.gameOptions,
                        gameStarted: gameStarted,
                        gameComplete: this.state.gameComplete,
                        firstPlayer: firstPlayer,
                        allowedUser: this.state.allowedUser,
                    });
                    this.gameCheckingId = repeat(this.checkGameStatus, 100);
                } else {
                    getTempGameOptions().then((gameOptions) => {
                        this.setState({
                            gameOptions: gameOptions,
                            gameStarted: gameStarted,
                            gameComplete: this.state.gameComplete,
                            firstPlayer: firstPlayer,
                            allowedUser: this.state.allowedUser,
                        });
                        this.gameCheckingId = repeat(this.checkGameStatus, 100);
                    });
                }
            });
        });
    }


    gameCheckingId = repeat(this.checkGameStatus, 100);

    componentWillUnmount() {
        clearTimeout(this.gameCheckingId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.state.firstPlayer === currentUser.username) && (this.state.gameOptions !== prevState.gameOptions)) {
            setTempGameConfig(this.state.gameOptions).then();
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
            gameComplete: this.state.gameComplete,
            firstPlayer: this.state.firstPlayer,
            allowedUser: this.state.allowedUser,
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
            gameComplete: this.state.gameComplete,
            firstPlayer: this.state.firstPlayer,
            allowedUser: this.state.allowedUser,
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
            gameComplete: this.state.gameComplete,
            firstPlayer: this.state.firstPlayer,
            allowedUser: this.state.allowedUser,
        });
    }

    optionsCallbacks = {
        "Number of rounds": this.liveUpdateNumberOfRounds,
        "Number of themes per card": this.liveUpdateNumberOfThemesPerCard,
        "Starting Player Index": this.liveUpdateStartingPlayerIndex,
    }

    startGameHandler = () => {
        startGame(this.state.gameOptions).then((startSuccess) => {
            if (startSuccess.status) {
                this.props.goToThemeSelectionHandler();
            } else {
                alert(startSuccess.message);
            }
        });
    }

    render() {
        if (!this.state.allowedUser) {
            return null;
        }
        return (
            <div className="UserActionBox">
                <div className="SubTitle">
                    {this.state.firstPlayer === currentUser.username ?
                        <>Game Preparation</> :
                        <>{this.state.firstPlayer} is preparing the game...</>}
                </div>
                <div>
                    {Object.keys(this.optionsCallbacks).map((optionName) => {
                        return (
                            <div className="GamePreparation">
                                <div className="GamePreparationOption">
                                    {optionName}:
                                </div>
                                <div className="GamePreparationField">
                                    {this.state.firstPlayer === currentUser.username ? <input
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
                {this.state.firstPlayer === currentUser.username ? <div className="ButtonBox">
                    <button onClick={this.startGameHandler}>
                        Start Game
                    </button>
                </div> : null}
            </div>
        );
    }
}
