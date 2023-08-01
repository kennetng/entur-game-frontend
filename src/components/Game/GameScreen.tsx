import React, { ReactElement, useEffect, useState } from 'react'
import { Heading4 } from '@entur/typography'
import { Departure, QueryMode, StopPlace, StopPlaceDetails } from '@entur/sdk'
import { addHours, addMinutes } from 'date-fns'
import { sprinkleEmojis } from 'emoji-sprinkle'
import { useNavigate } from 'react-router-dom'
import { SecondaryButton } from '@entur/button'

import { Level } from '../../constant/levels'
import { InvalidTravelModal } from './components/InvalidTravelModal'
import { useEnturService } from '../../hooks/useEnturService'
import { formatTimeForEndOfGame } from '../../utils/dateFnsUtils'
import FromAndToTitle from './components/FromAndToTitle'
import TransportTypePicker from './components/TransportTypePicker'
import TravelLegStart from './components/TravelLegStart'
import { DepartureAndOnLinePickerModal } from './components/DepartureAndOnLinePickerModal'
import { isTruthy } from '../../utils/isTruthy'
import { TravelLegFinished } from './components/TravelLegFinished'
import DeadScreen from './DeadScreen'
import VictoryScreen from './VictoryScreen'

export interface StopAndTime {
    stopPlace: StopPlace | StopPlaceDetails
    time: Date
}

const startTime = new Date()

type Props = {
    nickname: string
    level: Level
    startTimer: number
    handleWinner: () => void
    totalHp: number
    setTotalHp: React.Dispatch<React.SetStateAction<number>>
    numLegs: number
    setNumLegs: React.Dispatch<React.SetStateAction<number>>
    setTimeDescription: React.Dispatch<React.SetStateAction<string>>
}

