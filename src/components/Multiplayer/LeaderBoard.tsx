import React, { useEffect, useState } from 'react'
import { Heading2 } from '@entur/typography'
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    DataCell,
    HeaderCell,
} from '@entur/table'
import '@entur/table/dist/styles.css'
import {
    getPlayerScoreTopTenOverall,
    PlayerResponse,
} from '../../api/playerScoreApi'

export const LeaderBoard = (): JSX.Element => {
    const [players, setPlayers] = useState<PlayerResponse[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPlayerScoreTopTenOverall()
            setPlayers(data)
        }

        fetchData()
    }, [])
    if (players === undefined) {
        return <p>Laster inn...</p>
    }
    return (
        <>
            <Heading2>Poengtavle</Heading2>
            <div className="leaderboard">
                <Table>
                    <TableHead>
                        <TableRow>
                            <HeaderCell>Rank</HeaderCell>
                            <HeaderCell>Navn</HeaderCell>
                            <HeaderCell>Poengsum</HeaderCell>
                            <HeaderCell>Vanskelighetsgrad</HeaderCell>
                            <HeaderCell>Spillertrekk</HeaderCell>
                            <HeaderCell>Total reisetid</HeaderCell>
                            <HeaderCell>Total spilletid</HeaderCell>
                            <HeaderCell>Fra</HeaderCell>
                            <HeaderCell>Til</HeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((player, index) => (
                            <TableRow key={player.score + player.nickname}>
                                <DataCell>{index + 1}</DataCell>
                                <DataCell>{player.nickname}</DataCell>
                                <DataCell>{player.score}</DataCell>
                                <DataCell>{player.difficulty}</DataCell>
                                <DataCell>{player.totalOptions}</DataCell>
                                <DataCell>{player.totalTravelTime}</DataCell>
                                <DataCell>{player.totalPlaytime}</DataCell>
                                <DataCell>
                                    {player.fromDestination.destination}
                                </DataCell>
                                <DataCell>
                                    {player.toDestination.destination}
                                </DataCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
