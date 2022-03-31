import { createSlice } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/board.state'
import stateHandlers from '../stateHandlers/board.stateHandlers'

export const boardSlice = createSlice({
    name: 'board',
    initialState: INITIAL_STATE,
    reducers: stateHandlers,
})

export default boardSlice.reducer

export const {
    setMainNumbers,
    setCellMainNumber,
    eraseCellMainValue,
    setSelectedCell,
    setNotes,
    setNotesBunch,
    eraseNotesBunch,
} = boardSlice.actions
