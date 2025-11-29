import { createSlice } from '@reduxjs/toolkit'

import stateHandlers from '../stateHandlers/inputPanel.stateHandlers'
import { INPUT_TYPE } from '@application/adapterInterfaces/stateManagers/inputPanelRepository'

export const INITIAL_STATE = {
    lockedNumber: {
        isLocked: false,
        number: 0,
        type: INPUT_TYPE
    }
}

export const createInputPanelSlice = (sliceName = 'inputPanel') => {
    return createSlice({
        name: sliceName,
        initialState: INITIAL_STATE,
        reducers: stateHandlers,
    })
}

const inputPanelSlice = createInputPanelSlice()

export default inputPanelSlice.reducer

export const inputPanelActions = inputPanelSlice.actions
