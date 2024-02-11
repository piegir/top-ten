import './rounds.css';
import {makeGetCall} from "../common/common.js";
import React, {Component} from "react";
import {GameProgress} from "../game/game_progress.js";
import {currentUser, Username} from "../authentication/authentication.js";
import {getConnectedUsers, Users} from "../authentication/users.js";
import {CurrentTheme, SelectTheme} from "./theme_selection.js";
import {CurrentUserNumber, PlayerPropositions, MakeProposition} from "./proposition_making.js";
import {PlayerNumberedPropositions, MakeHypothesis, CheckResults} from "./hypothesis_making.js";


export let getRoundPlayers = () => {
    return makeGetCall("/rounds/get_players");
}

export class ThemeSelection extends Component {

    constructor(props) {
        super(props);
        getRoundPlayers().then((playersList) => {
            let isFirstPlayer = currentUser.username === playersList[0];
            this.setState({isFirstPlayer: isFirstPlayer});
            if (!isFirstPlayer) {
                this.props.goToPropositionMakingHandler();
            }
        });
    }

    state = {
        isFirstPlayer: false,
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
                        {this.state.isFirstPlayer ?
                            null :
                            <CurrentUserNumber/>}
                    </div>
                    <Users getUsersListHandler={getRoundPlayers} checkOnlyOnce={true}/>
                    {this.state.isFirstPlayer ?
                        <SelectTheme goToPropositionMakingHandler={this.props.goToPropositionMakingHandler}/> :
                        <div className="UserActionBox"/>}
                </div>
            </div>
        );
    }
}

export class PropositionMaking extends Component {
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
                    <MakeProposition goToHypothesisMakingHandler={this.props.goToHypothesisMakingHandler}/>
                </div>
            </div>
        );
    }
}

export class WaitPropositionMaking extends Component {
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
                    <div className="UserActionBox"/>
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
                    <PlayerPropositions/>
                    <MakeHypothesis goToResultsCheckingHandler={this.props.goToResultsCheckingHandler}/>
                </div>
            </div>
        );
    }
}

export class ResultsChecking extends Component {
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
                    <PlayerNumberedPropositions/>
                    <CheckResults goToRoundStartingHandler={this.props.goToRoundStartingHandler}/>
                </div>
            </div>
        );
    }
}
