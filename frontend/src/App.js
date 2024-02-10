import './App.css';
import {Component} from "react";
import {currentUser, LoginSignup, Username} from "./authentication/authentication.js";
import {Users} from "./users/users.js"
import {GameSetup, StartRound, roundStarted, GameProgress} from "./game/game.js"
import {
    CurrentUserNumber,
    PlayerPropositions,
    SelectTheme,
    CurrentTheme,
    MakeProposition,
    MakeHypothesis,
    PlayerNumberedPropositions,
    CheckResults
} from "./rounds/rounds"


class AskCredentials extends Component {
    render() {
        return (
            <div className="App">
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                </div>
                <LoginSignup loginHandler={this.props.loginHandler} signupHandler={this.props.signupHandler}/>
            </div>

        );
    }
}

class GamePreparation extends Component {
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

class RoundStarting extends Component {
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
                    <StartRound roundStartedHandler={this.props.roundStartedHandler}/>
                </div>
            </div>

        );
    }
}

class ThemeSelection extends Component {
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

class WaitThemeSelection extends Component {
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

class PropositionMaking extends Component {
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

class WaitPropositionMaking extends Component {
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

class HypothesisMaking extends Component {
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

class ResultsChecking extends Component {
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

let views = {
    AskCredentials: 0,
    GamePreparation: 1,
    RoundStarting: 2,
    ThemeSelection: 3,
    WaitThemeSelection: 4,
    PropositionMaking: 5,
    WaitPropositionMaking: 6,
    HypothesisMaking: 7,
    WaitHypothesisMaking: 8,
    ResultsChecking: 9,
}

class App extends Component {

    constructor(props) {
        super(props);
        window.onbeforeunload = (event) => {
            const e = event;
            // Cancel the event
            e.preventDefault();
            if (e) {
                e.returnValue = ''; // Legacy method for cross browser support
            }
            return ''; // Legacy method for cross browser support
        };

    }
    state = {view: views.AskCredentials};

    /// Logic Handlers
    logoutHandler = () => {
        if (window.confirm("Logging out will make you leave the game you are part of. Are you sure?")) {
            currentUser.username = "";
            this.setState({view: views.AskCredentials});
        }
    };

    loginHandler = (loginInfo) => {
        currentUser.username = loginInfo.username;
        this.setState({view: views.GamePreparation});
    };

    signupHandler = (signupInfo) => {
        currentUser.username = signupInfo.username;
        this.setState({view: views.GamePreparation});
    };

    gameStartedHandler = () => {
        this.setState({view: views.RoundStarting});
    };

    roundStartedHandler = () => {
        let roundFirstPlayer = currentUser.username;
        // TODO: replace with API call checking for first player
        if (currentUser.username === roundFirstPlayer) {
            this.setState({view: views.ThemeSelection});
        }
        else {
            this.setState({view: views.WaitThemeSelection});
        }
    };

    themeSelectedHandler = () => {
        let roundCurrentPlayer = currentUser.username;
        // TODO: replace with API call checking for current player
        if (currentUser.username === roundCurrentPlayer) {
            this.setState({view: views.PropositionMaking});
        }
        else {
            this.setState({view: views.WaitPropositionMaking});
        }
    };

    propositionMadeHandler = () => {
        let roundFirstPlayer = currentUser.username;
        // TODO: replace with API call checking for first player and that all propositions were made
        if (currentUser.username === roundFirstPlayer) {
            this.setState({view: views.HypothesisMaking});
        }
        else {
            this.setState({view: views.WaitHypothesisMaking});
        }
    };

    hypothesisMadeHandler = () => {
        this.setState({view: views.ResultsChecking});
    };

    roundFinishedHandler = () => {
        this.setState({view: views.RoundStarting});
    };

    render() {
        switch (this.state.view) {
            case views.AskCredentials:
                return (
                    <AskCredentials loginHandler={this.loginHandler} signupHandler={this.signupHandler}/>
                )
            case views.GamePreparation:
                return (
                    <GamePreparation gameStartedHandler={this.gameStartedHandler} logOutHandler={this.logoutHandler}/>
                )
            case views.RoundStarting:
                return (
                    <RoundStarting roundStartedHandler={this.roundStartedHandler} logOutHandler={this.logoutHandler}/>
                )
            case views.ThemeSelection:
                return (
                    <ThemeSelection themeSelectedHandler={this.themeSelectedHandler} logOutHandler={this.logoutHandler}/>
                )
            case views.WaitThemeSelection:
                return (
                    <WaitThemeSelection themeSelectedHandler={this.themeSelectedHandler} logOutHandler={this.logoutHandler}/>
                )
            case views.PropositionMaking:
                return (
                    <PropositionMaking propositionMadeHandler={this.propositionMadeHandler} logOutHandler={this.logoutHandler}/>
                )
            case views.WaitPropositionMaking:
                return (
                    <WaitPropositionMaking propositionMadeHandler={this.propositionMadeHandler} logOutHandler={this.logoutHandler}/>
                )
            case views.HypothesisMaking:
                return (
                    <HypothesisMaking hypothesisMadeHandler={this.hypothesisMadeHandler} logOutHandler={this.logoutHandler}/>
                )
            case views.ResultsChecking:
                return (
                    <ResultsChecking roundFinishedHandler={this.roundFinishedHandler} logOutHandler={this.logoutHandler}/>
                )
            default:
                return (
                    <AskCredentials loginHandler={this.loginHandler} signupHandler={this.signupHandler}/>
                )
        }
    }
}

export default App;
