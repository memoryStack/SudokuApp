import { createSlice } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/boardController.state'
import stateHandlers from '../stateHandlers/boardController.stateHandlers'

export const boardControllerSlice = createSlice({
    name: 'boardController',
    initialState: INITIAL_STATE,
    reducers: stateHandlers,
})

export default boardControllerSlice.reducer

export const boardControllerActions = boardControllerSlice.actions
