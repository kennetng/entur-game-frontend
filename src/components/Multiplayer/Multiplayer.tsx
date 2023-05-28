import './Multiplayer.css'

import React, { useState } from 'react'
import { Heading1, Heading3, Paragraph } from '@entur/typography'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '@entur/button'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab'
import { MediaCard } from '@entur/layout'

import Lobby from './Lobby'
import { EASY, HARD, Level, MEDIUM } from '../../constant/levels'
import Game from '../Game/Game'
import { useGameSocket } from '../../hooks/useGameSocket'
import easy from '@assets/images/easy.png'
import medium from '@assets/images/medium.png'
import hard from '@assets/images/hard.png'

function Multiplayer(): JSX.Element {
    const { client } = useGameSocket()
    const [ready, setReady] = useState<boolean>(false)
    const [level, setLevel] = useState<Level>(EASY[0])
    const [startTimer, setStartTimer] = useState<number>(0)
    const [isOwner, setOwner] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [winner, setWinner] = useState<string>('')
    const [finished, setFinished] = useState<boolean>(false)
    const [nickname, setNickname] = useState<string>('')

    return (
        <div className="multiplayer">
            {!ready && (
                <>
                    <Heading1>Flerspiller modus</Heading1>
                    <Lobby
                        setReady={(value) => {
                            setReady(value)
                            setStartTimer(Date.now())
                        }}
                        isOwner={isOwner}
                        setOwner={setOwner}
                        sessionId={sessionId}
                        setSessionId={setSessionId}
                        level={level}
                        setLevel={setLevel}
                        winner={winner}
                        nickname={nickname}
                        setNickname={setNickname}
                        setWinner={setWinner}
                        finished={finished}
                        client={client}
                    />
                    {isOwner && (
                        <>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                }}
                            >
                                <Heading3 style={{ marginRight: '20px' }}>
                                    Reise:
                                </Heading3>
                                <Paragraph>{level.name}</Paragraph>
                            </div>
                            <Tabs style={{ marginRight: 'auto' }}>
                                <TabList>
                                    <Tab>Lett</Tab>
                                    <Tab>Middels</Tab>
                                    <Tab>Vanskelig</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        {EASY.map((level) => (
                                            <MediaCard
                                                title={level.name}
                                                key={level.name}
                                                description={level.description}
                                                onClick={() => {
                                                    setLevel(level)
                                                }}
                                                className="media-card-images"
                                            >
                                                <img
                                                    className="images"
                                                    src={easy}
                                                    alt="OSLO-TRONDHEIM"
                                                />
                                            </MediaCard>
                                        ))}
                                    </TabPanel>
                                    <TabPanel>
                                        {MEDIUM.map((level) => (
                                            <MediaCard
                                                title={level.name}
                                                key={level.name}
                                                description={level.description}
                                                onClick={() => {
                                                    setLevel(level)
                                                }}
                                                className="media-card-images"
                                            >
                                                <img
                                                    className="images"
                                                    src={medium}
                                                    alt="MANDAL-SJUSJØEN"
                                                />
                                            </MediaCard>
                                        ))}
                                    </TabPanel>
                                    <TabPanel>
                                        {HARD.map((level) => (
                                            <MediaCard
                                                title={level.name}
                                                key={level.name}
                                                description={level.description}
                                                onClick={() => {
                                                    setLevel(level)
                                                }}
                                                className="media-card-images"
                                            >
                                                <img
                                                    className="images"
                                                    src={hard}
                                                    alt="HALDEN-HARSTAD"
                                                />
                                            </MediaCard>
                                        ))}
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </>
                    )}
                    <Link to="/">
                        <PrimaryButton>Hovedmeny</PrimaryButton>
                    </Link>
                </>
            )}
            {ready && (
                <Game
                    nickname={nickname}
                    level={level}
                    startTimer={startTimer}
                    handleWinner={() => {
                        setFinished(true)
                        client.publish({
                            destination: '/topic/' + sessionId + '/finished',
                            body: JSON.stringify(nickname),
                        })
                        client.publish({
                            destination:
                                '/app/topic/' + sessionId + '/finished',
                            body: nickname,
                        })
                    }}
                />
            )}
        </div>
    )
}

export default Multiplayer
