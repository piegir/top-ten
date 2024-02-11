let roundHistory = [
    1,
    2,
    1,
    0,
    null,
    null,
    null,
];

export function GameProgress() {
    return (
        <div>
            <table className="GameProgress">
                <tr>
                    <td>
                        Round
                    </td>
                    {roundHistory.map((roundStatus, roundIndex) => {
                        return (
                            <td>
                                {roundIndex + 1}
                            </td>
                        )
                    })}
                </tr>
                <tr>
                    <td>
                        Status
                    </td>
                    {roundHistory.map((roundStatus, roundIndex) => {
                        switch (roundStatus) {
                            case null:
                                return (
                                    <td>

                                    </td>
                                );
                            case 0:
                                return (
                                    <td>
                                        ?
                                    </td>
                                );
                            case 1:
                                return (
                                    <td style={{color: "green"}}>
                                        W
                                    </td>
                                );
                            case 2:
                                return (
                                    <td style={{color: "red"}}>
                                        L
                                    </td>
                                );

                        }
                    })}
                </tr>
            </table>
        </div>
    )
}
