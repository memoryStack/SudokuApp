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
};

export default stateHandlers;
