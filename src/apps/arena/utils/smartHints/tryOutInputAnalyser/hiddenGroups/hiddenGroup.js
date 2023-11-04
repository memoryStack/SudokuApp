import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _sortBy from '@lodash/sortBy'
import _unique from '@lodash/unique'

import { getStoreState } from '../../../../../../redux/dispatch.helpers'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../../store/selectors/smartHintHC.selectors'

import { filterEmptyCells, sortCells } from '../../../util'

import { HOUSE_TYPE_VS_FULL_NAMES } from '../../constants'
import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { getHouseNumText } from '../../rawHintTransformers/xWing/transformers/helpers'
import { getCandidatesListText } from '../../util'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { getCandidatesToBeFilled, getCorrectFilledTryOutCandidates, noInputInTryOut } from '../helpers'
import { HIDDEN_GROUP } from '../stringLiterals'

export const hiddenGroupTryOutAnalyser = ({
    groupCandidates,
    groupCells,
    removableGroupCandidatesHostCells,
    primaryHouse,
}) => {
    if (noInputInTryOut([...groupCells, ...removableGroupCandidatesHostCells])) {
        return getNoInputResult()
    }

    if (removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells).length) {
        return removableGroupCandidatesFilledResult(removableGroupCandidatesHostCells, primaryHouse)
    }

    if (someGroupCellWronglyFilled(groupCells, groupCandidates)) {
        return groupCellWronglyFilledResult(groupCells, groupCandidates, primaryHouse)
    }

    return correctlyFilledGroupCellsResult(groupCells, groupCandidates)
}

const getNoInputResult = () => ({
    msg: HIDDEN_GROUP.NO_INPUT,
    state: TRY_OUT_RESULT_STATES.START,
})

const removableGroupCandidatesFilledHostCells = removableGroupCandidatesHostCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return removableGroupCandidatesHostCells.filter(cell => MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
}

const removableGroupCandidatesFilledResult = (removableGroupCandidatesHostCells, primaryHouse) => {
    const filledCellsWithNumbers = getRemovableGroupCandidatesFilledCellsWithNumbers(removableGroupCandidatesHostCells)
    const msgPlaceholderValues = {
        primaryHouseFullName: getHouseFullNumAndName(primaryHouse),
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

// TODO: make it a util
const getHouseFullNumAndName = house => `${getHouseNumText(house)} ${HOUSE_TYPE_VS_FULL_NAMES[house.type].FULL_NAME}`

const getRemovableGroupCandidatesFilledCellsWithNumbers = removableGroupCandidatesHostCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells)
        .map(cell => ({
            cell,
            number: MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell),
        }))
        .sort(({ number: cellANumber }, { number: cellBNumber }) => cellANumber - cellBNumber)
}

const getCellsFromCellsWithNumbers = cellsWithNumbers => cellsWithNumbers.map(({ cell }) => cell)

const getNumbersFromCellsWithNumbers = cellsWithNumbers => cellsWithNumbers.map(({ number }) => number)

const someGroupCellWronglyFilled = (groupCells, groupCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return groupCells.some(cell => {
        if (!MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)) return false
        const cellValue = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
        return !groupCandidates.includes(cellValue)
    })
}

// TODO: can merge getWronglyFilledGroupCellsInfo and someGroupCellWronglyFilled
const getWronglyFilledGroupCellsInfo = (_groupCells, groupCandidates) => {
    const groupCells = sortCells(_groupCells)
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const result = []
    groupCells.filter(cell => MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
        .forEach(cell => {
            const cellValue = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
            if (!groupCandidates.includes(cellValue)) { result.push({ cell, number: cellValue }) }
        })
    return result
}

// TODO: break down this function
const groupCellWronglyFilledResult = (groupCells, groupCandidates, primaryHouse) => {
    let errorMsg
    const primaryHouseFullName = getHouseFullNumAndName(primaryHouse)
    const groupCandidatesToBeFilled = getGroupCandidatesToBeFilled(groupCells, groupCandidates)

    const groupCandidatesToBeFilledWithoutHostCells = getGroupCandidatesToBeFilledWithoutHostCells(
        groupCandidatesToBeFilled,
        groupCells,
    )

    const wronglyFilledGroupCellsInfo = getWronglyFilledGroupCellsInfo(groupCells, groupCandidates)
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
        const emptyGroupCells = sortCells(filterEmptyCells(groupCells, getTryOutMainNumbers(getStoreState())))
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

const getGroupCandidatesToBeFilledWithoutHostCells = (groupCandidatesToBeFilled, groupCells) => {
    const tryOutNotes = getTryOutNotes(getStoreState())
    return groupCandidatesToBeFilled.filter(groupCandidate => !groupCells.some(cell => NotesRecord.isNotePresentInCell(tryOutNotes, groupCandidate, cell)))
}

// TODO: break down this function
const correctlyFilledGroupCellsResult = (groupCells, groupCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const notes = getTryOutNotes(getStoreState())
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
        const correctlyFilledGroupCandidates = getNumbersFromCellsWithNumbers(correctlyFilledGroupCellsInfo)
        const filledGroupCells = getCellsFromCellsWithNumbers(correctlyFilledGroupCellsInfo)

        let candidatesToBeFilled = []
        groupCells.forEach(cell => {
            candidatesToBeFilled.push(...NotesRecord.getCellVisibleNotesList(notes, cell))
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

const getGroupCandidatesToBeFilled = (groupCells, groupCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const filledCellsNumbers = groupCells.map(cell => MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell))
    return getCandidatesToBeFilled(filledCellsNumbers, groupCandidates)
}
