import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastProvider } from '@entur/alert'

import './App.css'
import Multiplayer from './components/Multiplayer/Multiplayer'
import MainPage from './pages/MainPage'
import GamePage from './pages/game/[level-id]'
import NewGamePage from './pages/new-game/[level-id]'

function App(): JSX.Element {
    return (
        <ToastProvider>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/game/:levelId" element={<GamePage />} />
                <Route path="/new-game/:levelId" element={<NewGamePage />} />
                <Route path="/multiplayer" element={<Multiplayer />} />
            </Routes>
        </ToastProvider>
    )
}

export default App
