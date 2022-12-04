import { getStoreState } from '../../../../redux/dispatch.helpers'
import { getHintHCInfo } from '../../store/selectors/smartHintHC.selectors'
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

    if (!lastCandidateConjugation) {
        return candidates.join(', ')
    }

    const allCandidatesExceptLast = candidates.slice(0, candidates.length - 1)
    return allCandidatesExceptLast.join(', ') + ` ${lastCandidateConjugation} ${candidates[candidates.length - 1]}`
}

const getHintExplanationStepsFromHintChunks = (hintChunks, addTryOutStep = true) => {
    const result = hintChunks.map(hintChunk => {
        return { text: hintChunk }
    })
    addTryOutStep && result.push({
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

const getCellsFromCellsToFocusedData = cellsToFocusData => {
    const result = []
    const rows = Object.keys(cellsToFocusData).map(row => parseInt(row, 10))
    rows.forEach(row => {
        const columns = Object.keys(cellsToFocusData[row]).map(row => parseInt(row, 10))
        const rowCells = columns.map(column => {
            return { row, col: column }
        })
        result.push(...rowCells)
    })
    return result
}

const isCellFocusedInSmartHint = cell => {
    const { hint: { cellsToFocusData: smartHintCellsHighlightInfo = {} } = {} } = getHintHCInfo(getStoreState())
    return !!smartHintCellsHighlightInfo[cell.row]?.[cell.col]
}

export {
    setCellDataInHintResult,
    maxHintsLimitReached,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    removeDuplicteCells,
    getCellsFromCellsToFocusedData,
    isCellFocusedInSmartHint,
}
