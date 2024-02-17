import './rounds.css';
import {makeGetCall, repeat} from "../common/common.js";
import React, {Component} from "react";
import {GameProgress} from "../game/game_progress.js";
import {currentUser, Username} from "../authentication/authentication.js";
import {Users} from "../authentication/users.js";
import {CurrentTheme, getTheme, SelectTheme, WaitThemeSelected} from "./theme_selection.js";
import {CurrentUserNumber, PlayerPropositions, MakeProposition, WaitPropositionMade} from "./proposition_making.js";
import {MakeHypothesis} from "./hypothesis_making.js";


export let getRoundPlayers = () => {
    return makeGetCall("/rounds/get_players");
}

function getCurrentPlayer() {
    return makeGetCall("/rounds/get_current_player");
}

function checkAllPropositionsMade() {
    return makeGetCall("/rounds/check_all_propositions_made");
}

export class ThemeSelection extends Component {

    state = {
        firstPlayer: null,
    }

    componentDidMount() {
        getRoundPlayers().then((playersList) => {
            let firstPlayer = playersList[0];
            this.setState({firstPlayer: firstPlayer});
            if (firstPlayer !== currentUser.username) {
                this.props.goToPropositionMakingHandler();
            }
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
                    {this.state.firstPlayer === currentUser.username ?
                        null :
                        <CurrentUserNumber/>}
                    <div className="GameProgressBox">
                        <GameProgress/>
                    </div>
                </div>
                <div className="BottomBox">
                    <Users getUsersListHandler={getRoundPlayers} checkOnlyOnce={true}/>
                    {this.state.firstPlayer === currentUser.username ?
                        <SelectTheme goToPropositionMakingHandler={this.props.goToPropositionMakingHandler}/> :
                        null}
                </div>
            </div>
        );
    }
}

export class PropositionMaking extends Component {

    state = {
        theme: null,
        firstPlayer: null,
        currentPlayer: null,
        allPropositionsMade: false,
    };

    componentDidMount() {
        getRoundPlayers().then((playersList) => {
            this.setState(
                {
                    firstPlayer: playersList[0],
                    theme: this.state.theme,
                    currentPlayer: this.state.currentPlayer,
                    allPropositionsMade: this.state.allPropositionsMade,
                });
        });
    }

    getCurrentTheme = () => {
        getTheme().then((theme) => {
            this.setState({
                theme: theme,
                firstPlayer: this.state.firstPlayer,
                currentPlayer: this.state.currentPlayer,
                allPropositionsMade: this.state.allPropositionsMade,
            });
            if (theme === null) {
                // Get theme until it's not null
                this.currentThemeGettingId = repeat(this.getCurrentTheme, 100);
            }
        });
    }

    currentThemeGettingId = repeat(this.getCurrentTheme, 100);

    checkTurnStatus = () => {
        getCurrentPlayer().then((currentPlayer) => {
            checkAllPropositionsMade().then((allPropositionsMade) => {
                this.setState({
                    theme: this.state.theme,
                    firstPlayer: this.state.firstPlayer,
                    currentPlayer: currentPlayer,
                    allPropositionsMade: allPropositionsMade,
                });
                if (allPropositionsMade) {
                    this.props.goToHypothesisMakingHandler();
                }
                else {
                    this.turnStatusCheckingId = repeat(this.checkTurnStatus, 100);
                }
            });
        });
    }

    turnStatusCheckingId = repeat(this.checkTurnStatus, 100);

    componentWillUnmount() {
        clearTimeout(this.currentThemeGettingId);
        clearTimeout(this.turnStatusCheckingId);
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
                    <CurrentUserNumber/>
                    <div className="GameProgressBox">
                        <GameProgress/>
                    </div>
                    <CurrentTheme/>
                </div>
                <div className="BottomBox">
                    <PlayerPropositions/>
                    {this.state.theme === null ?
                        <WaitThemeSelected firstPlayer={this.state.firstPlayer}/> :
                        this.state.currentPlayer === currentUser.username ?
                            <MakeProposition/> :
                            <WaitPropositionMade currentPlayer={this.state.currentPlayer}/>
                    }
                </div>
            </div>
        );
    }
}

export class HypothesisMaking extends Component {
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
                    <CurrentUserNumber/>
                    <div className="GameProgressBox">
                        <GameProgress/>
                    </div>
                    <CurrentTheme/>
                </div>
                <div className="BottomBox">
                    <PlayerPropositions checkOnlyOnce={true}/>
                    <MakeHypothesis goToRoundResultsCheckingHandler={this.props.goToRoundResultsCheckingHandler}/>
                </div>
            </div>
        );
    }
}
