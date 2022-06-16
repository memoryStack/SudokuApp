import { isCellExists } from '../util'

const setCellDataInHintResult = (cell, highlightData, cellsToFocusData) => {
    if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
    cellsToFocusData[cell.row][cell.col] = highlightData
}

const maxHintsLimitReached = (hints, maxHintsThreshold) => {
    return hints.length >= maxHintsThreshold
}

const getCandidatesListText = (candidates, lastCandidateConjugation) => {
    if (candidates.length === 1) return `${candidates[0]}`
    const allCandidatesExceptLast = candidates.slice(0, candidates.length - 1)
    return allCandidatesExceptLast.join(', ') + ` ${lastCandidateConjugation} ${candidates[candidates.length - 1]}`
}

const getHintExplanationStepsFromHintChunks = hintChunks => {
    const result = hintChunks.map(hintChunk => {
        return { text: hintChunk }
    })
    result.push({
        isTryOut: true,
        text: 'try out',
    })
    return result
}

const getTryOutInputPanelNumbersVisibility = allowedCandidates => {
    const numbersVisibility = new Array(10).fill(false)
    allowedCandidates.forEach(candidate => (numbersVisibility[candidate] = true))
    return numbersVisibility
}

const removeDuplicteCells = cells => {
    const result = []
    cells.forEach(cell => {
        if (!isCellExists(cell, result)) result.push(cell)
    })
    return result
}

export {
    setCellDataInHintResult,
    maxHintsLimitReached,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    removeDuplicteCells,
}
