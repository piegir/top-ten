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
                <GameProgress/>
                <Username logOutHandler={this.props.logOutHandler}/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <SelectTheme themeSelectedHandler={this.props.themeSelectedHandler}/>
                </div>
            </div>

        );
    }
}

export class WaitThemeSelection extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username logOutHandler={this.props.logOutHandler}/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <CurrentUserNumber/>
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
                <GameProgress/>
                <Username logOutHandler={this.props.logOutHandler}/>
                <CurrentUserNumber/>
                <CurrentTheme/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <PlayerPropositions/>
                    <MakeProposition propositionMadeHandler={this.props.propositionMadeHandler}/>
                </div>
            </div>

        );
    }
}

export class WaitPropositionMaking extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username logOutHandler={this.props.logOutHandler}/>
                <CurrentUserNumber/>
                <CurrentTheme/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
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
                <GameProgress/>
                <Username logOutHandler={this.props.logOutHandler}/>
                <CurrentUserNumber/>
                <CurrentTheme/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <PlayerPropositions/>
                    <MakeHypothesis hypothesisMadeHandler={this.props.hypothesisMadeHandler}/>
                </div>
            </div>

        );
    }
}

export class ResultsChecking extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username logOutHandler={this.props.logOutHandler}/>
                <CurrentUserNumber/>
                <CurrentTheme/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <PlayerNumberedPropositions/>
                    <CheckResults roundFinishedHandler={this.props.roundFinishedHandler}/>
                </div>
            </div>

        );
    }
}
