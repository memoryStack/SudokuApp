import { createSlice } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/gameState.state'
import stateHandlers from '../stateHandlers/gameState.stateHandlers'

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState: INITIAL_STATE,
    reducers: stateHandlers,
})

export default gameStateSlice.reducer

export const gameStateActions = gameStateSlice.actions
