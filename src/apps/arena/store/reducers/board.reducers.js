import { createSlice } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/board.state'
import stateHandlers from '../stateHandlers/board.stateHandlers'

const boardSlice = createSlice({
    name: 'board',
    initialState: INITIAL_STATE,
    reducers: stateHandlers,
})

export default boardSlice.reducer
export const boardActions = boardSlice.actions
