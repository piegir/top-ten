import {Component} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import {currentUser, userLogout} from '../authentication/authentication';
import {makeGetCall, makePostCall, repeat} from '../common/common';

import {getGamePlayers} from './utils.js';

function setTempGameConfig(gameConfig) {
  return makePostCall('/game/set_temp_config', gameConfig);
}

function getTempGameOptions() {
  return makeGetCall('/game/get_temp_config').then((gameConfig) => {
    delete gameConfig.players_list;
    return gameConfig;
  });
}

function startGame(gameConfig) {
  return makePostCall('/game/start', gameConfig).then((startGameSuccess) => {
    if (startGameSuccess.status) {
      return makePostCall('/game/start_new_round');
    } else {
      alert(startGameSuccess.message);
      return startGameSuccess;
    }
  });
}

function isGameStarted() {
  return makeGetCall('/game/is_started');
}

function isGameComplete() {
  return makeGetCall('/game/is_game_complete');
}

export class GameSetup extends Component {
  gameOptionsNames = {
    max_nb_rounds: 'Number of rounds',
    starting_player: 'Starting player',
    nb_themes_per_card: 'Number of themes per card',
    themes_language: 'Themes language',
  };

  /**
   * Init game options object filled with null values and using predefined keys.
   * @type {{[p: string]: null}}
   */
  nullGameOptions = Object.keys(this.gameOptionsNames).reduce(
    (obj, key) => Object.assign(obj, {[key]: null}),
    {}
  );
  state = {
    gameOptions: this.nullGameOptions,
    gameStarted: false,
    gameComplete: false,
    firstPlayer: null,
    allowedUser: false,
  };

  componentDidMount() {
    let newState = {...this.state};
    getTempGameOptions().then((gameOptions) => {
      newState.gameOptions = gameOptions;
      isGameStarted().then((gameStarted) => {
        newState.gameStarted = gameStarted;
        if (!gameStarted) {
          // A user is allowed to join if no game is started
          newState.allowedUser = true;
          this.setState(newState);
          return;
        }
        isGameComplete().then((gameComplete) => {
          newState.gameComplete = gameComplete;
          if (gameComplete) {
            // A user is allowed to join if the previous game has been completed
            newState.allowedUser = true;
            this.setState(newState);
            return;
          }
          getGamePlayers().then((playersList) => {
            if (playersList.includes(currentUser.username)) {
              // A user is allowed to join if he is part of the current started
              // game, he is sent to the next step of the game
              newState.allowedUser = true;
              this.setState(newState);
              this.props.goToThemeSelectionHandler();
              return;
            }
            // In any other case, the user is not allowed to join. Log him out
            // and send him back to login page.
            alert('You cannot join a game that you are not part of.');
            userLogout().then((logoutSuccess) => {
              if (logoutSuccess.status) {
                currentUser.username = null;
                currentUser.loggedIn = false;
                this.props.goToAskCredentialsHandler();
              } else {
                alert(logoutSuccess.message);
              }
            });
          });
        });
      });
    });
  }

  /**
   * Repeatedly check for multiple things regarding the game:
   * - Checks if the game has already been started (but not completed), if yes,
   * switch to in-game view
   * - Checks if the current user is the first game user, i.e. if he can edit
   * the game options
   * - Does the live visual update of options for other users
   */
  checkGameStatus = () => {
    if (!this.state.allowedUser) {
      this.gameCheckingId = repeat(this.checkGameStatus, 100);
      return;
    }
    let newState = {...this.state};
    isGameStarted().then((gameStarted) => {
      newState.gameStarted = gameStarted;
      if (gameStarted && !this.state.gameComplete) {
        this.props.goToThemeSelectionHandler();
        return;
      }
      let firstPlayer = this.props.usersList[0];
      newState.firstPlayer = firstPlayer;
      if (firstPlayer === currentUser.username) {
        this.setState(newState);
        this.gameCheckingId = repeat(this.checkGameStatus, 100);
      } else {
        getTempGameOptions().then((gameOptions) => {
          newState.gameOptions = gameOptions;
          this.setState(newState);
          this.gameCheckingId = repeat(this.checkGameStatus, 100);
        });
      }
    });
  };

  gameCheckingId = repeat(this.checkGameStatus, 100);

