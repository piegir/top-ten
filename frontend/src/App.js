import './App.css';
import {Component} from "react";
import {LoginSignup, Username} from "./authentication/authentication.js";
import {Users} from "./users/users.js"
import {GameSetup, StartRound, roundStarted, GameProgress} from "./game/game.js"
import {
    CurrentUserNumber,
    PlayerPropositions,
    SelectTheme,
    CurrentTheme,
    MakeProposition,
    MakeHypothesis,
    PlayerNumberedPropositions,
    CheckResults
} from "./rounds/rounds"


class AskCredentials extends Component {
    render() {
        return (
            <div className="App">
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                </div>
                <LoginSignup handler={() => {
                    this.props.handler();
                }}/>
            </div>

        );
    }
}

class GamePreparation extends Component {
    render() {
        return (
            <div className="App">
                <Username/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <GameSetup handler={() => {
                        this.props.handler();
                    }}/>
                </div>
            </div>

        );
    }
}

class RoundStarting extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <StartRound handler={() => {
                        this.props.handler();
                    }}/>
                </div>
            </div>

        );
    }
}

class ThemeSelection extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <Users/>
                    <SelectTheme handler={() => {
                        this.props.handler();
                    }}/>
                </div>
            </div>

        );
    }
}

class WaitThemeSelection extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <CurrentUserNumber/>
                    <Users/>
                    <div className="UserActionBox"/>
                </div>
            </div>

        );
    }
}

class PropositionMaking extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username/>
                <CurrentUserNumber/>
                <CurrentTheme/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <PlayerPropositions/>
                    <MakeProposition handler={() => {
                        this.props.handler();
                    }}/>
                </div>
            </div>

        );
    }
}

class WaitPropositionMaking extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username/>
                <CurrentUserNumber/>
                <CurrentTheme/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <PlayerPropositions/>
                    <div className="UserActionBox"/>
                </div>
            </div>

        );
    }
}

class HypothesisMaking extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username/>
                <CurrentUserNumber/>
                <CurrentTheme/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <PlayerPropositions/>
                    <MakeHypothesis handler={() => {
                        this.props.handler();
                    }}/>
                </div>
            </div>

        );
    }
}

class ResultsChecking extends Component {
    render() {
        return (
            <div className="App">
                <GameProgress/>
                <Username/>
                <CurrentUserNumber/>
                <CurrentTheme/>
                <div className="Grid">
                    <div className="Title">
                        Top Ten
                    </div>
                    <PlayerNumberedPropositions/>
                    <CheckResults handler={() => {
                        this.props.handler();
                    }}/>
                </div>
            </div>

        );
    }
}

let views = {
    AskCredentials: 0,
    GamePreparation: 1,
    RoundStarting: 2,
    ThemeSelection: 3,
    WaitThemeSelection: 4,
    PropositionMaking: 5,
    WaitPropositionMaking: 6,
    HypothesisMaking: 7,
    ResultsChecking: 8,
}


class App extends Component {
    state = {view: views.AskCredentials};

    goToGamePreparation = () => {
        this.setState({view: views.GamePreparation});
    };

    goToRoundStarting = () => {
        this.setState({view: views.RoundStarting});
    };

    goToThemeSelection = () => {
        this.setState({view: views.ThemeSelection});
    };

    goToWaitThemeSelection = () => {
        this.setState({view: views.WaitThemeSelection});
    };

    goToPropositionMaking = () => {
        this.setState({view: views.PropositionMaking});
    };

    goToWaitPropositionMaking = () => {
        this.setState({view: views.WaitPropositionMaking});
    };

    goToHypothesisMaking = () => {
        this.setState({view: views.HypothesisMaking});
    };

    goToResultsChecking = () => {
        this.setState({view: views.ResultsChecking});
    };

    render() {
        switch (this.state.view) {
            case views.AskCredentials:
                return (
                    <AskCredentials handler={() => {
                        this.goToGamePreparation();
                    }}/>
                )
            case views.GamePreparation:
                return (
                    <GamePreparation handler={() => {
                        this.goToRoundStarting();
                    }}/>
                )
            case views.RoundStarting:
                return (
                    <RoundStarting handler={() => {
                        this.goToThemeSelection();
                    }}/>
                )
            case views.ThemeSelection:
                return (
                    <ThemeSelection handler={() => {
                        this.goToPropositionMaking();
                    }}/>
                )
            case views.WaitThemeSelection:
                return (
                    <WaitThemeSelection handler={() => {
                        this.goToPropositionMaking();
                    }}/>
                )
            case views.PropositionMaking:
                return (
                    <PropositionMaking handler={() => {
                        this.goToHypothesisMaking();
                    }}/>
                )
            case views.WaitPropositionMaking:
                return (
                    <WaitPropositionMaking handler={() => {
                        this.goToHypothesisMaking();
                    }}/>
                )
            case views.HypothesisMaking:
                return (
                    <HypothesisMaking handler={() => {
                        this.goToResultsChecking();
                    }}/>
                )
            case views.ResultsChecking:
                return (
                    <ResultsChecking handler={() => {
                        this.goToRoundStarting();
                    }}/>
                )
            default:
                return (
                    <GamePreparation handler={() => {
                        this.goToRoundStarting();
                    }}/>
                )
        }
    }
}

export default App;
