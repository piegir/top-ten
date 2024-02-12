import React, {Component} from "react";
import {makeGetCall, makePostCall} from "../common/common";

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
        getCard().then((card) => {
            this.setState({card: card});
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
                <div className="BoxTitle">
                    Select Theme
                </div>
                <table className="ThemesTable">
                    <tr>
                        <td>
                            Theme
                        </td>
                        <td>
                            Top1
                        </td>
                        <td>
                            Top10
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
                                        Select theme {themeIndex + 1}
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
                <div className="BoxTitle">
                    Waiting for {this.props.firstPlayer} to set the theme...
                </div>
            </div>
        );
    }
}


export class CurrentTheme extends Component {

    currentThemeGettingId = setInterval(() => {
        getTheme().then((theme) => {
            this.setState({theme: theme});
            // Get theme until it's not null
            if (theme !== null) {
                clearInterval(this.currentThemeGettingId);
            }
        });
    }, 1000);

    state = {theme: null};

    render() {
        return (
            <div>
                {this.state.theme !== null ?
                    <table className="CurrentTheme">
                        <tr>
                            <th>
                                Theme
                            </th>
                            <th>
                                Top1
                            </th>
                            <th>
                                Top10
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