  componentWillUnmount() {
    clearTimeout(this.gameCheckingId);
  }

  liveUpdateNumberOfRounds = (newValue) => {
    let newState = {...this.state};
    let newGameOptions = {...this.state.gameOptions};
    newGameOptions.max_nb_rounds = newValue;
    newState.gameOptions = newGameOptions;
    this.setState(newState);
    let gameConfig = {...newGameOptions};
    gameConfig.players_list = this.props.usersList;
    setTempGameConfig(gameConfig).then();
  };

  liveUpdateNumberOfThemesPerCard = (newValue) => {
    let newState = {...this.state};
    let newGameOptions = {...this.state.gameOptions};
    newGameOptions.nb_themes_per_card = newValue;
    newState.gameOptions = newGameOptions;
    this.setState(newState);
    let gameConfig = {...newGameOptions};
    gameConfig.players_list = this.props.usersList;
    setTempGameConfig(gameConfig).then();
  };

  liveUpdateStartingPlayer = (newValue) => {
    let newState = {...this.state};
    let newGameOptions = {...this.state.gameOptions};
    newGameOptions.starting_player = newValue;
    newState.gameOptions = newGameOptions;
    this.setState(newState);
    let gameConfig = {...newGameOptions};
    gameConfig.players_list = this.props.usersList;
    setTempGameConfig(gameConfig).then();
  };

  liveUpdateThemesLanguage = (newValue) => {
    let newState = {...this.state};
    let newGameOptions = {...this.state.gameOptions};
    newGameOptions.themes_language = newValue;
    newState.gameOptions = newGameOptions;
    this.setState(newState);
    let gameConfig = {...newGameOptions};
    gameConfig.players_list = this.props.usersList;
    setTempGameConfig(gameConfig).then();
  };

  optionsCallbacks = {
    max_nb_rounds: this.liveUpdateNumberOfRounds,
    starting_player: this.liveUpdateStartingPlayer,
    nb_themes_per_card: this.liveUpdateNumberOfThemesPerCard,
    themes_language: this.liveUpdateThemesLanguage,
  };

  startGameHandler = () => {
    let gameConfig = {...this.state.gameOptions};
    gameConfig.players_list = this.props.usersList;
    startGame(gameConfig).then((startSuccess) => {
      if (startSuccess.status) {
        this.props.goToThemeSelectionHandler();
      } else {
        alert(startSuccess.message);
      }
    });
  };

  optionDropDownMenu = (optionName) => {
    let optionsAvailableValues = {
      max_nb_rounds: Array.from(new Array(9), (x, i) => i + 1),
      starting_player: this.props.usersList,
      nb_themes_per_card: Array.from(new Array(6), (x, i) => i + 1),
      themes_language: ['en', 'fr'],
    };

    return (
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" className="DropDownButton">
          {this.state.gameOptions[optionName]}
        </Dropdown.Toggle>
        <Dropdown.Menu className="DropDownMenu">
          {optionsAvailableValues[optionName].map((availableValue) => {
            return (
              <Dropdown.Item
                className="DropDownItem"
                onClick={() => {
                  this.optionsCallbacks[optionName](availableValue);
                }}
              >
                {availableValue}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  render() {
    if (!this.state.allowedUser) {
      return null;
    }
    return (
      <div className="UserActionBox">
        <div className="SubTitle">
          {this.state.firstPlayer === currentUser.username ? (
            <>Game Preparation</>
          ) : (
            <>{this.state.firstPlayer} is preparing the game...</>
          )}
        </div>
        <div>
          {Object.keys(this.optionsCallbacks).map((optionName) => {
            return (
              <div className="GamePreparationOption">
                <div className="GamePreparationOptionName">
                  {this.gameOptionsNames[optionName]}:
                </div>
                <div className="GamePreparationOptionField">
                  {this.state.firstPlayer === currentUser.username
                    ? this.optionDropDownMenu(optionName)
                    : this.state.gameOptions[optionName]}
                </div>
              </div>
            );
          })}
        </div>
        {this.state.firstPlayer === currentUser.username ? (
          <div className="ButtonBox">
            <button onClick={this.startGameHandler}>Start Game</button>
          </div>
        ) : null}{' '}
      </div>
    );
  }
}
