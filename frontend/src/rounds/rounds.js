import './rounds.css';
import {makeGetCall} from "../common/common.js";
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

    constructor(props) {
        super(props);
        getRoundPlayers().then((playersList) => {
            let firstPlayer = playersList[0];
            this.setState({firstPlayer: firstPlayer});
            if (firstPlayer !== currentUser.username) {
                this.props.goToPropositionMakingHandler();
            }
        });
    }

    state = {
        firstPlayer: null,
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
                        {this.state.firstPlayer === currentUser.username ?
                            null :
                            <CurrentUserNumber/>}
                    </div>
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

    constructor(props) {
        super(props);
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

    state = {
        theme: null,
        firstPlayer: null,
        currentPlayer: null,
        allPropositionsMade: false,
    };

    currentThemeGettingId = setInterval(() => {
        getTheme().then((theme) => {
            this.setState({
                theme: theme,
                firstPlayer: this.state.firstPlayer,
                currentPlayer: this.state.currentPlayer,
                allPropositionsMade: this.state.allPropositionsMade,
            });
            // Get theme until it's not null
            if (theme !== null) {
                clearInterval(this.currentThemeGettingId);
            }
        });
    }, 1000);

    turnStatusCheckingId = setInterval(() => {
        checkAllPropositionsMade().then((allPropositionsMade) => {
            this.setState({
                theme: this.state.theme,
                firstPlayer: this.state.firstPlayer,
                currentPlayer: this.state.currentPlayer,
                allPropositionsMade: allPropositionsMade,
            });
            if (allPropositionsMade) {
                this.props.goToHypothesisMakingHandler();
            }
        })
        getCurrentPlayer().then((currentPlayer) => {
            this.setState({
                theme: this.state.theme,
                firstPlayer: this.state.firstPlayer,
                currentPlayer: currentPlayer,
                allPropositionsMade: this.state.allPropositionsMade,
            });
        });
    }, 1000);

    componentWillUnmount() {
        clearInterval(this.turnStatusCheckingId);
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
                    </div>
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
                    </div>
                    <PlayerPropositions checkOnlyOnce={true}/>
                    <MakeHypothesis goToRoundResultsCheckingHandler={this.props.goToRoundResultsCheckingHandler}/>
                </div>
            </div>
        );
    }
}
