import './users.css';
import {Component} from "react";
import {makeGetCall, repeat} from "../common/common";



export let getConnectedUsers = () => {
    return makeGetCall("/authentication/get_connected_users");
}

export class Users extends Component {

    state = {usersList: []};

    fetchUser = () => {
        this.props.getUsersListHandler().then((listOfUsers) => {
            this.setState({usersList: listOfUsers});
            if (!this.props.checkOnlyOnce) {
                this.userFetchingId = repeat(this.fetchUser, 100);
            }
        })
    }

    userFetchingId = repeat(this.fetchUser, 100);

    componentWillUnmount() {
        clearTimeout(this.userFetchingId);
    }

    render () {
        return (
            <div className="PlayersBox">
                <div className="SubTitle">
                    Who's playing?
                </div>
                <table className="UsersTable">
                    <tr>
                        <th>
                            Players{this.props.displayNumbers ? ` (${this.state.usersList.length} /10)`: null}
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
