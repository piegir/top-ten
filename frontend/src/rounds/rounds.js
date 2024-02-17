import './rounds.css';
import {makeGetCall, repeat} from "../common/common.js";
import React, {Component} from "react";
import {GameProgress} from "../game/game_progress.js";
import {currentUser, Username} from "../authentication/authentication.js";
import {Users} from "../authentication/users.js";
import {CurrentTheme, getTheme, SelectTheme, WaitThemeSelected} from "./theme_selection.js";
import {CurrentUserNumber, PlayerPropositions, MakeProposition, WaitPropositionMade} from "./proposition_making.js";
import {MakeHypothesis, WaitHypothesisMade} from "./hypothesis_making.js";


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
        firstRoundPlayer: null,
    }

    componentDidMount() {
        getRoundPlayers().then((playersList) => {
            let firstRoundPlayer = playersList[0];
            this.setState({firstRoundPlayer: firstRoundPlayer});
            if (firstRoundPlayer !== currentUser.username) {
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
                    <GameProgress/>
                    {this.state.firstRoundPlayer === currentUser.username ?
                        null :
                        <CurrentUserNumber/>}
                </div>
                <div className="BottomBox">
                    <Users getUsersListHandler={getRoundPlayers} checkOnlyOnce={true} displayNumbers={false}/>
                    {this.state.firstRoundPlayer === currentUser.username ?
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
        firstRoundPlayer: null,
        currentPlayer: null,
        allPropositionsMade: false,
    };

    componentDidMount() {
        getRoundPlayers().then((playersList) => {
            this.setState(
                {
                    firstRoundPlayer: playersList[0],
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
                firstRoundPlayer: this.state.firstRoundPlayer,
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
                    firstRoundPlayer: this.state.firstRoundPlayer,
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
                    <GameProgress/>
                    <CurrentUserNumber/>
                    <CurrentTheme/>
                </div>
                <div className="BottomBox">
                    <PlayerPropositions/>
                    {this.state.theme === null ?
                        <WaitThemeSelected firstRoundPlayer={this.state.firstRoundPlayer}/> :
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

    state = {firstRoundPlayer: null};

    componentDidMount() {
        getRoundPlayers().then((playersList) => {
            this.setState({firstRoundPlayer: playersList[0]});
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
                    <GameProgress/>
                    <CurrentUserNumber/>
                    <CurrentTheme/>
                </div>
                <div className="BottomBox">
                    <PlayerPropositions checkOnlyOnce={true} displayNumbers={false}/>
                    {this.state.firstRoundPlayer === currentUser.username ?
                        <MakeHypothesis goToRoundResultsCheckingHandler={this.props.goToRoundResultsCheckingHandler}/> :
                        <WaitHypothesisMade firstRoundPlayer={this.state.firstRoundPlayer} goToRoundResultsCheckingHandler={this.props.goToRoundResultsCheckingHandler}/>
                    }
                </div>
            </div>
        );
    }
}
