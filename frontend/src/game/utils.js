import {makeGetCall} from '../common/common';

export let getGamePlayers = () => {
  return makeGetCall('/game/get_players');
};
