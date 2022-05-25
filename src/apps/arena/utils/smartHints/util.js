const setCellDataInHintResult = (cell, highlightData, cellsToFocusData) => {
    if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
    cellsToFocusData[cell.row][cell.col] = highlightData
}

const maxHintsLimitReached = (hints, maxHintsThreshold) => {
    return hints.length === maxHintsThreshold
}

export {
    setCellDataInHintResult,
    maxHintsLimitReached,
}
