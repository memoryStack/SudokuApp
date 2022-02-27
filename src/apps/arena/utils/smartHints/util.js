const setCellDataInHintResult = (cell, highlightData, cellsToFocusData) => {
    if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
    cellsToFocusData[cell.row][cell.col] = highlightData
}

export { setCellDataInHintResult }
