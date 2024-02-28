import './rounds.css';

import {Component} from 'react';

import {currentUser, Username} from '../authentication/authentication.js';
import {Users} from '../authentication/users.js';
import {makeGetCall, repeat} from '../common/common.js';
import {GameProgress} from '../game/game_progress.js';

import {MakeHypothesis, WaitHypothesisMade} from './hypothesis_making.js';
import {
  CurrentUserNumber,
  MakeProposition,
  PlayerPropositions,
} from './proposition_making.js';
import {
  CurrentTheme,
  getTheme,
  SelectTheme,
  WaitThemeSelected,
} from './theme_selection.js';
import {SelectLanguage} from '../common/languages';

export let getRoundPlayers = () => {
  return makeGetCall('/rounds/get_players');
};

function getCurrentPlayer() {
  return makeGetCall('/rounds/get_current_player');
}

function checkAllPropositionsMade() {
  return makeGetCall('/rounds/check_all_propositions_made');
}

export class ThemeSelection extends Component {
  state = {
    firstRoundPlayer: null,
    playersList: [],
  };

  componentDidMount() {
    getRoundPlayers().then((playersList) => {
      let firstRoundPlayer = playersList[0];
      this.setState({
        firstRoundPlayer: firstRoundPlayer,
        playersList: playersList,
      });
      if (firstRoundPlayer !== currentUser.username) {
        this.props.goToPropositionMakingHandler();
      }
    });
  }

  render() {
    return (
      <div className="GlobalGrid">
        <div className="HeadBox">
          <SelectLanguage
            switchLanguageHandler={this.props.switchLanguageHandler}
          />
          <div className="Title">Top Ten</div>
          <Username
            goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}
          />
        </div>
        <div className="MiddleBox">
          {this.state.firstRoundPlayer === currentUser.username ? null : (
            <CurrentUserNumber />
          )}
          <div className="GameProgressBox">
            <GameProgress />
          </div>
        </div>
        <div className="BottomBox">
          <Users usersList={this.state.playersList} displayNumbers={false} />
          {this.state.firstRoundPlayer === currentUser.username ? (
            <SelectTheme
              goToPropositionMakingHandler={
                this.props.goToPropositionMakingHandler
              }
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export class PropositionMaking extends Component {
  theme = null;
  firstRoundPlayer = null;
  currentPlayer = null;

  state = {
    updated: false,
  };

  componentDidMount() {
    getRoundPlayers().then((playersList) => {
      this.firstRoundPlayer = playersList[0];
      this.setState({updated: true});
    });
  }

  getCurrentTheme = () => {
    getTheme().then((theme) => {
      if (theme === null) {
        // Get theme until it's not null
        this.currentThemeGettingId = repeat(this.getCurrentTheme, 100);
      } else {
        this.theme = theme;
        this.setState({updated: true});
      }
    });
  };

  currentThemeGettingId = repeat(this.getCurrentTheme, 100);

  checkTurnStatus = () => {
    checkAllPropositionsMade().then((allPropositionsMade) => {
      if (allPropositionsMade) {
        this.props.goToHypothesisMakingHandler();
        return;
      }
      getCurrentPlayer().then((currentPlayer) => {
        this.currentPlayer = currentPlayer;
        this.setState({updated: true});
        this.turnStatusCheckingId = repeat(this.checkTurnStatus, 100);
      });
    });
  };

  turnStatusCheckingId = repeat(this.checkTurnStatus, 100);

  componentWillUnmount() {
    clearTimeout(this.currentThemeGettingId);
    clearTimeout(this.turnStatusCheckingId);
  }

  render() {
    return (
      <div className="GlobalGrid">
        <div className="HeadBox">
          <SelectLanguage
            switchLanguageHandler={this.props.switchLanguageHandler}
          />
          <div className="Title">Top Ten</div>
          <Username
            goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}
          />
        </div>
        <div className="MiddleBox">
          <CurrentUserNumber />
          <div className="GameProgressBox">
            <GameProgress />
          </div>
          <CurrentTheme />
        </div>
        <div className="BottomBox">
          <PlayerPropositions />
          {this.theme === null ? (
            <WaitThemeSelected firstRoundPlayer={this.firstRoundPlayer} />
          ) : (
            <MakeProposition currentPlayer={this.currentPlayer} />
          )}
        </div>
      </div>
    );
  }
}

export class HypothesisMaking extends Component {
  state = {firstRoundPlayer: null};

  componentDidMount() {
    getRoundPlayers().then((playersList) => {
      this.setState({firstRoundPlayer: playersList[0]});
    });
  }
  render() {
    return (
      <div className="GlobalGrid">
        <div className="HeadBox">
          <SelectLanguage
            switchLanguageHandler={this.props.switchLanguageHandler}
          />
          <div className="Title">Top Ten</div>
          <Username
            goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}
          />
        </div>
        <div className="MiddleBox">
          <CurrentUserNumber />
          <div className="GameProgressBox">
            <GameProgress />
          </div>
          <CurrentTheme />
        </div>
        <div className="BottomBox">
          <PlayerPropositions checkOnlyOnce={true} displayNumbers={false} />
          {this.state.firstRoundPlayer === currentUser.username ? (
            <MakeHypothesis
              goToRoundResultsCheckingHandler={
                this.props.goToRoundResultsCheckingHandler
              }
            />
          ) : (
            <WaitHypothesisMade
              firstRoundPlayer={this.state.firstRoundPlayer}
              goToRoundResultsCheckingHandler={
                this.props.goToRoundResultsCheckingHandler
              }
            />
          )}
        </div>
      </div>
    );
  }
}
