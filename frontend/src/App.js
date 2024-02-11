import './App.css';
import {Component} from "react";
import {currentUser, userLogout, AskCredentials} from "./authentication/authentication.js";
import {GamePreparation} from "./game/game.js"
import {
    ThemeSelection,
    PropositionMaking,
    WaitPropositionMaking,
    HypothesisMaking,
    ResultsChecking
} from "./rounds/rounds"
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
    goToGamePreparationHandler = () => {
        this.setState({view: views.GamePreparation});
    };

    goToAskCredentialsHandler = () => {
        this.setState({view: views.AskCredentials});
    };

    goToRoundStartingHandler = () => {
        this.setState({view: views.RoundStarting});
    };

    goToThemeSelectionHandler = () => {
        this.setState({view: views.ThemeSelection});
    };

    goToWaitThemeSelectionHandler = () => {
        this.setState({view: views.WaitThemeSelection});
    };

    goToPropositionMakingHandler = () => {
        let roundCurrentPlayer = currentUser.username;
        // TODO: replace with API call checking for current player
        if (currentUser.username === roundCurrentPlayer) {
            this.setState({view: views.PropositionMaking});
        } else {
            this.setState({view: views.WaitPropositionMaking});
        }
    };

    goToHypothesisMakingHandler = () => {
        let roundFirstPlayer = currentUser.username;
        // TODO: replace with API call checking for first player and that all propositions were made
        if (currentUser.username === roundFirstPlayer) {
            this.setState({view: views.HypothesisMaking});
        } else {
            this.setState({view: views.WaitHypothesisMaking});
        }
    };

    goToResultsCheckingHandler = () => {
        this.setState({view: views.ResultsChecking});
    };

    render() {
        switch (this.state.view) {
            case views.AskCredentials:
                return (
                    <AskCredentials goToGamePreparationHandler={this.goToGamePreparationHandler}/>
                )
            case views.GamePreparation:
                return (
                    <GamePreparation goToThemeSelectionHandler={this.goToThemeSelectionHandler}
                                     goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>
                )
            case views.ThemeSelection:
                return (
                    <ThemeSelection goToPropositionMakingHandler={this.goToPropositionMakingHandler}
                                    goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>
                )
            case views.PropositionMaking:
                return (
                    <PropositionMaking goToHypothesisMakingHandler={this.goToHypothesisMakingHandler}
                                       goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>
                )
            case views.WaitPropositionMaking:
                return (
                    <WaitPropositionMaking goToHypothesisMakingHandler={this.goToHypothesisMakingHandler}
                                           goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>
                )
            case views.HypothesisMaking:
                return (
                    <HypothesisMaking goToResultsCheckingHandler={this.goToResultsCheckingHandler}
                                      goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>
                )
            case views.ResultsChecking:
                return (
                    <ResultsChecking goToRoundStartingHandler={this.goToRoundStartingHandler}
                                     goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>
                )
            default:
                return (
                    <div>
                    {currentUser !== null ?
                        <GamePreparation goToThemeSelectionHandler={this.goToThemeSelectionHandler}
                                         goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>:
                        <AskCredentials goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>}
                    </div>
                )
        }
    }
}

export default App;
