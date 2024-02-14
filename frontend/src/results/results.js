import React, {Component} from "react";
import {makeGetCall} from "../common/common.js";
import {Username} from "../authentication/authentication.js";
import {GameProgress} from "../game/game_progress.js";
import {getGamePlayers} from "../game/game.js";
import {CurrentUserNumber} from "../rounds/proposition_making.js";
import {CurrentTheme} from "../rounds/theme_selection.js";
import {Hypothesis, Reality, RoundResult} from "./round_result.js";
import {GameResult} from "./game_result";
import {Users} from "../authentication/users";


function checkRoundResult() {
    return makeGetCall("/rounds/check_round_result");
}

function isGameWon() {
    return makeGetCall("/game/is_game_won");
}

export class RoundResultChecking extends Component {

    constructor(props) {
        super(props);
        checkRoundResult().then((roundResult) => {
            this.setState(roundResult);
        });
    }

    state = {
        success: null,
        hypothesis: null,
        reality: null,
    }

    checkRoundStarted = () => {
        makeGetCall("/game/is_round_in_progress").then((inProgress) => {
            if (inProgress) {
                this.props.goToThemeSelectionHandler();
            }
            else {
                this.roundStartedCheckingId = setTimeout(this.checkRoundStarted, 100);
            }
        })
    }

    roundStartedCheckingId = setTimeout(this.checkRoundStarted, 100);

    componentWillUnmount() {
        clearTimeout(this.roundStartedCheckingId);
    }

    render() {
        return (
            <div className="App">
                <div className="Grid">
                    <div className="HeadBox">
                        <Username goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}/>
                        <div className="Title">
                            Top Ten
                        </div>
                    </div>
                    <div className="MiddleBox">
                        <GameProgress/>
                        <CurrentUserNumber/>
                        <CurrentTheme/>
                        <RoundResult success={this.state.success}/>
                    </div>
                    <Reality reality={this.state.reality}/>
                    <Hypothesis hypothesis={this.state.hypothesis}
                                goToThemeSelectionHandler={this.props.goToThemeSelectionHandler}
                                goToGameResultsCheckingHandler={this.props.goToGameResultsCheckingHandler}
                    />
                </div>
            </div>
        );
    }
}


export class GameResultChecking extends Component {

    constructor(props) {
        super(props);
        isGameWon().then((gameResult) => {
            this.setState({gameResult: gameResult});
        });
    }

    state = {
        gameResult: null,
    }

    render() {
        return (
            <div className="App">
                <div className="Grid">
                    <div className="HeadBox">
                        <Username goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}/>
                        <div className="Title">
                            Top Ten
                        </div>
                    </div>
                    <div className="MiddleBox">
                        <GameProgress/>
                        <GameResult success={this.state.gameResult}/>
                    </div>
                    <Users getUsersListHandler={getGamePlayers} checkOnlyOnce={true}/>
                    <div className="UserActionBox">
                        <div className="BoxTitle">
                            Setup a new game?
                        </div>
                        <div className="UserActionButtonBox">
                            <button onClick={this.props.goToGamePreparationHandler} className="UserActionButton">
                                Setup new game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
