const stateHandlers = {
    resetState: (state, { payload }) => {
        state = payload
    },
    setPencil: (state, { payload }) => {
        state.pencilState = payload
    },
    setHints: (state, { payload }) => {
        // TODO: is this really needed ??
        state.hintsLeft = payload
    },
    setHintsMenu: (state, { payload }) => {
        state.showHintsMenu = payload
    },
    incrementHintsUsed: (state, { }) => {
        state.hintsUsed++
    },
    setHintsUsed: (state, { payload }) => {
        state.hintsUsed = payload
    }
}

export default stateHandlers
