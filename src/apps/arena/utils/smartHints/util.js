
const setCellDataInHintResult = (cell, highlightData, cellsToFocusData) => {
    if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
    cellsToFocusData[cell.row][cell.col] = highlightData
}

const maxHintsLimitReached = (hints, maxHintsThreshold) => {
    return hints.length >= maxHintsThreshold
}

const getCandidatesListText = (candidates, lastCandidateConjugation) => {
    if (candidates.length === 1) return `${candidates[0]}`
    const allCandidatesExceptLast = candidates.slice(0, candidates.length - 1);
    return allCandidatesExceptLast.join(', ') + ` ${lastCandidateConjugation} ${candidates[candidates.length - 1]}`
}

export {
    setCellDataInHintResult,
    maxHintsLimitReached,
    getCandidatesListText,
}
