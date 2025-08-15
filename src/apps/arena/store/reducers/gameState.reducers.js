import { createSlice } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/gameState.state'
import stateHandlers from '../stateHandlers/gameState.stateHandlers'

export const createGameStateSlice = (sliceName = 'gameState') => {
    return createSlice({
        name: sliceName,
        initialState: INITIAL_STATE,
        reducers: stateHandlers,
    })
}

const gameStateSlice = createGameStateSlice()

export default gameStateSlice.reducer

export const gameStateActions = gameStateSlice.actions
