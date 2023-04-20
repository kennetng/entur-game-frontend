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

interface Player {
    nickname: string
    score: number
    totalOptions: number
    totalPlaytime: string
    totalTravelTime: string
    fromDestination: Destination
    toDestination: Destination
}

interface Destination {
    id: string
    destination: string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Leaderboard = () => {
    const [players, setPlayers] = useState<Player[]>()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                'https://norgestur-production.up.railway.app/player-score',
            )
            const data = await response.json()
            setPlayers(data)
        }

        fetchData()
    }, [])
    if (players === undefined) {
        return <p>Loading...</p>
    }
    console.log(players)
    return (
        <>
            <Heading2>Leaderboard</Heading2>
            <Table>
                <TableHead>
                    <TableRow>
                        <HeaderCell>Rank</HeaderCell>
                        <HeaderCell>Nickname</HeaderCell>
                        <HeaderCell>Score</HeaderCell>
                        <HeaderCell>Total Options</HeaderCell>
                        <HeaderCell>Total Travel Time</HeaderCell>
                        <HeaderCell>Total Time Played</HeaderCell>
                        <HeaderCell>From Destination</HeaderCell>
                        <HeaderCell>To Destination</HeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {players.map((player, index) => (
                        <TableRow key={index}>
                            <DataCell>{index + 1}</DataCell>
                            <DataCell>{player.nickname}</DataCell>
                            <DataCell>{player.score}</DataCell>
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
        </>
    )
}
