const stateHandlers = {
    resetState: (state, action) => {
        const {
            payload: { show, currentHintNum, hints },
        } = action
        state.show = show
        state.currentHintNum = currentHintNum
        state.hints = hints
    },
    setHints: (state, action) => {
        const { payload: { hints, mainNumbers, notesInfo } } = action
        state.show = true
        state.currentHintNum = 1
        state.hints = hints
        state.tryOut = {
            mainNumbers,
            notesInfo,
            selectedCell: { row: 0, col: 0 },
        }
    },
    removeHints: (state, action) => {
        state.show = false
        state.currentHintNum = -1
        state.hints = []
        state.tryOut = {}
    },
    setNextHint: (state, action) => {
        state.currentHintNum += 1
    },
    setPrevHint: (state, action) => {
        state.currentHintNum -= 1
    },
    setTryOutSelectedCell: (state, { payload: cell }) => {
        state.tryOut.selectedCell = cell
    }
}

export default stateHandlers
