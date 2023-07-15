import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import { getStoreState } from '../../../../../../redux/dispatch.helpers'

import { getTryOutMainNumbers, getTryOutNotes } from '../../../../store/selectors/smartHintHC.selectors'

import { filterEmptyCells, isCellEmpty, isCellNoteVisible } from '../../../util'

import { HOUSE_TYPE_VS_FULL_NAMES } from '../../constants'
import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { getCandidatesListText } from '../../util'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { getCandidatesToBeFilled, getCorrectFilledTryOutCandidates, noInputInTryOut } from '../helpers'
import { HIDDEN_GROUP } from '../stringLiterals'

export const hiddenGroupTryOutAnalyser = ({
    groupCandidates,
    groupCells,
    removableCandidates,
    removableGroupCandidatesHostCells,
    primaryHouse,
}) => {
    if (noInputInTryOut([...groupCells, ...removableGroupCandidatesHostCells])) {
        // TODO: check if direct details of numbers and cells
        //         should be injected in this example
        return getNoInputResult()
    }

    if (removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells).length) {
        return removableGroupCandidatesFilledResult(removableGroupCandidatesHostCells, primaryHouse)
    }

    if (someGroupCellWronglyFilled(groupCells, groupCandidates)) {
        return groupCellWronglyFilledResult(groupCells, groupCandidates, primaryHouse)
    }

    return correctlyFilledGroupCellsResult(groupCells, groupCandidates, removableCandidates)
}

const getNoInputResult = () => ({
    msg: HIDDEN_GROUP.NO_INPUT,
    state: TRY_OUT_RESULT_STATES.START,
})

const removableGroupCandidatesFilledHostCells = removableGroupCandidatesHostCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return removableGroupCandidatesHostCells.filter(cell => !isCellEmpty(cell, tryOutMainNumbers))
}

const removableGroupCandidatesFilledResult = (removableGroupCandidatesHostCells, primaryHouse) => {
    const filledCellsWithNumbers = getRemovableGroupCandidatesFilledCellsWithNumbers(removableGroupCandidatesHostCells)
    const msgPlaceholderValues = {
        primaryHouseFullName: HOUSE_TYPE_VS_FULL_NAMES[primaryHouse.type].FULL_NAME,
        filledCandidatesListText: getCandidatesListText(getNumbersFromCellsWithNumbers(filledCellsWithNumbers)),
        filledCellsAxesListText: getCellsAxesValuesListText(getCellsFromCellsWithNumbers(filledCellsWithNumbers)),
        filledInstancesHelpingVerb: filledCellsWithNumbers.length > 1 ? 'are' : 'is',
    }
    return {
        msg: dynamicInterpolation(HIDDEN_GROUP.REMOVABLE_GROUP_CANDIDATE_FILLED, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getRemovableGroupCandidatesFilledCellsWithNumbers = removableGroupCandidatesHostCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells)
        .map(cell => ({
            cell,
            number: tryOutMainNumbers[cell.row][cell.col].value,
        }))
        .sort(({ number: cellANumber }, { number: cellBNumber }) => cellANumber - cellBNumber)
}

const getCellsFromCellsWithNumbers = cellsWithNumbers => cellsWithNumbers.map(({ cell }) => cell)

const getNumbersFromCellsWithNumbers = cellsWithNumbers => cellsWithNumbers.map(({ number }) => number)

const someGroupCellWronglyFilled = (groupCells, groupCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return groupCells.some(cell => {
        if (isCellEmpty(cell, tryOutMainNumbers)) return false
        const cellValue = tryOutMainNumbers[cell.row][cell.col].value
        return !groupCandidates.includes(cellValue)
    })
}

// TODO: break down this function
const groupCellWronglyFilledResult = (groupCells, groupCandidates, primaryHouse) => {
    let errorMsg
    const primaryHouseFullName = HOUSE_TYPE_VS_FULL_NAMES[primaryHouse.type].FULL_NAME
    const groupCandidatesToBeFilled = getGroupCandidatesToBeFilled(groupCells, groupCandidates)

    const groupCandidatesToBeFilledWithoutHostCells = getGroupCandidatesToBeFilledWithoutHostCells(
        groupCandidatesToBeFilled,
        groupCells,
    )

    let msgPlaceholderValues
    if (groupCandidatesToBeFilledWithoutHostCells.length !== 0) {
        msgPlaceholderValues = {
            primaryHouseFullName,
            candidatesListText: getCandidatesListText(groupCandidatesToBeFilledWithoutHostCells),
        }
        errorMsg = HIDDEN_GROUP.INVALID_CANDIDATE_IN_GROUP_CELL.NO_HOST_CELL_FOR_GROUP_CANDIDATES
    } else {
        const emptyGroupCells = filterEmptyCells(groupCells, getTryOutMainNumbers(getStoreState()))
        const candidatesListText = getCandidatesListText(groupCandidatesToBeFilled)
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
        }
        errorMsg = HIDDEN_GROUP.INVALID_CANDIDATE_IN_GROUP_CELL.INSUFFICIENT_HOST_CELLS
    }

    return {
        msg: dynamicInterpolation(errorMsg, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getGroupCandidatesToBeFilledWithoutHostCells = (groupCandidatesToBeFilled, groupCells) => {
    const tryOutNotes = getTryOutNotes(getStoreState())
    return groupCandidatesToBeFilled.filter(groupCandidate => !groupCells.some(cell => isCellNoteVisible(groupCandidate, tryOutNotes[cell.row][cell.col])))
}

// TODO: break down this function
const correctlyFilledGroupCellsResult = (groupCells, groupCandidates, removableCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    let progressMsg = ''
    let msgPlaceholderValues
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        msgPlaceholderValues = {
            candidatesListText: getCandidatesListText(groupCandidates),
            groupCellsAxesListText: getCellsAxesValuesListText(groupCells),
        }
        progressMsg = HIDDEN_GROUP.VALID_FILL.FULL
    } else {
        const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, [
            ...groupCandidates,
            ...removableCandidates,
        ])
        const pluralCandidatesToBeFilled = candidatesToBeFilled.length > 1

        msgPlaceholderValues = {
            candidatesListText: getCandidatesListText(candidatesToBeFilled),
            candidatesPronoun: pluralCandidatesToBeFilled ? 'these' : 'this',
            candidatesHelpingVerb: pluralCandidatesToBeFilled ? 'are' : 'is',
        }
        progressMsg = HIDDEN_GROUP.VALID_FILL.PARTIAL
    }

    return {
        msg: dynamicInterpolation(progressMsg, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getGroupCandidatesToBeFilled = (groupCells, groupCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const filledCellsNumbers = groupCells.map(cell => tryOutMainNumbers[cell.row][cell.col].value)
    return getCandidatesToBeFilled(filledCellsNumbers, groupCandidates)
}
