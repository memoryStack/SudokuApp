
const stateHandlers = {
    setHints: (state, action) => {
        const { payload: hints } = action
        state.show = true
        state.currentHintNum = 1
        state.hints = hints
    },
    removeHints: (state, action) => {
        state.show = false
        state.currentHintNum = -1
        state.hints = []
    },
    setNextHint: (state, action) => {
        state.currentHintNum += 1
    },
    setPrevHint: (state, action) => {
        state.currentHintNum -= 1
    }
};

export default stateHandlers;