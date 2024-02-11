import './game.css';
import {Component} from "react";
import {makeGetCall, makePostCall, wait} from "../common/common";
import {getConnectedUsers, Users} from "../users/users";
import {currentUser, Username} from "../authentication/authentication";
import {getFirstRoundPlayer} from "../rounds/rounds";

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

function startGame(gameOptions) {
    return getConnectedUsers().then((playersList) => {
        let gameConfig = {
            "players_list": playersList,
            "max_nb_rounds": gameOptions["Number of rounds"],
            "starting_player_index": 0,
            "nb_themes_per_card": gameOptions["Number of themes per card"],
        }
        return makePostCall("/game/start", gameConfig);
    })
}

function isGameStarted() {
    return makeGetCall("/game/is_started");
}

function getFirstGamePlayer() {
    return makeGetCall("/game/get_first_player");
}

function startRound() {
    return makePostCall("/game/start_new_round");
}

function isRoundStarted() {
    return makeGetCall("/game/is_round_in_progress");
}


class GameSetup extends Component {

    state = {
        gameOptions: {
            "Number of rounds": 7,
            "Number of themes per card": 3,
        },
        gameStarted: false,
    };

    gameStartedCheckingId = setInterval(() => {
        isGameStarted().then((gameStarted) => {
            this.setState({
                gameOptions: this.state.gameOptions,
                gameStarted: gameStarted,
            });
            if (gameStarted) {
                this.props.gameStartedHandler();
            }
        })
    }, 1000, []);

    componentWillUnmount() {
        clearInterval(this.gameStartedCheckingId);
    }

    liveUpdateNumberOfRounds = (event) => {
        this.setState({
            gameOptions: {
                "Number of rounds": event.target.value,
                "Number of themes per card": this.state.gameOptions["Number of themes per card"],
            }
        });
    }

    liveUpdateNumberOfThemesPerCard = (event) => {
        this.setState({
            gameOptions: {
                "Number of rounds": this.state.gameOptions["Number of rounds"],
                "Number of themes per card": event.target.value,
            }
        });
    }

    optionsCallbacks = {
        "Number of rounds": this.liveUpdateNumberOfRounds,
        "Number of themes per card": this.liveUpdateNumberOfThemesPerCard,
    }

    startGameHandler = () => {
        startGame(this.state.gameOptions).then((startGameSuccess) => {
            if (startGameSuccess.status) {
                alert(startGameSuccess.message);
                this.props.gameStartedHandler();
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
                    {Object.entries(this.state.gameOptions).map(([optionName, optionValue]) => {
                        return (
                            <div className="UserActionInput">
                                <div className="UserActionInputOption">
                                    {optionName}:
                                </div>
                                <div className="UserActionInputField">
                                    <input
                                        type="text"
                                        value={optionValue}
                                        className="NumberInput"
                                        onChange={this.optionsCallbacks[optionName]}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="UserActionButtonBox">
                    <button onClick={this.startGameHandler}
                            className="UserActionButton">
                        Start Game
                    </button>
                </div>
            </div>
        );
    }
}

class StartRound extends Component {

    state = {roundStarted: false};

    roundStartedCheckingId = setInterval(() => {
        isRoundStarted().then((roundStarted) => {
            this.setState({roundStarted: roundStarted});
            if (roundStarted) {
                getFirstRoundPlayer().then((firstPlayer) => {
                    if (currentUser.username === firstPlayer) {
                        this.props.goToThemeSelectionHandler();
                    }
                    else {
                        this.props.goToWaitThemeSelectionHandler();
                    }
                });
            }
        })
    }, 1000, []);

    componentWillUnmount() {
        clearInterval(this.roundStartedCheckingId);
    }

    startRoundHandler = () => {
        getFirstGamePlayer().then((firstPlayer) => {
            if (currentUser.username === firstPlayer) {
                startRound().then((startRoundSuccess) => {
                    if (startRoundSuccess.status) {
                        alert(startRoundSuccess.message);
                        this.props.goToThemeSelectionHandler();
                    } else {
                        alert(startRoundSuccess.message);
                    }
                })
            } else {
                alert(`Only the first player ${firstPlayer} can start the round.`);
            }
        });
    }

    render() {
        return (
            <div className="UserActionBox">
                <div className="BoxTitle">
                    Ready to start the round?
                </div>
                <div className="UserActionButtonBox">
                    <button onClick={this.startRoundHandler}
                            className="UserActionButton">
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


export class GamePreparation extends Component {
    render() {
        return (
            <div className="App">
                <Username logOutHandler={this.props.logOutHandler}/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <GameSetup gameStartedHandler={this.props.gameStartedHandler}/>
                </div>
            </div>

        );
    }
}

export class RoundStarting extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username logOutHandler={this.props.logOutHandler}/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <StartRound goToThemeSelectionHandler={this.props.goToThemeSelectionHandler}
                                goToWaitThemeSelectionHandler={this.props.goToWaitThemeSelectionHandler}/>
                </div>
            </div>

        );
    }
}
