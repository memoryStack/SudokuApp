import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _sortBy from '@lodash/sortBy'
import _unique from '@lodash/unique'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { NotesRecord } from '@domain/board/records/notesRecord'

import { filterEmptyCells, sortCells } from '../../../util'

import { getCellsAxesValuesListText, getHouseNumAndName } from '../../rawHintTransformers/helpers'
import { getCandidatesListText } from '../../util'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { getCandidatesToBeFilled, getCorrectFilledTryOutCandidates, noInputInTryOut } from '../helpers'
import { HIDDEN_GROUP } from '../stringLiterals'

export const hiddenGroupTryOutAnalyser = (
    {
        groupCandidates, groupCells, removableGroupCandidatesHostCells, primaryHouse,
    },
    boardInputs,
) => {
    if (noInputInTryOut([...groupCells, ...removableGroupCandidatesHostCells], boardInputs)) {
        return getNoInputResult()
    }

    if (removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells, boardInputs).length) {
        return removableGroupCandidatesFilledResult(removableGroupCandidatesHostCells, primaryHouse, boardInputs)
    }

    if (someGroupCellWronglyFilled(groupCells, groupCandidates, boardInputs)) {
        return groupCellWronglyFilledResult(groupCells, groupCandidates, primaryHouse, boardInputs)
    }

    return correctlyFilledGroupCellsResult(groupCells, groupCandidates, boardInputs)
}

const getNoInputResult = () => ({
    msg: HIDDEN_GROUP.NO_INPUT,
    state: TRY_OUT_RESULT_STATES.START,
})

const removableGroupCandidatesFilledHostCells = (removableGroupCandidatesHostCells, { tryOutMainNumbers }) => removableGroupCandidatesHostCells.filter(cell => MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))

const removableGroupCandidatesFilledResult = (removableGroupCandidatesHostCells, primaryHouse, boardInputs) => {
    const filledCellsWithNumbers = getRemovableGroupCandidatesFilledCellsWithNumbers(removableGroupCandidatesHostCells, boardInputs)
    const msgPlaceholderValues = {
        primaryHouseFullName: getHouseNumAndName(primaryHouse),
        filledCandidatesListText: getCandidatesListText(getNumbersFromCellsWithNumbers(filledCellsWithNumbers)),
        filledCellsAxesListText: getCellsAxesValuesListText(getCellsFromCellsWithNumbers(filledCellsWithNumbers)),
        filledInstancesHelpingVerb: filledCellsWithNumbers.length > 1 ? 'are' : 'is',
        cellSingularPlural: filledCellsWithNumbers.length > 1 ? 'cells' : 'cell',
    }
    return {
        msg: dynamicInterpolation(HIDDEN_GROUP.REMOVABLE_GROUP_CANDIDATE_FILLED, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getRemovableGroupCandidatesFilledCellsWithNumbers = (removableGroupCandidatesHostCells, boardInputs) => {
    const { tryOutMainNumbers } = boardInputs
    return removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells, boardInputs)
        .map(cell => ({
            cell,
            number: MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell),
        }))
        .sort(({ number: cellANumber }, { number: cellBNumber }) => cellANumber - cellBNumber)
}

const getCellsFromCellsWithNumbers = cellsWithNumbers => cellsWithNumbers.map(({ cell }) => cell)

const getNumbersFromCellsWithNumbers = cellsWithNumbers => cellsWithNumbers.map(({ number }) => number)

const someGroupCellWronglyFilled = (groupCells, groupCandidates, { tryOutMainNumbers }) => groupCells.some(cell => {
    if (!MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)) return false
    const cellValue = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
    return !groupCandidates.includes(cellValue)
})

