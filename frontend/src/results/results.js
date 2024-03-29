import {Component} from 'react';

import {Username} from '../authentication/authentication.js';
import {Users} from '../authentication/users';
import {makeGetCall, repeat} from '../common/common.js';
import {getGamePlayers} from '../game/utils.js';
import {GameProgress, GameSummary} from '../game/game_progress.js';
import {CurrentTheme} from '../rounds/theme_selection.js';

import {Hypothesis, Reality, RoundResult} from './round_result.js';
import {currentLanguage, dictionary, SelectLanguage} from '../common/languages';

function checkRoundResult() {
  return makeGetCall('/rounds/check_round_result');
}

export class RoundResultChecking extends Component {
  state = {
    result: null,
    hypothesis: null,
    reality: null,
  };

  componentDidMount() {
    checkRoundResult().then((roundResult) => {
      this.setState(roundResult);
    });
  }

  checkRoundStarted = () => {
    makeGetCall('/game/is_round_in_progress').then((inProgress) => {
      if (inProgress) {
        this.props.goToThemeSelectionHandler();
      } else {
        this.roundStartedCheckingId = repeat(this.checkRoundStarted, 100);
      }
    });
  };

  roundStartedCheckingId = repeat(this.checkRoundStarted, 100);

  componentWillUnmount() {
    clearTimeout(this.roundStartedCheckingId);
  }

  render() {
    if (this.state.result === null) {
      return null;
    }
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
          <div className="GameProgressBox">
            <GameProgress />
          </div>
          <CurrentTheme />
          <RoundResult result={this.state.result} />
        </div>
        <div className="BottomBox">
          <Reality reality={this.state.reality} />
          <Hypothesis
            hypothesis={this.state.hypothesis}
            reality={this.state.reality}
            goToThemeSelectionHandler={this.props.goToThemeSelectionHandler}
            goToGameResultsCheckingHandler={
              this.props.goToGameResultsCheckingHandler
            }
          />
        </div>
      </div>
    );
  }
}

export class GameResultChecking extends Component {
  state = {playersList: []};

  componentDidMount() {
    getGamePlayers().then((playersList) => {
      this.setState({playersList: playersList});
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
          <div className="CenteredGameProgressBox">
            <GameSummary />
          </div>
        </div>
        <div className="BottomBox">
          <Users usersList={this.state.playersList} displayNumbers={false} />
          <div className="UserActionBox">
            <div className="SubTitle">
              {dictionary.newGameQuestion[currentLanguage.language]}
            </div>
            <div className="ButtonBox">
              <button onClick={this.props.goToGamePreparationHandler}>
                {dictionary.newGame[currentLanguage.language]}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
