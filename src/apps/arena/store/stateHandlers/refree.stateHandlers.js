const stateHandlers = {
    resetState: state => {
        state.maxMistakesLimit = 3
        state.mistakes = 0
        state.difficultyLevel = ''
        state.time = { hours: 0, minutes: 0, seconds: 0 }
    },
    increaseMistakes: state => {
        state.mistakes += 1
    },
    setMistakes: (state, { payload }) => {
        state.mistakes = payload
    },
    resetMistakes: state => {
        state.mistakes = 0
    },
    setDifficultylevel: (state, { payload }) => {
        state.difficultyLevel = payload
    },
    setTime: (state, { payload }) => {
        state.time = payload
    },
}

export default stateHandlers
