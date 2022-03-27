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
    }
};

export default stateHandlers;
