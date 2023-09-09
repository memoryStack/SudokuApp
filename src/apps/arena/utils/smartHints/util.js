import { getStoreState } from '../../../../redux/dispatch.helpers'
import { getHintHCInfo } from '../../store/selectors/smartHintHC.selectors'
import { isCellExists } from '../util'

const setCellDataInHintResult = (cell, highlightData, cellsToFocusData) => {
    if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
    cellsToFocusData[cell.row][cell.col] = highlightData
}

const setCellNotesHighlightDataInHintResult = (cell, highlightData, cellsToFocusData) => {
    cellsToFocusData[cell.row][cell.col].notesToHighlightData = highlightData
}

const maxHintsLimitReached = (hints, maxHintsThreshold) => hints.length >= maxHintsThreshold

const getCandidatesListText = (candidates, lastCandidateConjugation) => {
    if (candidates.length === 1) return `${candidates[0]}`

    if (!lastCandidateConjugation) {
        return candidates.join(', ')
    }

    const allCandidatesExceptLast = candidates.slice(0, candidates.length - 1)
    return `${allCandidatesExceptLast.join(', ')} ${lastCandidateConjugation} ${candidates[candidates.length - 1]}`
}

const getHintExplanationStepsFromHintChunks = (hintChunks, addTryOutStep = true) => {
    const result = hintChunks.map(hintChunk => ({ text: hintChunk }))
    addTryOutStep
        && result.push({
            isTryOut: true,
            text: 'try out',
        })
    return result
}

const getTryOutInputPanelNumbersVisibility = allowedCandidates => {
    const numbersVisibility = new Array(10).fill(false)
    allowedCandidates.forEach(candidate => { numbersVisibility[candidate] = true })
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
    const rowsWithFocusedCells = Object.keys(cellsToFocusData).map(row => parseInt(row, 10))
    rowsWithFocusedCells.forEach(row => {
        const rowFocusedCells = Object.keys(cellsToFocusData[row])
            .map(col => parseInt(col, 10))
            .map(col => ({ row, col }))
        result.push(...rowFocusedCells)
    })
    return result
}

const isCellFocusedInSmartHint = cell => {
    const { hint: { cellsToFocusData: smartHintCellsHighlightInfo = {} } = {} } = getHintHCInfo(getStoreState())
    return !!smartHintCellsHighlightInfo[cell.row]?.[cell.col]
}

const transformCellBGColor = color => ({ backgroundColor: color })

export {
    setCellDataInHintResult,
    setCellNotesHighlightDataInHintResult,
    maxHintsLimitReached,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    removeDuplicteCells,
    getCellsFromCellsToFocusedData,
    isCellFocusedInSmartHint,
    transformCellBGColor,
}
