const stateHandlers = {
    setState: (_, { payload: newState }) => newState,
    setMistakes: (state, { payload }) => {
        state.mistakes = payload
    },
    setDifficultylevel: (state, { payload }) => {
        state.difficultyLevel = payload
    },
    setTime: (state, { payload }) => {
        state.time = payload
    },
}

export default stateHandlers
