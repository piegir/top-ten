import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {Component} from 'react';

import {
  AskCredentials,
  currentUser,
  userLogout,
} from './authentication/authentication.js';
import {wait} from './common/common.js';
import {GamePreparation} from './game/game.js';
import {GameResultChecking, RoundResultChecking} from './results/results.js';
import {
  HypothesisMaking,
  PropositionMaking,
  ThemeSelection,
} from './rounds/rounds.js';
import {currentLanguage} from './common/languages';

let views = {
  AskCredentials: 0,
  GamePreparation: 1,
  ThemeSelection: 2,
  PropositionMaking: 3,
  HypothesisMaking: 4,
  RoundResultChecking: 5,
  GameResultChecking: 6,
};

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

  view = views.AskCredentials;

  state = {updated: false};

  /// Logic Handlers
  switchLanguageHandler = (language) => {
    currentLanguage.language = language;
    this.setState({updated: true});
  };

  goToGamePreparationHandler = () => {
    this.view = views.GamePreparation;
    this.setState({updated: true});
  };

  goToAskCredentialsHandler = () => {
    this.view = views.AskCredentials;
    this.setState({updated: true});
  };

  goToThemeSelectionHandler = () => {
    this.view = views.ThemeSelection;
    this.setState({updated: true});
  };

  goToPropositionMakingHandler = () => {
    this.view = views.PropositionMaking;
    this.setState({updated: true});
  };

  goToHypothesisMakingHandler = () => {
    this.view = views.HypothesisMaking;
    this.setState({updated: true});
  };

  goToRoundResultsCheckingHandler = () => {
    this.view = views.RoundResultChecking;
    this.setState({updated: true});
  };

  goToGameResultsCheckingHandler = () => {
    this.view = views.GameResultChecking;
    this.setState({updated: true});
  };

  render() {
    switch (this.view) {
      case views.AskCredentials:
        return (
          <AskCredentials
            switchLanguageHandler={this.switchLanguageHandler}
            goToGamePreparationHandler={this.goToGamePreparationHandler}
          />
        );
      case views.GamePreparation:
        return (
          <GamePreparation
            switchLanguageHandler={this.switchLanguageHandler}
            goToThemeSelectionHandler={this.goToThemeSelectionHandler}
            goToAskCredentialsHandler={this.goToAskCredentialsHandler}
          />
        );
      case views.ThemeSelection:
        return (
          <ThemeSelection
            switchLanguageHandler={this.switchLanguageHandler}
            goToPropositionMakingHandler={this.goToPropositionMakingHandler}
            goToAskCredentialsHandler={this.goToAskCredentialsHandler}
          />
        );
      case views.PropositionMaking:
        return (
          <PropositionMaking
            switchLanguageHandler={this.switchLanguageHandler}
            goToHypothesisMakingHandler={this.goToHypothesisMakingHandler}
            goToAskCredentialsHandler={this.goToAskCredentialsHandler}
          />
        );
      case views.HypothesisMaking:
        return (
          <HypothesisMaking
            switchLanguageHandler={this.switchLanguageHandler}
            goToRoundResultsCheckingHandler={
              this.goToRoundResultsCheckingHandler
            }
            goToAskCredentialsHandler={this.goToAskCredentialsHandler}
          />
        );
      case views.RoundResultChecking:
        return (
          <RoundResultChecking
            switchLanguageHandler={this.switchLanguageHandler}
            goToThemeSelectionHandler={this.goToThemeSelectionHandler}
            goToGameResultsCheckingHandler={this.goToGameResultsCheckingHandler}
            goToAskCredentialsHandler={this.goToAskCredentialsHandler}
          />
        );
      case views.GameResultChecking:
        return (
          <GameResultChecking
            switchLanguageHandler={this.switchLanguageHandler}
            goToGamePreparationHandler={this.goToGamePreparationHandler}
            goToAskCredentialsHandler={this.goToAskCredentialsHandler}
          />
        );
      default:
        return (
          <div>
            {currentUser.username !== null ? (
              <GamePreparation
                switchLanguageHandler={this.switchLanguageHandler}
                goToThemeSelectionHandler={this.goToThemeSelectionHandler}
                goToAskCredentialsHandler={this.goToAskCredentialsHandler}
              />
            ) : (
              <AskCredentials
                switchLanguageHandler={this.switchLanguageHandler}
                goToAskCredentialsHandler={this.goToAskCredentialsHandler}
              />
            )}
          </div>
        );
    }
  }
}

export default App;
