import { createSlice } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/boardController.state'
import stateHandlers from '../stateHandlers/boardController.stateHandlers'

export const createBoardControllerSlice = (sliceName = 'boardController') => {
    return createSlice({
        name: sliceName,
        initialState: INITIAL_STATE,
        reducers: stateHandlers,
    })
}

const boardControllerSlice = createBoardControllerSlice()

export default boardControllerSlice.reducer
export const boardControllerActions = boardControllerSlice.actions
