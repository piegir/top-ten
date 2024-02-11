import {Component} from "react";
import {makeGetCall, makePostCall} from "../common/common";
import {currentUser} from "../authentication/authentication";
import {getFirstRoundPlayer} from "../rounds/rounds";


function getFirstGamePlayer() {
    return makeGetCall("/game/get_first_player");
}

function startRound() {
    return makePostCall("/game/start_new_round");
}

function isRoundStarted() {
    return makeGetCall("/game/is_round_in_progress");
}

export class StartRound extends Component {

    state = {roundStarted: false};

    roundStartedCheckingId = setInterval(() => {
        isRoundStarted().then((roundStarted) => {
            this.setState({roundStarted: roundStarted});
            if (roundStarted) {
                getFirstRoundPlayer().then((firstPlayer) => {
                    if (currentUser.username === firstPlayer) {
                        this.props.goToThemeSelectionHandler();
                    } else {
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
