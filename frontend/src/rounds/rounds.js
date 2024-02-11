import './rounds.css';
import {makeGetCall} from "../common/common.js";
import React, {Component} from "react";
import {GameProgress} from "../game/game_progress.js";
import {Username} from "../authentication/authentication.js";
import {Users} from "../users/users.js";
import {CurrentTheme, SelectTheme} from "./theme_selection.js";
import {CurrentUserNumber, PlayerPropositions, MakeProposition} from "./proposition_making.js";
import {PlayerNumberedPropositions, MakeHypothesis, CheckResults} from "./hypothesis_making.js";


export function getFirstRoundPlayer() {
    return makeGetCall("/rounds/get_first_player");
}

export class ThemeSelection extends Component {
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
                    <GameProgress/>
                    <Users/>
                    <SelectTheme goToPropositionMakingHandler={this.props.goToPropositionMakingHandler}/>
                </div>
            </div>
        );
    }
}

export class WaitThemeSelection extends Component {
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
                    </div>
                    <Users/>
                    <div className="UserActionBox"/>
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
