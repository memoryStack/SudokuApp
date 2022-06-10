import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getCellAxesValues, getCellVisibleNotes, isCellEmpty, isCellExists } from '../../util'
import { TRY_OUT_RESULT_STATES, TRY_OUT_ERROR_TYPES_VS_ERROR_MSG } from './constants'
import { noInputInTryOut, getTryOutErrorType, getNakedGroupNoTryOutInputResult, getTryOutErrorResult } from './helpers'
import { N_CHOOSE_K } from '../../../../../resources/constants'
import { getNotesInfo } from '../../../store/selectors/board.selectors'
import { getCandidatesListText } from '../util'
import { HINT_TEXT_CANDIDATES_JOIN_CONJUGATION } from '../constants'

export default ({ groupCandidates, focusedCells, groupCells, }) => {

    if (noInputInTryOut(focusedCells)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates)
    }

    const tryOutErrorType = getTryOutErrorType(groupCandidates, focusedCells)
    if (tryOutErrorType) {
        return getTryOutErrorResult(tryOutErrorType)
    }
    // till here the handling is same for naked double and tripple

    // check if 2 cells make naked double or not and makes third cell empty completely

    if (allGroupCellsEmpty(groupCells)) {

        const tryOutNotesInfo = getTryOutNotes(getStoreState())
        const invalidCombination = N_CHOOSE_K[3][2].find((combination) => {
            const chosenCells = getChosenCells(combination, groupCells)

            if (areNakedDoubleHostCells(chosenCells, tryOutNotesInfo)) {
                const notChosenCell = getNotChosenCell(chosenCells, groupCells)

                const notChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[notChosenCell.row][notChosenCell.col])
                const aChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[chosenCells[0].row][chosenCells[0].col])
                const notChosenCellWillHaveCandidate = notChosenCellNotes.some((notChosenCellNote) => {
                    return !aChosenCellNotes.includes(notChosenCellNote)
                })
                return !notChosenCellWillHaveCandidate
            }
            return false
        })

        if (invalidCombination) {
            // prepare the naked double msg here
            const chosenCells = getChosenCells(invalidCombination, groupCells)
            const aChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[chosenCells[0].row][chosenCells[0].col])
            const notChosenCell = getNotChosenCell(chosenCells, groupCells)
            const notChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[notChosenCell.row][notChosenCell.col])
            return {
                msg: `${getCandidatesListText(aChosenCellNotes, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)} make a Naked Double`
                    + ` in ${getCellAxesValues(chosenCells[0])} and ${getCellAxesValues(chosenCells[1])} cells. because of this rule`
                    + ` ${getCandidatesListText(notChosenCellNotes, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)} can't come in ${getCellAxesValues(notChosenCell)}`
                    + ` and it will be empty`,
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }
    }

    // handle progress step



    return {
        msg: 'some logic is coming soon',
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }

}

// this func should have test-cases
const areNakedDoubleHostCells = (cells, notesInfo) => {
    // TODO: refactor it
    const [cellA, cellB] = cells
    const cellANotes = getCellVisibleNotes(notesInfo[cellA.row][cellA.col])
    const cellBNotes = getCellVisibleNotes(notesInfo[cellB.row][cellB.col])
    return cellANotes.sameArrays(cellBNotes)
}

const allGroupCellsEmpty = (groupCells) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return !groupCells.some((cell) => {
        return !isCellEmpty(cell, tryOutMainNumbers)
    })
}

const getChosenCells = (combination, groupCells) => {
    return combination.map((idx) => {
        return groupCells[idx]
    })
}

const getNotChosenCell = (chosenCells, allCells) => {
    return allCells.find((cell) => {
        return !isCellExists(cell, chosenCells)
    })
}