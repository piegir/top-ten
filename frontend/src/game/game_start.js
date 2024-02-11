import {Component} from "react";
import {makeGetCall, makePostCall} from "../common/common";
import {getConnectedUsers} from "../authentication/users";
import {currentUser} from "../authentication/authentication";


function startGame(gameOptions) {
    return getConnectedUsers().then((playersList) => {
        let gameConfig = {
            "players_list": playersList,
            "max_nb_rounds": gameOptions["Number of rounds"],
            "starting_player_index": gameOptions["Starting Player Index"],
            "nb_themes_per_card": gameOptions["Number of themes per card"],
        }
        alert(JSON.stringify(gameConfig));
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
            "Starting Player Index": 0,
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
                "Starting Player Index": this.state.gameOptions["Starting Player Index"],
            }
        });
    }

    liveUpdateNumberOfThemesPerCard = (event) => {
        this.setState({
            gameOptions: {
                "Number of rounds": this.state.gameOptions["Number of rounds"],
                "Number of themes per card": event.target.value,
                "Starting Player Index": this.state.gameOptions["Starting Player Index"],
            }
        });
    }

    liveUpdateStartingPlayerIndex = (event) => {
        this.setState({
            gameOptions: {
                "Number of rounds": this.state.gameOptions["Number of rounds"],
                "Number of themes per card": this.state.gameOptions["Number of themes per card"],
                "Starting Player Index": event.target.value,
            }
        });
    }

    optionsCallbacks = {
        "Number of rounds": this.liveUpdateNumberOfRounds,
        "Number of themes per card": this.liveUpdateNumberOfThemesPerCard,
        "Starting Player Index": this.liveUpdateStartingPlayerIndex,
    }

    startGameHandler = () => {
        getConnectedUsers().then((usersList) => {
            let firstUser = usersList[0];
            if (currentUser.username === firstUser) {
                startGame(this.state.gameOptions).then((startGameSuccess) => {
                    if (startGameSuccess.status) {
                        alert(startGameSuccess.message);
                        this.props.goToRoundStartingHandler();
                    } else {
                        alert(startGameSuccess.message);
                    }
                });
            }
            else {
                alert(`Only the first user ${firstUser} can start the game.`);
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
