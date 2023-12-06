const stateHandlers = {
    setHints: (state, { payload: hintsState }) => hintsState,
    setNextHint: state => {
        state.currentHintNum += 1
    },
    setHintStepNumber: (state, { payload: stepNumber }) => {
        state.currentHintNum = stepNumber
    },
    setTryOutSelectedCell: (state, { payload: cell }) => {
        state.tryOut.selectedCell = cell
    },
    updateBoardDataOnTryOutNumberInput: (state, { payload }) => {
        const { removalbeNotesHostCellsData, number } = payload

        const { selectedCell } = state.tryOut
        state.tryOut.mainNumbers[selectedCell.row][selectedCell.col].value = number

        removalbeNotesHostCellsData.forEach(({ cell, notes }) => {
            notes.forEach(note => {
                state.tryOut.notes[cell.row][cell.col][note - 1].show = 0
            })
        })
    },
    updateBoardDataOnTryOutErase: (state, { payload }) => {
        const notesToEnterHostCellsData = payload

        const { selectedCell } = state.tryOut
        state.tryOut.mainNumbers[selectedCell.row][selectedCell.col].value = 0

        notesToEnterHostCellsData.forEach(({ cell, notes }) => {
            notes.forEach(note => {
                state.tryOut.notes[cell.row][cell.col][note - 1].show = 1
            })
        })
    },
}

export default stateHandlers
