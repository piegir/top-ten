import './App.css';
import {Component} from "react";
import {currentUser, userLogin, userLogout, AskCredentials} from "./authentication/authentication.js";
import {Users} from "./users/users.js"
import {GamePreparation, RoundStarting} from "./game/game.js"
import {ThemeSelection, WaitThemeSelection, PropositionMaking, WaitPropositionMaking, HypothesisMaking, ResultsChecking} from "./rounds/rounds"
import {wait} from "./common/common.js";

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

        window.onpagehide = (event) => {
            userLogout().then();
            // Wait 1s to make sure the user was logged out.
            wait(1000);
        };

    }

    state = {view: views.AskCredentials};

    /// Logic Handlers
    loginHandler = (loginInfo) => {
        currentUser.username = loginInfo.username;
        userLogin()
            .then((loginSuccess) => {
                if (loginSuccess.status) {
                    alert(loginSuccess.message);
                    this.setState({view: views.GamePreparation});
                } else {
                    alert(loginSuccess.message);
                }
            });
    };

    logoutHandler = () => {
        if (window.confirm("Logging out will make you leave the game you are part of. Are you sure?")) {
            userLogout()
                .then((logoutSuccess) => {
                    if (logoutSuccess.status) {
                        alert(logoutSuccess.message);
                        currentUser.username = "";
                        this.setState({view: views.AskCredentials});
                    } else {
                        alert(logoutSuccess.message);
                    }
                });
        }
    };

    gameStartedHandler = () => {
        this.setState({view: views.RoundStarting});
    };

    goToThemeSelectionHandler = () => {
        this.setState({view: views.ThemeSelection});
    };

    goToWaitThemeSelectionHandler = () => {
        this.setState({view: views.WaitThemeSelection});
    };

    themeSelectedHandler = () => {
        let roundCurrentPlayer = currentUser.username;
        // TODO: replace with API call checking for current player
        if (currentUser.username === roundCurrentPlayer) {
            this.setState({view: views.PropositionMaking});
        } else {
            this.setState({view: views.WaitPropositionMaking});
        }
    };

    propositionMadeHandler = () => {
        let roundFirstPlayer = currentUser.username;
        // TODO: replace with API call checking for first player and that all propositions were made
        if (currentUser.username === roundFirstPlayer) {
            this.setState({view: views.HypothesisMaking});
        } else {
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
                    <AskCredentials loginHandler={this.loginHandler}/>
                )
            case views.GamePreparation:
                return (
                    <GamePreparation gameStartedHandler={this.gameStartedHandler} logOutHandler={this.logoutHandler}/>
                )
            case views.RoundStarting:
                return (
                    <RoundStarting goToThemeSelectionHandler={this.goToThemeSelectionHandler}
                                   goToWaitThemeSelectionHandler={this.goToWaitThemeSelectionHandler}
                                   logOutHandler={this.logoutHandler}/>
                )
            case views.ThemeSelection:
                return (
                    <ThemeSelection themeSelectedHandler={this.themeSelectedHandler}
                                    logOutHandler={this.logoutHandler}/>
                )
            case views.WaitThemeSelection:
                return (
                    <WaitThemeSelection themeSelectedHandler={this.themeSelectedHandler}
                                        logOutHandler={this.logoutHandler}/>
                )
            case views.PropositionMaking:
                return (
                    <PropositionMaking propositionMadeHandler={this.propositionMadeHandler}
                                       logOutHandler={this.logoutHandler}/>
                )
            case views.WaitPropositionMaking:
                return (
                    <WaitPropositionMaking propositionMadeHandler={this.propositionMadeHandler}
                                           logOutHandler={this.logoutHandler}/>
                )
            case views.HypothesisMaking:
                return (
                    <HypothesisMaking hypothesisMadeHandler={this.hypothesisMadeHandler}
                                      logOutHandler={this.logoutHandler}/>
                )
            case views.ResultsChecking:
                return (
                    <ResultsChecking roundFinishedHandler={this.roundFinishedHandler}
                                     logOutHandler={this.logoutHandler}/>
                )
            default:
                return (
                    <AskCredentials loginHandler={this.loginHandler}/>
                )
        }
    }
}

export default App;
