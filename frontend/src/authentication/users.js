import './users.css';

import {Component} from 'react';

import {makeGetCall} from '../common/common';
import {currentLanguage, languagesDictionaries} from '../common/languages';

export let getConnectedUsers = () => {
  return makeGetCall('/authentication/get_connected_users');
};

export class Users extends Component {
  render() {
    return (
      <div className="PlayersBox">
        <div className="SubTitle">
          {languagesDictionaries.whoPlaying[currentLanguage.language]}
        </div>
        <table className="UsersTable">
          <tr>
            <th>
              {languagesDictionaries.players[currentLanguage.language]}{' '}
              {this.props.displayNumbers ? (
                <span style={{fontSize: '1vw'}}>
                  ({this.props.usersList.length} /10)
                </span>
              ) : null}
            </th>
            <th></th>
          </tr>
          {this.props.usersList.map((username) => {
            return (
              <tr>
                <td>{username}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}
