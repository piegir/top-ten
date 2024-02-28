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

export let languagesDictionaries = {
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
    fr: 'Voulez-vous vraiment vous déconnecter?',
  },
  cannotJoin: {
    en: 'You cannot join a game that you are not part of.',
    fr: "Vous ne pouvez pas rejoindre une partie en cours si vous n'en faites pas partie.",
  },
  whoPlaying: {
    en: "Who's playing?",
    fr: 'Qui joue?',
  },
  players: {
    en: 'Players',
    fr: 'Joueurs',
  },
  gamePreparation: {
    en: 'Game Preparation',
    fr: 'Préparation de la Partie',
  },
  isPreparing: {
    en: 'is preparing the game...',
    fr: 'prépare la partie...',
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
