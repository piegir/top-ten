import './users.css';

import {Component} from 'react';

import {makeGetCall, repeat} from '../common/common';

export let getConnectedUsers = () => {
  return makeGetCall('/authentication/get_connected_users');
};

export class Users extends Component {
  render() {
    return (
      <div className="PlayersBox">
        <div className="SubTitle">Who's playing?</div>
        <table className="UsersTable">
          <tr>
            <th>
              Players{' '}
              {this.props.displayNumbers ? (
                <span style={{fontSize: '1vw'}}>
                  ({this.props.usersList.length} /10)
                </span>
              ) : null}
            </th>
            <th></th>
          </tr>
          {this.props.usersList.map((username, index) => {
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