function GameScreen({
    level,
    totalHp,
    setTotalHp,
    numLegs,
    setNumLegs,
    setTimeDescription,
    startTimer,
    handleWinner,
    nickname,
}: Props): ReactElement {
    const navigate = useNavigate()
    const [hasBeenSprinkled, setSprinkled] = useState<boolean>(false)
    const [dead, setDead] = useState<boolean>(false)
    const [travelLegsMode, setTravelLegsMode] = useState<QueryMode[]>([])
    const [stopPlace, setStopPlace] = useState<StopPlace>(level.start)
    const [travelLegs, setTravelLegs] = useState<StopPlace[]>([level.start])
    const [targets, setTargets] = useState<StopPlace[]>(level.targets)
    const [mode, setMode] = useState<QueryMode | null>(null)
    const [departures, setDepartures] = useState<Departure[]>([])
    const [stopsOnLine, setStopsOnLine] = useState<StopAndTime[]>([])
    const [currentTime, setCurrentTime] = useState<Date>(new Date())
    const [noTransport, setNoTransport] = useState<boolean>(false)
    const [usedMode, setUsedMode] = useState<QueryMode[]>([])
    const [isModalOpen, setModalOpen] = useState<boolean>(false)
    const { getWalkableStopPlaces, getDepartures, getStopsOnLine } =
        useEnturService()

    useEffect(() => {
        setStopPlace(level.start)
        setTravelLegs([level.start])
        setTargets(level.targets)
    }, [level])

    useEffect(() => {
        setTimeDescription(
            formatTimeForEndOfGame(
                currentTime,
                startTime,
                level.difficulty,
                numLegs,
            ),
        )
    }, [currentTime])

    const selectMode = (newMode: QueryMode) => {
        setMode(newMode)
        if (newMode === 'foot') {
            getWalkableStopPlaces(stopPlace).then((stops) => {
                setStopsOnLine(
                    stops.map((stop) => ({
                        stopPlace: stop,
                        time: addMinutes(currentTime, 2),
                    })),
                )
                if (!stops.length) {
                    if (totalHp > 0) {
                        setTotalHp((prev) => prev - 1)
                        setNoTransport(true)
                    }

                    if (totalHp < 1) {
                        setDead(true)
                        return
                    }

                    setUsedMode((prev) => [...prev, newMode])
                    setMode(null)
                } else {
                    setModalOpen(true)
                    setUsedMode([])
                    setTravelLegsMode((prev) => [...prev, newMode])
                }
            })
        } else {
            getDepartures(stopPlace.id, newMode, currentTime).then((deps) => {
                setDepartures(deps)
                if (!deps.length) {
                    if (totalHp >= 0) {
                        setTotalHp((prev) => prev - 1)
                        setNoTransport(true)
                    }
                    if (totalHp < 1) {
                        setDead(true)
                        return
                    }
                    setUsedMode((prev) => [...prev, newMode])
                    setMode(null)
                } else {
                    setModalOpen(true)
                    setUsedMode([])
                    setTravelLegsMode((prev) => [...prev, newMode])
                }
            })
        }
    }

    const selectDeparture = (departure: Departure) => {
        setDepartures([])
        setCurrentTime(new Date(departure.expectedDepartureTime))
        getStopsOnLine(departure.serviceJourney.id, departure.date).then(
            (departures) => {
                setStopsOnLine(
                    departures
                        .map((d, index) => {
                            const stop = d.quay?.stopPlace
                            if (
                                !stop ||
                                d.expectedDepartureTime <=
                                    departure.expectedDepartureTime
                            )
                                return undefined
                            const nextDep = departures[index + 1]
                            return {
                                stopPlace: stop,
                                time: new Date(
                                    (nextDep || d).expectedArrivalTime,
                                ),
                            }
                        })
                        .filter(isTruthy),
                )
            },
        )
    }

    const selectStopOnLine = (stopAndTime: StopAndTime) => {
        setStopsOnLine([])
        setCurrentTime(stopAndTime.time)
        setMode(null)
        setModalOpen(false)
        if (stopAndTime) {
            setStopPlace(stopAndTime.stopPlace)
            setTravelLegs((prev) => [...prev, stopAndTime.stopPlace])
            setNumLegs((prev) => prev + 1)
        }
    }

    const wait = () => {
        setCurrentTime((prev) => addHours(prev, 6))
    }

    if (targets.some((sp) => sp.id === stopPlace.id)) {
        handleWinner()
        if (!hasBeenSprinkled) {
            sprinkleEmojis({
                emoji: '🎉',
                count: 50,
                fade: 10,
                fontSize: 30,
            })
            setSprinkled(true)
        }
        return (
            <div className="app" style={{ maxWidth: '800px' }}>
                <VictoryScreen
                    nickname={nickname}
                    level={level}
                    target={targets[0]}
                    setTarget={(target) => {
                        setTargets([target])
                    }}
                    numLegs={numLegs}
                    currentTime={currentTime}
                    startTime={startTime}
                    startTimer={startTimer}
                    travelLegs={travelLegs}
                    travelLegsMode={travelLegsMode}
                />
            </div>
        )
    }

    if (dead && mode) {
        return (
            <div className="app" style={{ maxWidth: '800px' }}>
                <DeadScreen mode={mode} stopPlace={stopPlace} />
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <FromAndToTitle className="mt-10 xl:mt-28" level={level} />
            <Heading4 margin="none">Hvordan vil du starte?</Heading4>
            <div className="mt-5 xl:mt-14">
                <TravelLegStart
                    travelLegs={travelLegs}
                    travelLegsMode={travelLegsMode}
                />
            </div>
            <div className="mt-5 ml-9 xl:mr-4 xl:ml-12">
                <TransportTypePicker
                    mode={mode}
                    usedMode={usedMode}
                    selectMode={selectMode}
                    wait={wait}
                    stopPlace={stopPlace}
                />
            </div>
            <div className="mt-5 xl:mt-14">
                <TravelLegFinished targets={targets} />
            </div>
            <SecondaryButton
                className="bg-lavender hover:bg-blue-80 sm:mt-28 mt-10 sm:place-self-start place-self-center"
                onClick={() => navigate('/')}
            >
                Avslutt reise
            </SecondaryButton>
            <InvalidTravelModal
                usedMode={usedMode}
                noTransport={noTransport}
                setNoTransport={setNoTransport}
                stopPlace={stopPlace.name}
            />
            <DepartureAndOnLinePickerModal
                isOpenModal={isModalOpen}
                departures={departures}
                stopsOnLine={stopsOnLine}
                selectDeparture={selectDeparture}
                mode={mode}
                selectStopOnLine={selectStopOnLine}
                setModalOpen={setModalOpen}
            />
        </div>
    )
}

export default GameScreen