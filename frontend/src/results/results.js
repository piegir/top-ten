import React, {Component} from "react";
import {makeGetCall, repeat} from "../common/common.js";
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

    state = {
        success: null,
        hypothesis: null,
        reality: null,
    }

    componentDidMount() {
        checkRoundResult().then((roundResult) => {
            this.setState(roundResult);
        });
    }

    checkRoundStarted = () => {
        makeGetCall("/game/is_round_in_progress").then((inProgress) => {
            if (inProgress) {
                this.props.goToThemeSelectionHandler();
            }
            else {
                this.roundStartedCheckingId = repeat(this.checkRoundStarted, 100);
            }
        })
    }

    roundStartedCheckingId = repeat(this.checkRoundStarted, 100);

    componentWillUnmount() {
        clearTimeout(this.roundStartedCheckingId);
    }

    render() {
        return (
            <div className="GlobalGrid">
                <div className="HeadBox">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Username goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}/>
                </div>
                <div className="MiddleBox">
                    <RoundResult success={this.state.success}/>
                    <div className="GameProgressBox">
                        <GameProgress/>
                    </div>
                    <CurrentTheme/>
                </div>
                <div className="BottomBox">
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

    state = {
        gameResult: null,
    }

    componentDidMount() {
        isGameWon().then((gameResult) => {
            this.setState({gameResult: gameResult});
        });
    }

    render() {
        return (
            <div className="GlobalGrid">
                <div className="HeadBox">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Username goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}/>
                </div>
                <div className="MiddleBox">
                    <GameResult success={this.state.gameResult}/>
                    <div className="GameProgressBox">
                        <GameProgress/>
                    </div>
                </div>
                <div className="BottomBox">
                    <Users getUsersListHandler={getGamePlayers} checkOnlyOnce={true}/>
                    <div className="UserActionBox">
                        <div className="SubTitle">
                            Setup a new game?
                        </div>
                        <div className="ButtonBox">
                            <button onClick={this.props.goToGamePreparationHandler}>
                                Setup new game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
