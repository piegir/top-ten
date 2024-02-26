import './game.css';

import {Component} from 'react';

import {Username} from '../authentication/authentication.js';
import {getConnectedUsers, Users} from '../authentication/users.js';
import {repeat} from '../common/common.js';

import {GameSetup} from './game_start.js';

export class GamePreparation extends Component {
  state = {usersList: []};

  fetchUsers = () => {
    getConnectedUsers().then((usersList) => {
      this.setState({usersList: usersList});
      this.userFetchingId = repeat(this.fetchUsers, 100);
    });
  };

  userFetchingId = repeat(this.fetchUsers, 100);

  componentWillUnmount() {
    clearTimeout(this.userFetchingId);
  }
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
          <Users usersList={this.state.usersList} displayNumbers={true} />
          <GameSetup
            usersList={this.state.usersList}
            goToThemeSelectionHandler={this.props.goToThemeSelectionHandler}
            goToAskCredentialsHandler={this.props.goToAskCredentialsHandler}
          />
        </div>
      </div>
    );
  }
}
