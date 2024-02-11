import React, {Component} from "react";

let themes = [
    {
        theme: "A person",
        top1: "Good",
        top10: "Bad",
    },
    {
        theme: "A task",
        top1: "Easy",
        top10: "Hard",
    },
    {
        theme: "A city",
        top1: "Pretty",
        top10: "Ugly",
    }
];
let currentTheme = themes[0];

export class SelectTheme extends Component {
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
                    {themes.map((themeObject, themeIndex) => {
                        return (
                            <tr>
                                <td>
                                    {themeObject.theme}
                                </td>
                                <td>
                                    {themeObject.top1}
                                </td>
                                <td>
                                    {themeObject.top10}
                                </td>
                                <td>
                                    <button onClick={this.props.themeSelectedHandler}>
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


export function CurrentTheme() {
    return (
        <div className="CurrentTheme">
            <table>
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
                        {currentTheme.theme}
                    </td>
                    <td>
                        {currentTheme.top1}
                    </td>
                    <td>
                        {currentTheme.top10}
                    </td>
                </tr>
            </table>
        </div>
    );
}
