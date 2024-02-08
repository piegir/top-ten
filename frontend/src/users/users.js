import './users.css';


let usersList = [
    "Player1",
    "Player2",
    "Player3",
    "Player4"
]

export function Users() {
    return (
        <div className="PlayersBox">
            <div className="BoxTitle">
                Users
            </div>
            <table className="UsersTable">
            <tr>
                <th>
                    Players
                </th>
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
