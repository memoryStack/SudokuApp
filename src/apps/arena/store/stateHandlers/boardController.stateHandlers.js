const stateHandlers = {
    resetState: (state, { payload }) => {
        state.pencilState = payload.pencilState
        state.hintsLeft = payload.hintsLeft
        state.showHintsMenu = payload.showHintsMenu
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
}

export default stateHandlers
