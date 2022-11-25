import { getTryOutMainNumbers, getTryOutNotes } from '../../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../../redux/dispatch.helpers'
import {
    getCellAxesValues,
    getCellVisibleNotes,
    getCellVisibleNotesCount,
    isCellEmpty,
    isCellExists,
} from '../../../util'
import { TRY_OUT_RESULT_STATES } from '../constants'
import { noInputInTryOut, getCorrectFilledTryOutCandidates, getCandidatesToBeFilled } from '../helpers'
import { N_CHOOSE_K } from '../../../../../../resources/constants'
import { getCandidatesListText } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { isNakedSinglePresent } from '../../nakedSingle/nakedSingle'
import { getCellsAxesValuesListText } from '../../uiHighlightData.helpers'

import {
    getNakedGroupNoTryOutInputResult,
    getCellsFromCellsWithNote,
    getNotesListTextFromCellsWithNotes,
    getNakedSingleCellsWithNoteInAscOrder,
    getNakedGroupTryOutInputErrorResult,
} from './helpers'

export const nakedTrippleTryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }) => {
    if (noInputInTryOut(focusedCells)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates)
    }

    const tryOutErrorResult = getNakedGroupTryOutInputErrorResult(groupCandidates, focusedCells)
    if (tryOutErrorResult) {
        return tryOutErrorResult
    }

    if (allGroupCellsEmpty(groupCells)) {
        const nakedSinglePairCellError = getNakedSinglePairCellsErrorResultIfExist(groupCells)
        if (nakedSinglePairCellError) return nakedSinglePairCellError

        const nakedDoublePairCellError = getNakedDoublePairCellsErrorResultIfPresent(groupCells)
        if (nakedDoublePairCellError) return nakedDoublePairCellError
    }

    return getValidProgressResult(groupCandidates, groupCells)
}

const allGroupCellsEmpty = groupCells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    return !groupCells.some(cell => {
        return !isCellEmpty(cell, tryOutMainNumbers)
    })
}

// two cells have naked single in them because of that third one
// will have no candidate in them
const getNakedSinglePairCellsErrorResultIfExist = groupCells => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())
    const invalidNakedSingleCellsCombination = getNakedSinglesInvalidCombination(groupCells)
    if (invalidNakedSingleCellsCombination) {
        const chosenCells = getChosenCells(invalidNakedSingleCellsCombination, groupCells)
        const notChosenCell = getNotChosenCell(chosenCells, groupCells)
        return getNakedSinglePairErrorResult(chosenCells, notChosenCell, tryOutNotesInfo)
    }

    return null
}

const getNakedSinglesInvalidCombination = groupCells => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())
    return N_CHOOSE_K[3][2].find(combination => {
        const chosenCells = getChosenCells(combination, groupCells)

        // bug in this func.
        // i again wish i had implemented this using TDD
        const allChosenCellsHaveNakedSingle = !chosenCells.some(cell => {
            return !isNakedSinglePresent(tryOutNotesInfo[cell.row][cell.col]).present
        })

        if (allChosenCellsHaveNakedSingle) {
            const chosenCellNotes = chosenCells
                .map(cell => {
                    return getCellVisibleNotes(tryOutNotesInfo[cell.row][cell.col])[0]
                })
                .sortNumbers()
            const notChosenCell = getNotChosenCell(chosenCells, groupCells)
            const notChosenCellWillNotHaveCandidate = chosenCellNotes.sameArrays(
                getCellVisibleNotes(tryOutNotesInfo[notChosenCell.row][notChosenCell.col]),
            )
            return notChosenCellWillNotHaveCandidate
        }

        return false
    })
}

const getChosenCells = (combination, groupCells) => {
    return combination.map(idx => {
        return groupCells[idx]
    })
}

const getNotChosenCell = (chosenCells, allCells) => {
    return allCells.find(cell => {
        return !isCellExists(cell, chosenCells)
    })
}

