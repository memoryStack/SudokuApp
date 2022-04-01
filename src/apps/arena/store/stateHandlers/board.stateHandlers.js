const stateHandlers = {
    setMainNumbers: (state, { payload }) => {
        state.mainNumbers = payload
    },
    setCellMainNumber: (state, { payload }) => {
        const { cell, number } = payload
        state.mainNumbers[cell.row][cell.col].value = number
    },
    eraseCellMainValue: (state, { payload }) => {
        const { row, col } = payload
        state.mainNumbers[row][col].value = 0
    },
    setSelectedCell: (state, { payload }) => {
        state.selectedCell = payload
    },
    setNotes: (state, { payload }) => {
        state.notesInfo = payload
    },
    setNotesBunch: (state, { payload }) => {
        const notesBunch = payload
        notesBunch.forEach(({ cell, note }) => {
            state.notesInfo[cell.row][cell.col][note - 1].show = 1
        })
    },
    eraseNotesBunch: (state, { payload }) => {
        const notesBunch = payload
        notesBunch.forEach(({ cell, note }) => {
            state.notesInfo[cell.row][cell.col][note - 1].show = 0
        })
    },
    addMove: (state, { payload }) => {
        state.moves.push(payload)
    },
    popMove: (state, { payload }) => {
        state.moves.pop()
    },
}

export default stateHandlers
