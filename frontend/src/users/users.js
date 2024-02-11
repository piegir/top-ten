import './users.css';
import {Component} from "react";
import {makeGetCall} from "../common/common";



export function getConnectedUsers() {
    return makeGetCall("/authentication/get_connected_users");
}


export class Users extends Component {

    state = {usersList: []};

    userFetchingId = setInterval(() => {
        getConnectedUsers().then((listOfUsers) => {
            this.setState({usersList: listOfUsers});
        })
    }, 1000, []);

    componentWillUnmount() {
        clearInterval(this.userFetchingId);
    }

    render () {
        return (
            <div className="PlayersBox">
                <div className="BoxTitle">
                    Who's playing?
                </div>
                <table className="UsersTable">
                    <tr>
                        <th>
                            Players
                        </th>
                        <th></th>
                    </tr>
                    {this.state.usersList.map((username, index) => {
                        return (
                            <tr>
                                <td>
                                    {username}
                                </td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        );
    }
}
