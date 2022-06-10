import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getCellAxesValues, getCellVisibleNotes, getCellVisibleNotesCount, isCellEmpty, isCellExists } from '../../util'
import { TRY_OUT_RESULT_STATES, TRY_OUT_ERROR_TYPES_VS_ERROR_MSG } from './constants'
import { noInputInTryOut, getTryOutErrorType, getNakedGroupNoTryOutInputResult, getTryOutErrorResult, getCorrectFilledTryOutCandidates, getCandidatesToBeFilled } from './helpers'
import { N_CHOOSE_K } from '../../../../../resources/constants'
import { getCandidatesListText } from '../util'
import { HINT_TEXT_CANDIDATES_JOIN_CONJUGATION } from '../constants'
import { consoleLog } from '../../../../../utils/util'
import { isNakedSinglePresent } from '../nakedSingle/nakedSingle'

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
        // checking if naked singles in two chosen cells empties the third cell
        const invalidNakedSingleCellsCombination = N_CHOOSE_K[3][2].find((combination) => {
            const chosenCells = getChosenCells(combination, groupCells)

            const allChosenCellsHaveNakedSingle = chosenCells.some((cell) => {
                return isNakedSinglePresent(tryOutNotesInfo[cell.row][cell.col]).present
            })

            if (allChosenCellsHaveNakedSingle) {
                const chosenCellNotes = chosenCells.map((cell) => {
                    return getCellVisibleNotes(tryOutNotesInfo[cell.row][cell.col])[0]
                }).sort()
                const notChosenCell = getNotChosenCell(chosenCells, groupCells)
                const notChosenCellWillNotHaveCandidate = chosenCellNotes.sameArrays(getCellVisibleNotes(tryOutNotesInfo[notChosenCell.row][notChosenCell.col]))
                return notChosenCellWillNotHaveCandidate
            }

            return false
        })

        if (invalidNakedSingleCellsCombination) {
            const chosenCells = getChosenCells(invalidNakedSingleCellsCombination, groupCells)
            const notChosenCell = getNotChosenCell(chosenCells, groupCells)
            const chosenCellWithNote = chosenCells.map((cell) => {
                return {
                    note: getCellVisibleNotes(tryOutNotesInfo[cell.row][cell.col])[0],
                    cell,
                }
            }).sort((cellAWithNote, cellBWithNote) => {
                return cellAWithNote.note - cellBWithNote.note
            })

            return {
                msg: `${chosenCellWithNote[0].note} and ${chosenCellWithNote[1].note} are Naked Singles in`
                    + ` ${getCellAxesValues(chosenCellWithNote[0].cell)} and ${getCellAxesValues(chosenCellWithNote[1].cell)} respectively.`
                    + ` because of this ${getCellAxesValues(notChosenCell)} can't have ${chosenCellWithNote[0].note} or ${chosenCellWithNote[1].note}`
                    + ` and it will be empty, which is invalid`,
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        // checking if naked double empties the third cell
        const invalidNakedDoubleCellsCombination = N_CHOOSE_K[3][2].find((combination) => {
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

        if (invalidNakedDoubleCellsCombination) {
            // prepare the naked double msg here
            const chosenCells = getChosenCells(invalidNakedDoubleCellsCombination, groupCells)
            const aChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[chosenCells[0].row][chosenCells[0].col])
            const notChosenCell = getNotChosenCell(chosenCells, groupCells)
            const notChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[notChosenCell.row][notChosenCell.col])

            const isThirdCellHasNakedSingle = getCellVisibleNotesCount(tryOutNotesInfo[notChosenCell.row][notChosenCell.col]) === 1
            consoleLog('@@@@ notChosenCellNotes', notChosenCellNotes)
            consoleLog('@@@@@@ isThirdCellHasNakedSingle', isThirdCellHasNakedSingle)

            let chosenCellsPotentialMultipleNakedSingleCandidate
            if (isThirdCellHasNakedSingle) {
                chosenCellsPotentialMultipleNakedSingleCandidate = notChosenCellNotes[0] === aChosenCellNotes[0] ? aChosenCellNotes[1] : aChosenCellNotes[0]
            }

            const resultMsg = isThirdCellHasNakedSingle ? `${notChosenCellNotes[0]} is the Naked Single in ${getCellAxesValues(notChosenCell)} because of this`
                + ` ${getCellAxesValues(chosenCells[0])} and ${getCellAxesValues(chosenCells[1])} will have`
                + ` ${chosenCellsPotentialMultipleNakedSingleCandidate} as Naked Single in them, which will result in invalid solution`

                : `${getCandidatesListText(aChosenCellNotes, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)} make a Naked Double`
                + ` in ${getCellAxesValues(chosenCells[0])} and ${getCellAxesValues(chosenCells[1])} cells. because of this rule`
                + ` ${getCandidatesListText(notChosenCellNotes, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)} can't come in ${getCellAxesValues(notChosenCell)}`
                + ` and it will be empty`

            return {
                msg: resultMsg,
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }
    }

    // handle progress step

    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        const filledCandidatesListText = getCandidatesListText(correctlyFilledGroupCandidates, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)
        return {
            msg:
                `${filledCandidatesListText} are filled in` +
                ` these cells without any error. now we are sure` +
                ` that ${filledCandidatesListText} can't come in cells where these were highlighted in red`,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    } else {
        const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
        const candidatesListText = getCandidatesListText(candidatesToBeFilled, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)
        return {
            msg:
                `try fill ${candidatesListText} as well` +
                ` to find where these numbers can't come in the highlighted region.`,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
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