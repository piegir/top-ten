import './language.css';
import {Component} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export let languages = {
  en: 'en',
  fr: 'fr',
};

export let currentLanguage = {
  language: languages.en,
};

export let dictionary = {
  askUsername: {
    en: 'Choose a username: ',
    fr: 'Choisissez un pseudo : ',
  },
  login: {
    en: 'Login',
    fr: 'Connexion',
  },
  logout: {
    en: 'Logout',
    fr: 'Déconnexion',
  },
  confirmLogout: {
    en: 'Are you sure you want to logout?',
    fr: 'Voulez-vous vraiment vous déconnecter ?',
  },
  cannotJoin: {
    en: 'You cannot join a game that you are not part of.',
    fr: "Vous ne pouvez pas rejoindre une partie en cours si vous n'en faites pas partie.",
  },
  whoPlaying: {
    en: "Who's playing?",
    fr: 'Qui joue ?',
  },
  players: {
    en: 'Players',
    fr: 'Joueurs',
  },
  gamePreparation: {
    en: 'Game Preparation',
    fr: 'Préparation de la Partie',
  },
  isPreparingGame: {
    en: ' is preparing the game...',
    fr: ' prépare la partie...',
  },
  max_nb_rounds: {
    en: 'Number of rounds: ',
    fr: 'Nombre de tours : ',
  },
  starting_player: {
    en: "Cap'Ten: ",
    fr: "Cap'Ten : ",
  },
  nb_themes_per_card: {
    en: 'Number of themes per card: ',
    fr: 'Nombre de thèmes par carte : ',
  },
  themes_language: {
    en: 'Themes language: ',
    fr: 'Langue des thèmes : ',
  },
  startGame: {
    en: 'Start game',
    fr: 'Démarrer',
  },
  playerPropositions: {
    en: 'Player propositions',
    fr: 'Propositions des joueurs',
  },
  yourTop: {
    en: 'Your Top: ',
    fr: 'Ton Top : ',
  },
  round: {
    en: 'Round',
    fr: 'Tour',
  },
  result: {
    en: 'Result',
    fr: 'Résultat',
  },
  selectATheme: {
    en: 'Select a theme',
    fr: 'Choisis un thème',
  },
  theme: {
    en: 'Theme',
    fr: 'Thème',
  },
  select: {
    en: 'Select',
    fr: 'Choisir',
  },
  isSelectingTheme: {
    en: ' is selecting the theme...',
    fr: ' est en train de choisir le thème...',
  },
  makeProposition: {
    en: 'Make your proposition',
    fr: 'Fais ta proposition',
  },
  prepareProposition: {
    en: 'Prepare your proposition',
    fr: 'Prépare ta proposition',
  },
  submit: {
    en: 'Submit',
    fr: 'Valider',
  },
  isMakingProposition: {
    en: ' is making a proposition...',
    fr: ' est en train de faire sa proposition...',
  },
  makeHypothesis: {
    en: 'Make your hypothesis by dragging rows',
    fr: 'Fais ton hypothèse en déplaçant les lignes',
  },
  isMakingHypothesis: {
    en: ' is making a hypothesis...',
    fr: ' est en train de faire son hypothèse...',
  },
  roundResult: {
    en: 'Round result: ',
    fr: 'Résultat du tour : ',
  },
  reality: {
    en: 'Reality',
    fr: 'Réalité',
  },
  hypothesis: {
    en: 'Hypothesis',
    fr: 'Hypothèse',
  },
  startNewRound: {
    en: 'Start a new round',
    fr: 'Démarrer un nouveau tour',
  },
  viewGameResults: {
    en: 'View game results',
    fr: 'Voir les résultats de la partie',
  },
  newGameQuestion: {
    en: 'New game?',
    fr: 'Nouvelle partie ?',
  },
  newGame: {
    en: 'New game',
    fr: 'Nouvelle partie',
  },
};

export class SelectLanguage extends Component {
  render() {
    return (
      <div className="LanguageSelection">
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic" className="DropDownButton">
            {currentLanguage.language.toUpperCase()}
          </Dropdown.Toggle>
          <Dropdown.Menu className="DropDownMenu">
            {Object.keys(languages).map((language) => {
              return (
                <Dropdown.Item
                  className="DropDownItem"
                  onClick={() => {
                    this.props.switchLanguageHandler(language);
                  }}
                >
                  {language.toUpperCase()}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}
