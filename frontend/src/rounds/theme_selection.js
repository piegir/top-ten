import './theme_selection.css'
import "./current_theme.css"

import React, {Component} from "react";
import {makeGetCall, makePostCall, repeat} from "../common/common";

function getCard() {
    return makeGetCall("/rounds/get_card");
}

function setTheme(theme) {
    return makePostCall("/rounds/set_theme", theme);
}

export function getTheme() {
    return makeGetCall("/rounds/get_theme");
}

export class SelectTheme extends Component {

    constructor(props) {
        super(props);
        getTheme().then((theme) => {
            if (theme === null) {
                getCard().then((card) => {
                    this.setState({card: card});
                });
            }
            else {
                this.props.goToPropositionMakingHandler();
            }
        });
    }

    state = {card: [{index: null, title: null, top1: null, top10: null},]};

    setThemeHandler = (theme) => {
        setTheme(theme).then((success) => {
            if (success.status) {
                this.props.goToPropositionMakingHandler();
            } else {
                alert(success.message);
            }
        });
    }

    render() {
        return (
            <div className="UserActionBox">
                <div className="SubTitle">
                    Select a theme
                </div>
                <table className="ThemesTable">
                    <tr>
                        <td>
                            Theme
                        </td>
                        <td>
                            Top 1
                        </td>
                        <td>
                            Top 10
                        </td>
                    </tr>
                    {this.state.card.map((themeObject, themeIndex) => {
                        return (
                            <tr>
                                <td>
                                    {themeObject.title}
                                </td>
                                <td>
                                    {themeObject.top1}
                                </td>
                                <td>
                                    {themeObject.top10}
                                </td>
                                <td>
                                    <button className="LogoutButton" onClick={() => {
                                        this.setThemeHandler(themeObject)
                                    }}>
                                        Select
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
}

export class WaitThemeSelected extends Component {
    render() {
        return (
            <div className="UserActionBox">
                <div className="SubTitle">
                    Waiting for {this.props.firstPlayer} to set the theme...
                </div>
            </div>
        );
    }
}

export class CurrentTheme extends Component {

    state = {theme: null};

    getCurrentTheme = () => {
        getTheme().then((theme) => {
            this.setState({theme: theme});
            if (theme === null) {
                // Get theme until it's not null
                this.currentThemeGettingId = repeat(this.getCurrentTheme, 100);
            }
        });
    }

    currentThemeGettingId = repeat(this.getCurrentTheme, 100);

    componentWillUnmount() {
        clearTimeout(this.currentThemeGettingId);
    }

    render() {
        return (
            <div className="ShowCurrentTheme">
                {this.state.theme !== null ?
                    <table className="CurrentTheme">
                        <tr>
                            <th>
                                Theme
                            </th>
                            <th>
                                Top 1
                            </th>
                            <th>
                                Top 10
                            </th>
                        </tr>
                        <tr>
                            <td>
                                {this.state.theme.title}
                            </td>
                            <td>
                                {this.state.theme.top1}
                            </td>
                            <td>
                                {this.state.theme.top10}
                            </td>
                        </tr>
                    </table> :
                    null}
            </div>
        );
    }
}
