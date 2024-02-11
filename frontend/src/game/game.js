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
                <Username logOutHandler={this.props.logOutHandler}/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <GameSetup gameStartedHandler={this.props.gameStartedHandler}/>
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
                <Username logOutHandler={this.props.logOutHandler}/>
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
