import './player_propositions.css';

import {Component} from 'react';

import {currentUser} from '../authentication/authentication';
import {
  getColorFromScale,
  makeGetCall,
  makePostCall,
  repeat,
} from '../common/common';

import {getPlayerPropositions} from './proposition_making.js';
import {getRoundPlayers} from './rounds';
import {currentLanguage, dictionary} from '../common/languages';

function makeHypothesis(hypothesis) {
  return makePostCall('/rounds/make_hypothesis', hypothesis);
}

function checkRoundComplete() {
  return makeGetCall('/rounds/check_round_complete');
}

function setTemporaryHypothesis(hypothesis) {
  return makePostCall('/rounds/set_hypothesis', hypothesis);
}

export function getTemporaryHypothesis() {
  return makeGetCall('/rounds/get_hypothesis');
}

export class MakeHypothesis extends Component {
  propositions = [];
  hypothesis = [];

  state = {updated: false};

  componentDidMount() {
    checkRoundComplete().then((complete) => {
      if (complete) {
        this.props.goToRoundResultsCheckingHandler();
        return;
      }
      getPlayerPropositions().then((playerPropositions) => {
        setTemporaryHypothesis(playerPropositions).then(() => {
          this.propositions = [...playerPropositions];
          this.hypothesis = [...playerPropositions];
          this.setState({updated: true});
        });
      });
    });
  }

  lower = (index) => {
    [this.hypothesis[index + 1], this.hypothesis[index]] = [
      this.hypothesis[index],
      this.hypothesis[index + 1],
    ];
    this.setState({updated: true});
    setTemporaryHypothesis(this.hypothesis).then();
  };

  raise = (index) => {
    [this.hypothesis[index - 1], this.hypothesis[index]] = [
      this.hypothesis[index],
      this.hypothesis[index - 1],
    ];
    this.setState({updated: true});
    setTemporaryHypothesis(this.hypothesis).then();
  };

  row;

  dragStarted = (event) => {
    this.row = event.target;
  };

  dragOver = (event) => {
    let children = Array.from(event.target.parentNode.parentNode.children);
    let beforeIndex = children.indexOf(this.row);
    let afterIndex = children.indexOf(event.target.parentNode);
    if (afterIndex > beforeIndex) {
      for (let index = beforeIndex - 1; index < afterIndex - 1; ++index) {
        this.lower(index);
        event.target.parentNode.after(this.row);
      }
    } else if (afterIndex < beforeIndex) {
      for (let index = beforeIndex - 1; index > afterIndex - 1; --index) {
        this.raise(index);
        event.target.parentNode.before(this.row);
      }
    }
  };

  makeHypothesisHandler = () => {
    makeHypothesis(this.hypothesis).then((success) => {
      if (success.status) {
        this.props.goToRoundResultsCheckingHandler();
      } else {
        alert(success.message);
      }
    });
  };

  render() {
    if (!this.state.updated) {
      return <div className="UserActionBox"></div>;
    }
    return (
      <div className="UserActionBox">
        <div className="SubTitle">
          {dictionary.makeHypothesis[currentLanguage.language]}
        </div>
        <table className="PlayerPropositionsTable">
          <tr>
            <th>{dictionary.players[currentLanguage.language]}</th>
            <th>Propositions</th>
          </tr>
          {this.propositions.map((proposition) => {
            let propHypIndex = this.hypothesis.indexOf(proposition);
            return (
              <tr
                draggable={true}
                onDragStart={this.dragStarted}
                onDragOver={this.dragOver}
                style={{
                  cursor: 'all-scroll',
                  'background-color': getColorFromScale({
                    value: propHypIndex,
                    minValue: 0,
                    maxValue: this.propositions.length - 1,
                    opacity: 0.5,
                  }),
                }}
              >
                <td>{proposition.player} </td>
                <td>{proposition.proposition}</td>
              </tr>
            );
          })}
        </table>
        <div className="ButtonBox">
          <button onClick={this.makeHypothesisHandler}>
            {dictionary.submit[currentLanguage.language]}
          </button>
        </div>
      </div>
    );
  }
}

export class WaitHypothesisMade extends Component {
  hypothesis = [];
  state = {updated: false};

  checkHypothesisMade = () => {
    checkRoundComplete().then((complete) => {
      if (complete) {
        this.props.goToRoundResultsCheckingHandler();
        return;
      }
      getTemporaryHypothesis().then((hypothesis) => {
        this.hypothesis = hypothesis;
        this.setState({updated: true});
        this.hypothesisMadeCheckingId = repeat(this.checkHypothesisMade, 100);
      });
    });
  };

  hypothesisMadeCheckingId = repeat(this.checkHypothesisMade, 100);

  componentWillUnmount() {
    clearTimeout(this.hypothesisMadeCheckingId);
  }

  render() {
    if (!this.state.updated) {
      return <div className="UserActionBox"></div>;
    }
    return (
      <div className="UserActionBox">
        <div className="SubTitle">
          {this.props.firstRoundPlayer +
            dictionary.isMakingHypothesis[currentLanguage.language]}
        </div>
        <table className="PlayerPropositionsTable">
          <tr>
            <th>{dictionary.players[currentLanguage.language]}</th>
            <th>Propositions</th>
          </tr>
          {this.hypothesis.map((proposition, index) => {
            return (
              <tr
                style={{
                  'background-color': getColorFromScale({
                    value: index,
                    minValue: 0,
                    maxValue: this.hypothesis.length - 1,
                    opacity: 0.5,
                  }),
                }}
              >
                <td>{proposition.player}</td>
                <td>{proposition.proposition} </td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}
