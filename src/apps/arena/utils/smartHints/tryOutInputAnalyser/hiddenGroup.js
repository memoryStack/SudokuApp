import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { consoleLog } from '../../../../../utils/util'
import { getTryOutMainNumbers } from '../../../store/selectors/smartHintHC.selectors'
import { isCellEmpty } from '../../util'
import { HINT_TEXT_CANDIDATES_JOIN_CONJUGATION } from '../constants'
import { getCandidatesListText } from '../util'
import { TRY_OUT_RESULT_STATES } from './constants'
import { getCandidatesToBeFilled, getCellsAxesValuesListText, getCorrectFilledTryOutCandidates, noInputInTryOut } from './helpers'

const tryOutAnalyser = ({ groupCandidates, focusedCells, groupCells, removableCandidates, removableGroupCandidatesHostCells, primaryHouse }) => {

    if (noInputInTryOut([...groupCells, ...removableGroupCandidatesHostCells])) {
        // TODO: check if direct details of numbers and cells
        //         should be injected in this example
        return {
            msg: `try filling these numbers in the cells where these are`
                + ` highlighted in red or green color to see why green numbers stays`
                + ` and red numbers will be removed`,
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells).length) {
        const filledCellsWithNumbers = getRemovableGroupCandidatesFilledCellsWithNumbers(removableGroupCandidatesHostCells)
        const filledCandidatesListText = getCandidatesListText(getNumbersFromCellsWithNumbers(filledCellsWithNumbers))
        const filledCellsAxesListText = getCellsAxesValuesListText(getCellsFromCellsWithNumbers(filledCellsWithNumbers))
        const multipleCellsFilled = filledCellsWithNumbers.length > 1
        return {
            msg: `${filledCandidatesListText} ${multipleCellsFilled ? 'are' : 'is'} filled in ${filledCellsAxesListText}`
                + ` ${multipleCellsFilled ? 'respectively' : ''} because of this there ${multipleCellsFilled ? 'are' : 'is'} no`
                + ` cell for ${filledCandidatesListText} in highlighted ${primaryHouse.type}`,
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
    }

    // const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    // const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    // if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
    //     // return getAllInputsFilledResult(groupCandidates)
    // } else {
    //     const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
    //     // return getPartialCorrectlyFilledResult(candidatesToBeFilled)
    // }

    return {
        msg: 'LOGIC COMING SOON',
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const removableGroupCandidatesFilledHostCells = (removableGroupCandidatesHostCells) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return removableGroupCandidatesHostCells.filter((cell) => {
        return !isCellEmpty(cell, tryOutMainNumbers)
    })
}

const getRemovableGroupCandidatesFilledCellsWithNumbers = (removableGroupCandidatesHostCells) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells).map((cell) => {
        return {
            cell,
            number: tryOutMainNumbers[cell.row][cell.col].value,
        }
    }).sort(({ number: cellANumber }, { number: cellBNumber }) => {
        return cellANumber - cellBNumber
    })
}

const getCellsFromCellsWithNumbers = (cellsWithNumbers) => {
    return cellsWithNumbers.map(({ cell }) => cell)
}

const getNumbersFromCellsWithNumbers = (cellsWithNumbers) => {
    return cellsWithNumbers.map(({ number }) => number)
}

export default tryOutAnalyser
