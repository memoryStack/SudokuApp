import { isCellExists } from '../util'
import {
    CellHighlightData, CellsFocusData, HintSteps, NotesToHighlightData,
} from './types'

const setCellDataInHintResult = (
    cell: Cell,
    highlightData: CellHighlightData,
    cellsToFocusData: CellsFocusData,
) => {
    if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
    cellsToFocusData[cell.row][cell.col] = highlightData
}

const setCellNotesHighlightDataInHintResult = (
    cell: Cell,
    highlightData: NotesToHighlightData,
    cellsToFocusData: CellsFocusData,
) => {
    cellsToFocusData[cell.row][cell.col].notesToHighlightData = highlightData
}

const maxHintsLimitReached = (hints: unknown[], maxHintsThreshold: number) => hints.length >= maxHintsThreshold

const getCandidatesListText = (candidates: NoteValue[], lastCandidateConjugation = '') => {
    if (candidates.length === 1) return `${candidates[0]}`

    if (!lastCandidateConjugation) {
        return candidates.join(', ')
    }

    const allCandidatesExceptLast = candidates.slice(0, candidates.length - 1)
    return `${allCandidatesExceptLast.join(', ')} ${lastCandidateConjugation} ${candidates[candidates.length - 1]}`
}

const getHintExplanationStepsFromHintChunks = (hintChunks: string[], addTryOutStep = true) => {
    const result: HintSteps = hintChunks.map(hintChunk => ({ text: hintChunk }))
    addTryOutStep && result.push({ isTryOut: true, text: 'try out' })
    return result
}

const getTryOutInputPanelNumbersVisibility = (allowedCandidates: NoteValue[]) => {
    const numbersVisibility = new Array(10).fill(false)
    allowedCandidates.forEach(candidate => { numbersVisibility[candidate] = true })
    return numbersVisibility
}

// this deserves to be in wider scope
const removeDuplicteCells = (cells: Cell[]) => {
    const result: Cell[] = []
    cells.forEach(cell => {
        if (!isCellExists(cell, result)) result.push(cell)
    })
    return result
}

const getCellsFromCellsToFocusedData = (cellsToFocusData: CellsFocusData) => {
    const result: Cell[] = []
    const rowsWithFocusedCells = Object.keys(cellsToFocusData).map(row => parseInt(row, 10))
    rowsWithFocusedCells.forEach(row => {
        const rowFocusedCells = Object.keys(cellsToFocusData[row])
            .map(col => parseInt(col, 10))
            .map(col => ({ row, col }))
        result.push(...rowFocusedCells)
    })
    return result
}

const isCellFocusedInSmartHint = (cell: Cell, cellsToFocusData: CellsFocusData) => !!cellsToFocusData[cell.row]?.[cell.col]

const transformCellBGColor = (color: string) => ({ backgroundColor: color })

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
