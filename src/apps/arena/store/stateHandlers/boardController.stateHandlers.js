const stateHandlers = {
    setPencil: (state, { payload }) => {
        state.pencilState = payload
    },
    decreaseHint: (state, action) => {
        state.hintsLeft -= 1
    },
    setHints: (state, { payload }) => {
        state.hintsLeft = payload
    }
};

export default stateHandlers;
