import './players.css';

export function Players() {
    let playersList = [
        "Player1",
        "Player2",
        "Player3",
        "Player4",
    ]
    let propositions = [
        "Proposition1",
        "Proposition2",
        "Proposition3",
        "Proposition4",
    ]
    return (
        <div className="PlayersBox">
            <div className="Players">
                <p>Players</p>

                {playersList.map((playerName) => {
                    return (
                        <div>
                            {playerName}
                        </div>
                    )
                })}
            </div>
            <div className="Propositions">
                <p>Propositions</p>

                {propositions.map((proposition) => {
                    return (
                        <div>
                            {proposition}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
