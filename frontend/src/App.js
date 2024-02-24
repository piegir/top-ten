import './App.css';

import {Component} from "react";

import {
  AskCredentials,
  currentUser,
  userLogout
} from "./authentication/authentication.js";
import {wait} from "./common/common.js";
import {GamePreparation} from "./game/game.js"
import {GameResultChecking, RoundResultChecking} from "./results/results.js"
import {
  HypothesisMaking,
  PropositionMaking,
  ThemeSelection
} from "./rounds/rounds.js"

let views = {
  AskCredentials : 0,
  GamePreparation : 1,
  ThemeSelection : 2,
  PropositionMaking : 3,
  HypothesisMaking : 4,
  RoundResultChecking : 5,
  GameResultChecking : 6,
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

  state = {view : views.AskCredentials};

  /// Logic Handlers
  goToGamePreparationHandler =
      () => { this.setState({view : views.GamePreparation}); };

  goToAskCredentialsHandler =
      () => { this.setState({view : views.AskCredentials}); };

  goToThemeSelectionHandler =
      () => { this.setState({view : views.ThemeSelection}); };

  goToPropositionMakingHandler =
      () => { this.setState({view : views.PropositionMaking}); };

  goToHypothesisMakingHandler =
      () => { this.setState({view : views.HypothesisMaking}); };

  goToRoundResultsCheckingHandler =
      () => { this.setState({view : views.RoundResultChecking}); };

  goToGameResultsCheckingHandler =
      () => { this.setState({view : views.GameResultChecking}); };

  render() {
    switch (this.state.view) {
    case views.AskCredentials:
      return (<AskCredentials goToGamePreparationHandler = {
        this.goToGamePreparationHandler
      } />
                )
            case views.GamePreparation:
                return (
                    <GamePreparation goToThemeSelectionHandler={this.goToThemeSelectionHandler}
                                     goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>)
    case views.ThemeSelection:
      return (<ThemeSelection goToPropositionMakingHandler = {
                   this.goToPropositionMakingHandler} goToAskCredentialsHandler = {
        this.goToAskCredentialsHandler
      } />
                )
            case views.PropositionMaking:
                return (
                    <PropositionMaking goToHypothesisMakingHandler={this.goToHypothesisMakingHandler}
                                       goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>)
    case views.HypothesisMaking:
      return (<HypothesisMaking goToRoundResultsCheckingHandler = {
                   this.goToRoundResultsCheckingHandler} goToAskCredentialsHandler = {
        this.goToAskCredentialsHandler
      } />
                )
            case views.RoundResultChecking:
                return (
                    <RoundResultChecking goToThemeSelectionHandler={this.goToThemeSelectionHandler}
                                         goToGameResultsCheckingHandler={this.goToGameResultsCheckingHandler}
                                         goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>)
    case views.GameResultChecking:
      return (
          <GameResultChecking goToGamePreparationHandler =
               {this.goToGamePreparationHandler} goToAskCredentialsHandler =
           {
             this.goToAskCredentialsHandler
           } />
                )
            default:
                return (
                    <div>
                    {currentUser.username !== null ?
                        <GamePreparation goToThemeSelectionHandler={this.goToThemeSelectionHandler}
                                         goToAskCredentialsHandler={this.goToAskCredentialsHandler}/>:
              <AskCredentials goToAskCredentialsHandler = {
                this.goToAskCredentialsHandler
              } />}
                    </div>)
    }
  }
}

export default App;
