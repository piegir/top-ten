import {Component} from "react";
import {makeGetCall, makePostCall} from "../common/common";
import {getConnectedUsers} from "../users/users";


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


export class GameSetup extends Component {

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
                this.props.goToRoundStartingHandler();
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
