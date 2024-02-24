import "./player_propositions.css"

import {Component} from "react";

import {currentUser} from "../authentication/authentication";
import {
  colors,
  getColorFromScale,
  makeGetCall,
  makePostCall,
  repeat
} from "../common/common";

function getUserNumber() { return makeGetCall("/rounds/get_number"); }

function setPlayerProposition(proposition) {
  return makePostCall("/rounds/set_player_proposition",
                      {proposition : proposition});
}

export function getPlayerPropositions() {
  return makeGetCall("/rounds/get_player_propositions");
}

export class CurrentUserNumber extends Component {

  state = {topNumber : null};

  componentDidMount() {
    getUserNumber().then(
        (topNumber) => { this.setState({topNumber : topNumber}); });
  }

  render() {
    return (
        <div><p className = "ShowCurrentUserNumber">Your Top Number: <br />
        <span className = "CurrentUserNumber" style = {
          {
            color: getColorFromScale({
              value : this.state.topNumber,
              minValue : 1,
              maxValue : 10,
              middleColor : colors.gold
            })
          }
        }>{this.state.topNumber} < /span>
                </p >
        </div>
        )
    }
}

export class PlayerPropositions extends Component {

    state = {playerPropositions: []};

    checkPlayerTurn = () => {
        getPlayerPropositions().then((playerPropositions) => {
            this.setState({playerPropositions: playerPropositions});
            if (!this.props.checkOnlyOnce) {
                this.isPlayerTurnCheckingId = repeat(this.checkPlayerTurn, 100);
            }
        });
    }

    isPlayerTurnCheckingId = repeat(this.checkPlayerTurn, 100);

    componentWillUnmount() {
        clearTimeout(this.isPlayerTurnCheckingId);
    }

    render () {
        return (
            <div className="PlayersBox">
                <div className="SubTitle">
                    Player Propositions
                </div>
        <table className = "PlayerPropositionsTable"><tr><th>Players<
            /th>
                        <th>
                            Propositions
                        </th>
        </tr>
                    {this.state.playerPropositions.map((playerProposition) => {
                        return (
                            <tr>
                                <td>
                                    {playerProposition.player}
                                </td>
        <td>{playerProposition.proposition} <
        /td>
                            </tr >)
  })
}
                </table>
            </div>
        );
                }
                }

                export class MakeProposition extends Component {

                  state = {proposition : null, propositionMade: false}

                  liveUpdateProposition =
                      (event) => {
                        this.setState({
                          proposition : event.target.value,
                          propositionMade : this.state.propositionMade
                        });
                      }

                  makePropositionHandler =
                      () => {
                        setPlayerProposition(this.state.proposition)
                            .then((success) => {
                              if (success.status) {
                                this.setState({
                                  proposition : this.state.proposition,
                                  propositionMade : true
                                });
                              } else {
                                alert(success.message);
                              }
                            });
                      }

                  render() {
        return (
            <div className="UserActionBox">
                {this.state.propositionMade ?
                    null:
                    <>
                        <div className="SubTitle">
                            {this.props.currentPlayer === currentUser.username ?
                                <>Make your proposition</>:
                                <>Prepare your proposition</>
                            }
                        </div>
                        <div className="PropositionMaking">
                        <textarea autoFocus={true} onChange={this.liveUpdateProposition} cols="50" rows="7"></textarea>
                        </div>
                    </>
                }
                <div className="ButtonBox">
                    {this.props.currentPlayer === currentUser.username ?
                    <button onClick={this.makePropositionHandler} className="UserActionButton">
                        Submit
                    </button>:
                        <div className="SubTitle">
                            Waiting for {this.props.currentPlayer} to make a proposition...
                        </div>
                    }
                </div>
            </div>
        );
                  }
                }
