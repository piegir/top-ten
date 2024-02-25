import './game.css';

import {Component} from 'react';

import {Username} from '../authentication/authentication.js';
import {getConnectedUsers, Users} from '../authentication/users.js';
import {makeGetCall} from '../common/common.js';

import {GameSetup} from './game_start.js';

export let getGamePlayers = () => {
  return makeGetCall('/game/get_players');
};

export class GamePreparation extends Component {
  render() {
    return (
      <div className="GlobalGrid">
        <div className="HeadBox">
          <div className="Title">Top Ten</div>
          <Username
            goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}
          />
        </div>
        <div className="BottomBox">
          <Users
            getUsersListHandler={getConnectedUsers}
            checkOnlyOnce={false}
            displayNumbers={true}
          />
          <GameSetup
            goToThemeSelectionHandler={this.props.goToThemeSelectionHandler}
            goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}
          />
        </div>
      </div>
    );
  }
}
