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
    }
}

export default stateHandlers
