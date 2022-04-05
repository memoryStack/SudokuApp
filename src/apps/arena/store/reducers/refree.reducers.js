import { createSlice } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/refree.state'
import stateHandlers from '../stateHandlers/refree.stateHandlers'

export const refreeSlice = createSlice({
    name: 'refree',
    initialState: INITIAL_STATE,
    reducers: stateHandlers,
})

export default refreeSlice.reducer

export const { increaseMistakes, resetMistakes, setMistakes, setDifficultylevel, setTime, resetState } = refreeSlice.actions
