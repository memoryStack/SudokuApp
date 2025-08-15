import { createSlice } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/board.state'
import stateHandlers from '../stateHandlers/board.stateHandlers'

export const createBoardStateSlice = (sliceName = 'board') => {
    return createSlice({
        name: sliceName,
        initialState: INITIAL_STATE,
        reducers: stateHandlers,
    })
}

const boardSlice = createBoardStateSlice()

export default boardSlice.reducer
export const boardActions = boardSlice.actions
