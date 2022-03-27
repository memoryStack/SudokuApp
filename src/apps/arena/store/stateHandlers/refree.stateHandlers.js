const stateHandlers = {
    increaseMistakes: (state, action) => {
        state.mistakes += 1    
    },
    setMistakes: (state, { payload }) => {
        state.mistakes = payload
    },
    resetMistakes: (state, action) => {
        state.mistakes = 0
    },
    setDifficultylevel: (state, { payload }) => {
        state.difficultyLevel = payload
    },
    setTime: (state, { payload }) => {
        console.log('@@@@@@ time in stateHandler', payload)
        state.time = {...payload}
    }
};

export default stateHandlers;
