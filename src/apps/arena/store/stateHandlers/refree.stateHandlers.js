const stateHandlers = {
    setState: (_, { payload: newState }) => newState,
    increaseMistakes: state => {
        // this is a business logic
        state.mistakes += 1
    },
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