// TODO: can merge getWronglyFilledGroupCellsInfo and someGroupCellWronglyFilled
const getWronglyFilledGroupCellsInfo = (_groupCells, groupCandidates, { tryOutMainNumbers }) => {
    const result = []
    sortCells(_groupCells)
        .filter(cell => MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
        .forEach(cell => {
            const cellValue = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
            if (!groupCandidates.includes(cellValue)) { result.push({ cell, number: cellValue }) }
        })
    return result
}

// TODO: break down this function
const groupCellWronglyFilledResult = (groupCells, groupCandidates, primaryHouse, boardInputs) => {
    let errorMsg
    const primaryHouseFullName = getHouseNumAndName(primaryHouse)
    const groupCandidatesToBeFilled = getGroupCandidatesToBeFilled(groupCells, groupCandidates, boardInputs)

    const groupCandidatesToBeFilledWithoutHostCells = getGroupCandidatesToBeFilledWithoutHostCells(
        groupCandidatesToBeFilled,
        groupCells,
        boardInputs,
    )

    const wronglyFilledGroupCellsInfo = getWronglyFilledGroupCellsInfo(groupCells, groupCandidates, boardInputs)
    const wronglyFilledGroupCells = getCellsFromCellsWithNumbers(wronglyFilledGroupCellsInfo)
    const wronglyFilledNumbersInGroupCells = getNumbersFromCellsWithNumbers(wronglyFilledGroupCellsInfo)
    const wronglyFilledNumbersInGroupCellsListText = getCandidatesListText(wronglyFilledNumbersInGroupCells)
    const wronglyFilledGroupCellsAxesListText = getCellsAxesValuesListText(wronglyFilledGroupCells)

    let msgPlaceholderValues
    if (groupCandidatesToBeFilledWithoutHostCells.length !== 0) {
        msgPlaceholderValues = {
            primaryHouseFullName,
            candidatesListText: getCandidatesListText(_sortBy(groupCandidatesToBeFilledWithoutHostCells)),
            wronglyFilledNumbersInGroupCellsListText,
            wronglyFilledGroupCellsAxesListText,
        }
        errorMsg = HIDDEN_GROUP.INVALID_CANDIDATE_IN_GROUP_CELL.NO_HOST_CELL_FOR_GROUP_CANDIDATES
    } else {
        const { tryOutMainNumbers } = boardInputs
        const emptyGroupCells = sortCells(filterEmptyCells(groupCells, tryOutMainNumbers))
        const candidatesListText = getCandidatesListText(_sortBy(groupCandidatesToBeFilled))
        const emptyCellsAxesListText = getCellsAxesValuesListText(emptyGroupCells)
        const candidatesCountWithoutCells = groupCandidatesToBeFilled.length - emptyGroupCells.length

        msgPlaceholderValues = {
            candidatesToBeFilledCount: groupCandidatesToBeFilled.length,
            candidatesListText,
            emptyGroupCellsCount: emptyGroupCells.length,
            emptyGroupCellsNounText: emptyGroupCells.length > 1 ? 'cells' : 'cell',
            emptyCellsAxesListText,
            emptyGroupCellsHelpingVerb: emptyGroupCells.length > 1 ? 'are' : 'is',
            primaryHouseFullName,
            candidatesCountWithoutCells,
            wronglyFilledNumbersInGroupCellsListText,
            wronglyFilledGroupCellsAxesListText,
        }
        errorMsg = HIDDEN_GROUP.INVALID_CANDIDATE_IN_GROUP_CELL.INSUFFICIENT_HOST_CELLS
    }

    return {
        msg: dynamicInterpolation(errorMsg, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getGroupCandidatesToBeFilledWithoutHostCells = (groupCandidatesToBeFilled, groupCells, { tryOutNotes }) => groupCandidatesToBeFilled.filter(groupCandidate => !groupCells.some(cell => NotesRecord.isNotePresentInCell(tryOutNotes, groupCandidate, cell)))

// TODO: break down this function
const correctlyFilledGroupCellsResult = (groupCells, groupCandidates, { tryOutMainNumbers, tryOutNotes }) => {
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    let progressMsg = ''
    let msgPlaceholderValues
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        msgPlaceholderValues = {
            candidatesListText: getCandidatesListText(_sortBy(groupCandidates)),
            groupCellsAxesListText: getCellsAxesValuesListText(sortCells(groupCells)),
        }
        progressMsg = HIDDEN_GROUP.VALID_FILL.FULL
    } else {
        const correctlyFilledGroupCellsInfo = []
        sortCells(groupCells).filter(cell => MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
            .forEach(cell => {
                const cellValue = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
                correctlyFilledGroupCellsInfo.push({ cell, number: cellValue })
            })
        const filledGroupCells = getCellsFromCellsWithNumbers(correctlyFilledGroupCellsInfo)

        let candidatesToBeFilled = []
        groupCells.forEach(cell => {
            candidatesToBeFilled.push(...NotesRecord.getCellVisibleNotesList(tryOutNotes, cell))
        })
        candidatesToBeFilled = _sortBy(_unique(candidatesToBeFilled))

        msgPlaceholderValues = {
            filledCandidates: getCandidatesListText(correctlyFilledGroupCandidates),
            filledCandidatesCountHV: correctlyFilledGroupCandidates.length > 1 ? 'are' : 'is',
            filledCandidatesHostCells: getCellsAxesValuesListText(filledGroupCells),
            toBeFilledCandidates: getCandidatesListText(_sortBy(candidatesToBeFilled)),
            toBeFilledCandidatesPronoun: candidatesToBeFilled.length > 1 ? 'these' : 'it',
        }
        progressMsg = HIDDEN_GROUP.VALID_FILL.PARTIAL
    }

    return {
        msg: dynamicInterpolation(progressMsg, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getGroupCandidatesToBeFilled = (groupCells, groupCandidates, { tryOutMainNumbers }) => {
    const filledCellsNumbers = groupCells.map(cell => MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell))
    return getCandidatesToBeFilled(filledCellsNumbers, groupCandidates)
}