const getNakedSinglePairErrorResult = (chosenCells, notChosenCell, tryOutNotesInfo) => {
    const chosenCellWithNote = getNakedSingleCellsWithNoteInAscOrder(chosenCells, tryOutNotesInfo)

    const notesListWithAndConjugation = getNotesListTextFromCellsWithNotes(
        chosenCellWithNote,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
    )
    const notesListWithORConjugation = getNotesListTextFromCellsWithNotes(
        chosenCellWithNote,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR,
    )
    const chosenCellsAxesText = getCellsAxesValuesListText(
        getCellsFromCellsWithNote(chosenCellWithNote),
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
    )

    return {
        msg:
            `${notesListWithAndConjugation} are Naked Singles in` +
            ` ${chosenCellsAxesText} respectively. because of` +
            ` this ${getCellAxesValues(notChosenCell)} can't have ${notesListWithORConjugation}` +
            ` and it will be empty, which is invalid`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

// two cells have naked double in them because of that third one
// will have no candidate in it
const getNakedDoublePairCellsErrorResultIfPresent = groupCells => {
    const tryOutNotesInfo = getTryOutNotes(getStoreState())

    const invalidNakedDoubleCellsCombination = getNakedDoublesInvalidCombination(groupCells, tryOutNotesInfo)

    if (invalidNakedDoubleCellsCombination) {
        const chosenCells = getChosenCells(invalidNakedDoubleCellsCombination, groupCells)
        const notChosenCell = getNotChosenCell(chosenCells, groupCells)
        return getNakedDoublePairErrorResult(chosenCells, notChosenCell, tryOutNotesInfo)
    }
}

const getNakedDoublesInvalidCombination = (groupCells, tryOutNotesInfo) => {
    return N_CHOOSE_K[3][2].find(combination => {
        const chosenCells = getChosenCells(combination, groupCells)

        if (areNakedDoubleHostCells(chosenCells, tryOutNotesInfo)) {
            const notChosenCell = getNotChosenCell(chosenCells, groupCells)

            const notChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[notChosenCell.row][notChosenCell.col])
            const aChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[chosenCells[0].row][chosenCells[0].col])
            const notChosenCellWillHaveCandidate = notChosenCellNotes.some(notChosenCellNote => {
                return !aChosenCellNotes.includes(notChosenCellNote)
            })
            return !notChosenCellWillHaveCandidate
        }
        return false
    })
}

export const areNakedDoubleHostCells = (cells, notesInfo) => {
    const [cellANotes, cellBNotes] = cells.map(cell => {
        return getCellVisibleNotes(notesInfo[cell.row][cell.col])
    })
    return cellANotes.sameArrays(cellBNotes)
}

const getNakedDoublePairErrorResult = (chosenCells, notChosenCell, tryOutNotesInfo) => {
    const aChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[chosenCells[0].row][chosenCells[0].col])
    const notChosenCellNotes = getCellVisibleNotes(tryOutNotesInfo[notChosenCell.row][notChosenCell.col])

    const isThirdCellHasNakedSingle =
        getCellVisibleNotesCount(tryOutNotesInfo[notChosenCell.row][notChosenCell.col]) === 1

    let chosenCellsPotentialMultipleNakedSingleCandidate
    if (isThirdCellHasNakedSingle) {
        chosenCellsPotentialMultipleNakedSingleCandidate =
            notChosenCellNotes[0] === aChosenCellNotes[0] ? aChosenCellNotes[1] : aChosenCellNotes[0]
    }

    const chosenCellsAxesText = getCellsAxesValuesListText(chosenCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
    const chosenCellsCandidatesList = getCandidatesListText(aChosenCellNotes, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
    const notChosenCellCandidatesListText = getCandidatesListText(
        notChosenCellNotes,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
    )
    const resultMsg = isThirdCellHasNakedSingle
        ? `${notChosenCellNotes[0]} is the Naked Single in ${getCellAxesValues(notChosenCell)} because of this` +
          ` ${chosenCellsAxesText} will have ${chosenCellsPotentialMultipleNakedSingleCandidate} as Naked Single` +
          ` in them, which will result in invalid solution`
        : `${chosenCellsCandidatesList} make a Naked Double in ${chosenCellsAxesText} cells.` +
          ` because of this rule ${notChosenCellCandidatesListText} can't come in ${getCellAxesValues(notChosenCell)}` +
          ` and it will be empty`

    return {
        msg: resultMsg,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getValidProgressResult = (groupCandidates, groupCells) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        return getAllInputsFilledResult(groupCandidates)
    } else {
        const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
        return getPartialCorrectlyFilledResult(candidatesToBeFilled)
    }
}

// TODO: check if we can re-use these below funcs or not for naked double as well
const getAllInputsFilledResult = groupCandidates => {
    const filledCandidatesListText = getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
    return {
        msg:
            `${filledCandidatesListText} are filled in` +
            ` these cells without any error. now we are sure` +
            ` that ${filledCandidatesListText} can't come in cells where these were highlighted in red`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getPartialCorrectlyFilledResult = candidatesToBeFilled => {
    const candidatesListText = getCandidatesListText(candidatesToBeFilled, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
    return {
        msg:
            `fill ${candidatesListText} as well` + ` to find where these numbers can't come in the highlighted region.`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}
