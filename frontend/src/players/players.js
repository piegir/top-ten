import './players.css';

export function Players() {
    let playersList = [
        "Player1",
        "Player2",
        "Player3",
        "Player4"
    ]
    let propositions = [
        "Proposition1",
        "Proposition2",
        "Proposition3",
        "Proposition4"
    ]
    return (
        <div className="PlayersBox">
            <table className="PlayersTable">
            <tr>
                <th>
                    Players
                </th>
                <th>
                    Propositions
                </th>
            </tr>
            {playersList.map((playerName, index) => {
                return (
                    <tr>
                        <td>
                            {playerName}
                        </td>
                        <td>
                            {propositions[index]}
                        </td>
                    </tr>
                )
            })}
            </table>
        </div>
    );
}
