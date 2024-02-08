import './users.css';


let usersList = [
    "Player1",
    "Player2",
    "Player3",
    "Player4",
    "Player1",
    "Player2",
    "Player3",
    "Player4",
    "Player1",
    "Player2"
]

export function Users() {
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
            {usersList.map((username, index) => {
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
