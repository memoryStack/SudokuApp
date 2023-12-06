const stateHandlers = {
    setState: (state, { payload: newState }) => newState,
    setMainNumbers: (state, { payload }) => {
        state.mainNumbers = payload
    },
    setNotes: (state, { payload }) => {
        state.notes = payload
    },
    setSelectedCell: (state, { payload }) => {
        state.selectedCell = payload
    },
    setCellMainNumber: (state, { payload }) => {
        const { cell, number } = payload
        state.mainNumbers[cell.row][cell.col].value = number
    },
    setNotesBunch: (state, { payload }) => {
        const notesBunch = payload
        notesBunch.forEach(({ cell, note }) => {
            state.notes[cell.row][cell.col][note - 1].show = 1
        })
    },
    eraseNotesBunch: (state, { payload }) => {
        const notesBunch = payload
        notesBunch.forEach(({ cell, note }) => {
            state.notes[cell.row][cell.col][note - 1].show = 0
        })
    },
    addMove: (state, { payload }) => {
        state.moves.push(payload)
    },
    popMove: state => {
        state.moves.pop()
    },
}

export default stateHandlers
