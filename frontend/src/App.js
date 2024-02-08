import './App.css';
import {Component} from "react";
import {Username} from "./authentication/authentication.js";
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


class GamePreparation extends Component {
    render () {
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
    render () {
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
    render () {
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
    render () {
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
    render () {
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
    render () {
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
    render () {
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
    render () {
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
    GamePreparation: 0,
    RoundStarting: 1,
    ThemeSelection: 2,
    WaitThemeSelection: 3,
    PropositionMaking: 4,
    WaitPropositionMaking: 5,
    HypothesisMaking: 6,
    ResultsChecking: 7,
}


class App extends Component {
    state = {view: views.GamePreparation};

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
        return (
            <div>
            {this.state.view === views.GamePreparation ?
                <GamePreparation handler={() => {
                    this.goToRoundStarting();
                }}/>
                : this.state.view === views.RoundStarting ?
                    <RoundStarting handler={() => {
                        this.goToThemeSelection();
                    }}/>
                    : this.state.view === views.ThemeSelection ?
                        <ThemeSelection handler={() => {
                            this.goToPropositionMaking();
                        }}/>
                        : this.state.view === views.WaitThemeSelection ?
                            <WaitThemeSelection handler={() => {
                                this.goToPropositionMaking();
                            }}/>
                            : this.state.view === views.PropositionMaking ?
                                <PropositionMaking handler={() => {
                                    this.goToHypothesisMaking();
                                }}/>
                                : this.state.view === views.WaitPropositionMaking ?
                                    <WaitPropositionMaking handler={() => {
                                        this.goToHypothesisMaking();
                                    }}/>
                                    : this.state.view === views.HypothesisMaking ?
                                        <HypothesisMaking handler={() => {
                                            this.goToResultsChecking();
                                        }}/>
                                        : this.state.view === views.ResultsChecking ?
                                            <ResultsChecking handler={() => {
                                                this.goToRoundStarting();
                                            }}/>
                                            : <GamePreparation handler={() => {
                                                this.goToRoundStarting();
                                            }}/>
            }
            </div>
        )
    }
}

export default App;
