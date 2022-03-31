const stateHandlers = {
    setPencil: (state, { payload }) => {
        state.pencilState = payload
    },
    decreaseHint: (state, action) => {
        state.hintsLeft -= 1
    },
    setHints: (state, { payload }) => {
        state.hintsLeft = payload
    },
    setHintsMenu: (state, { payload }) => {
        state.showHintsMenu = payload
    },
}

export default stateHandlers
