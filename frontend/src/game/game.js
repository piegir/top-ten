import './game.css';
import {Component} from "react";
import {Users} from "../users/users";
import {Username} from "../authentication/authentication";
import {GameSetup} from "./game_start.js"
import {GameProgress} from "./game_progress.js"
import {StartRound} from "./round_start.js"


export class GamePreparation extends Component {
    render() {
        return (
            <div className="App">
                <Username goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <GameSetup goToRoundStartingHandler={this.props.goToRoundStartingHandler}/>
                </div>
            </div>

        );
    }
}

export class RoundStarting extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <StartRound goToThemeSelectionHandler={this.props.goToThemeSelectionHandler}
                                goToWaitThemeSelectionHandler={this.props.goToWaitThemeSelectionHandler}/>
                </div>
            </div>

        );
    }
}
