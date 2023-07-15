/* eslint-disable no-param-reassign */
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
        const {
            payload: {
                hints, mainNumbers, notes,
            },
        } = action
        state.show = true
        state.currentHintNum = 1
        state.hints = hints
        state.tryOut = {
            mainNumbers,
            notes,
            notesErasedOnInput: {},
        }
    },
    removeHints: state => {
        state.show = false
        state.currentHintNum = -1
        state.hints = []
        state.tryOut = {}
    },
    setNextHint: state => {
        state.currentHintNum += 1
    },
    setPrevHint: state => {
        state.currentHintNum -= 1
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
