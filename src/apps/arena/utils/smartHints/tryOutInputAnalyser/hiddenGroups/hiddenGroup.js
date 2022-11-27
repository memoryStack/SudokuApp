import { getStoreState } from '../../../../../../redux/dispatch.helpers'

import { getTryOutMainNumbers, getTryOutNotes } from '../../../../store/selectors/smartHintHC.selectors'

import { filterEmptyCells, isCellEmpty, isCellNoteVisible } from '../../../util'

import { HOUSE_TYPE_VS_FULL_NAMES } from '../../constants'
import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { getCandidatesListText } from '../../util'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { getCandidatesToBeFilled, getCorrectFilledTryOutCandidates, noInputInTryOut } from '../helpers'

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

const getNoInputResult = () => {
    return {
        msg:
            `try filling these numbers in the cells where these are` +
            ` highlighted in red or green color to see why green numbers stays` +
            ` and red numbers will be removed`,
        state: TRY_OUT_RESULT_STATES.START,
    }
}

const removableGroupCandidatesFilledHostCells = removableGroupCandidatesHostCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return removableGroupCandidatesHostCells.filter(cell => {
        return !isCellEmpty(cell, tryOutMainNumbers)
    })
}

const removableGroupCandidatesFilledResult = (removableGroupCandidatesHostCells, primaryHouse) => {
    const filledCellsWithNumbers = getRemovableGroupCandidatesFilledCellsWithNumbers(removableGroupCandidatesHostCells)
    const filledCandidatesListText = getCandidatesListText(getNumbersFromCellsWithNumbers(filledCellsWithNumbers))
    const filledCellsAxesListText = getCellsAxesValuesListText(getCellsFromCellsWithNumbers(filledCellsWithNumbers))
    const multipleCellsFilled = filledCellsWithNumbers.length > 1
    const primaryHouseFullName = HOUSE_TYPE_VS_FULL_NAMES[primaryHouse.type].FULL_NAME
    return {
        msg:
            `${filledCandidatesListText} ${multipleCellsFilled ? 'are' : 'is'} filled in ${filledCellsAxesListText}` +
            ` ${multipleCellsFilled ? 'respectively' : ''} because of this there ${
                multipleCellsFilled ? 'are' : 'is'
            } no` +
            ` cell for ${filledCandidatesListText} in highlighted ${primaryHouseFullName}`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getRemovableGroupCandidatesFilledCellsWithNumbers = removableGroupCandidatesHostCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells)
        .map(cell => {
            return {
                cell,
                number: tryOutMainNumbers[cell.row][cell.col].value,
            }
        })
        .sort(({ number: cellANumber }, { number: cellBNumber }) => {
            return cellANumber - cellBNumber
        })
}

const getCellsFromCellsWithNumbers = cellsWithNumbers => {
    return cellsWithNumbers.map(({ cell }) => cell)
}

const getNumbersFromCellsWithNumbers = cellsWithNumbers => {
    return cellsWithNumbers.map(({ number }) => number)
}

const someGroupCellWronglyFilled = (groupCells, groupCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return groupCells.some(cell => {
        if (isCellEmpty(cell, tryOutMainNumbers)) return false
        const cellValue = tryOutMainNumbers[cell.row][cell.col].value
        return !groupCandidates.includes(cellValue)
    })
}

const groupCellWronglyFilledResult = (groupCells, groupCandidates, primaryHouse) => {
    let errorMsg
    const primaryHouseFullName = HOUSE_TYPE_VS_FULL_NAMES[primaryHouse.type].FULL_NAME
    const groupCandidatesToBeFilled = getGroupCandidatesToBeFilled(groupCells, groupCandidates)

    const groupCandidatesToBeFilledWithoutHostCells = getGroupCandidatesToBeFilledWithoutHostCells(
        groupCandidatesToBeFilled,
        groupCells,
    )
    if (groupCandidatesToBeFilledWithoutHostCells.length !== 0) {
        const candidatesListText = getCandidatesListText(groupCandidatesToBeFilledWithoutHostCells)
        errorMsg = `in the highlighted ${primaryHouseFullName}, there is no cell where ${candidatesListText} can come.`
    } else {
        const emptyGroupCells = filterEmptyCells(groupCells, getTryOutMainNumbers(getStoreState()))

        const candidatesListText = getCandidatesListText(groupCandidatesToBeFilled)
        const emptyCellsAxesListText = getCellsAxesValuesListText(emptyGroupCells)
        const candidatesCountWithoutCells = groupCandidatesToBeFilled.length - emptyGroupCells.length
        errorMsg =
            `${groupCandidatesToBeFilled.length} numbers ${candidatesListText} need to be filled` +
            ` but only ${emptyGroupCells.length} empty ${emptyGroupCells.length > 1 ? 'cells' : 'cell'}` +
            ` ${emptyCellsAxesListText} ${emptyGroupCells.length > 1 ? 'are' : 'is'} available for these` +
            ` in the highlighted ${primaryHouseFullName}. so ${candidatesCountWithoutCells} out of ${candidatesListText}` +
            ` can't be filled in this ${primaryHouseFullName}.`
    }

    return {
        msg: errorMsg,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getGroupCandidatesToBeFilledWithoutHostCells = (groupCandidatesToBeFilled, groupCells) => {
    const tryOutNotes = getTryOutNotes(getStoreState())
    return groupCandidatesToBeFilled.filter(groupCandidate => {
        return !groupCells.some(cell => {
            return isCellNoteVisible(groupCandidate, tryOutNotes[cell.row][cell.col])
        })
    })
}

const correctlyFilledGroupCellsResult = (groupCells, groupCandidates, removableCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    let progressMsg = ''
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        const candidatesListText = getCandidatesListText(groupCandidates)
        const groupCellsAxesListText = getCellsAxesValuesListText(groupCells)
        progressMsg =
            `${candidatesListText} are filled in ${groupCellsAxesListText} cells without any` +
            ` error. so only ${candidatesListText} highlighted in green color stays` +
            ` and other red highlighted numbers can be removed.`
    } else {
        const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, [
            ...groupCandidates,
            ...removableCandidates,
        ])
        const candidatesListText = getCandidatesListText(candidatesToBeFilled)
        const pluralCandidatesToBeFilled = candidatesToBeFilled.length > 1
        progressMsg =
            `try filling ${candidatesListText} as well where ${pluralCandidatesToBeFilled ? 'these' : 'this'}` +
            ` ${
                pluralCandidatesToBeFilled ? 'are' : 'is'
            } highlighted to find out in which cells ${candidatesListText}` +
            ` can and can't come.`
    }

    return {
        msg: progressMsg,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getGroupCandidatesToBeFilled = (groupCells, groupCandidates) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const filledCellsNumbers = groupCells.map(cell => {
        return tryOutMainNumbers[cell.row][cell.col].value
    })
    return getCandidatesToBeFilled(filledCellsNumbers, groupCandidates)
}
