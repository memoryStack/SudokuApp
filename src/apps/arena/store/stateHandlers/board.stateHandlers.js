
const stateHandlers = {
    setMainNumbers: (state, { payload }) => {
        state.mainNumbers = payload
    },
    setCellMainNumber: (state, { payload }) => {
        const { cell, number } = payload
        state.mainNumbers[cell.row][cell.col].value = number
    },
    eraseCellMainValue: (state, { payload }) => {
        const { row, col }  = payload
        state.mainNumbers[row][col].value = 0
    },
};

export default stateHandlers;
