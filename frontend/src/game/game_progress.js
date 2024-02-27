import './game_progress.css';

import {Component} from 'react';

import {colors, getColorFromScale, makeGetCall} from '../common/common';

function getRoundsHistory() {
  return makeGetCall('/game/get_rounds_history');
}

let status = {
  notStarted: null,
  inProgress: -1,
};

function displayRoundPercentage(rawResult) {
  switch (rawResult) {
    case status.notStarted:
      return <td></td>;
    case status.inProgress:
      return <td>?</td>;
    default:
      let roundResult = Math.round(rawResult * 1000) / 10; // XX.X%
      return (
        <td
          style={{
            color: getColorFromScale({
              value: roundResult,
              beginColor: colors.red,
              endColor: colors.darkGreen,
              middleColor: colors.gold,
            }),
          }}
        >
          {roundResult} %
        </td>
      );
  }
}

export class GameProgress extends Component {
  state = {roundsHistory: []};

  componentDidMount() {
    getRoundsHistory().then((roundsHistory) => {
      this.setState({roundsHistory: roundsHistory});
    });
  }

  render() {
    return (
      <div>
        <table className="GameProgress">
          <tr>
            <td>Round</td>
            {this.state.roundsHistory.map((roundSummary, roundIndex) => {
              return <td>{roundIndex + 1} </td>;
            })}
          </tr>{' '}
          <tr>
            <td>Cap'Ten </td>
            {this.state.roundsHistory.map((roundSummary) => {
              return <td>{roundSummary.capten}</td>;
            })}{' '}
          </tr>
          <tr>
            <td>Status</td>
            {this.state.roundsHistory.map((roundSummary) => {
              return displayRoundPercentage(roundSummary.result);
            })}{' '}
          </tr>
        </table>
      </div>
    );
  }
}

export class GameSummary extends GameProgress {
  render() {
    return (
      <div>
        <table className="GameProgress">
          <tr>
            <td>Round</td>
            <td>Cap'Ten </td>
            <td>Theme</td>
            <td>Status</td>
          </tr>
          {this.state.roundsHistory.map((roundSummary, roundIndex) => {
            return (
              <tr>
                <td>{roundIndex + 1} </td>
                <td>{roundSummary.capten}</td>
                <td>{roundSummary.theme.title} </td>
                {displayRoundPercentage(roundSummary.result)}
              </tr>
            );
          })}{' '}
        </table>
      </div>
    );
  }
}
