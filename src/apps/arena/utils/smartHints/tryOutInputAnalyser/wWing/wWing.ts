import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _sortBy from '@lodash/sortBy'
import _unique from '@lodash/unique'
import _head from '@lodash/head'

import { NotesRecord } from '@domain/board/records/notesRecord'

import { getCellAxesValues, getNoteHostCellsInHouse } from '../../../util'

import { getCellsAxesValuesListText, getHouseNumAndName } from '../../rawHintTransformers/helpers'

import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    anyCellHasTryOutInput,
    filterCellsWithoutTryoutInput,
    filterFilledCellsInTryOut,
    filterNakedSingleCells,
    getCellsWithNoCandidates
} from '../helpers'
import { W_WING } from '../stringLiterals'

import { BoardInputs } from '../types'
import { WWingRawHint } from '../../wWing/types'
import { getCandidatesListText } from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import _isEmpty from '@lodash/isEmpty'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

export const wWingTryOutAnalyser = (
    { wWing }: { wWing: WWingRawHint },
    boardInputs: BoardInputs
) => {
    const conjugateHouseCells = getNoteHostCellsInHouse(wWing.conjugateNote, wWing.conjugateHouse, boardInputs.actualNotes)
    const conjugateHouseFilled = anyCellHasTryOutInput(conjugateHouseCells, boardInputs)
    const removableNoteHostCellsFilled = anyCellHasTryOutInput(wWing.removableNoteHostCells, boardInputs)
    const nakedPairCellsFilled = anyCellHasTryOutInput(wWing.nakedPairCells, boardInputs)

    if (!(conjugateHouseFilled || removableNoteHostCellsFilled || nakedPairCellsFilled)) {
        const msgPlaceholdersValues = {
            nakedPairCandidates: getCandidatesListText(wWing.nakedPairNotes),
            removableCandidate: wWing.removableNote,
            removableNoteHostCells: getCellsAxesValuesListText(wWing.removableNoteHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        }
        return {
            msg: dynamicInterpolation(W_WING.NO_INPUT, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (removableNoteHostCellsFilled) {
        const filledRemovableNoteHostCell = filterFilledCellsInTryOut(wWing.removableNoteHostCells, boardInputs)[0]

        if (!(conjugateHouseFilled || nakedPairCellsFilled)) {
            const msgPlaceholdersValues = {
                nakedSinglesCells: getCellsAxesValuesListText(wWing.nakedPairCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND)
            }
            return {
                msg: dynamicInterpolation(W_WING.REMOVABLE_NOTE_CELL_FILLED.NO_OTHER_CELL_FILLED, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.START,
            }
        }

        if (conjugateHouseFilled) {
            const nakedPairCellWithNoCandidates = getCellsWithNoCandidates(wWing.nakedPairCells, boardInputs)[0]
            const msgPlaceholdersValues = {
                removableNote: wWing.removableNote,
                nakedPairCellWithNoCandidates: getCellAxesValues(nakedPairCellWithNoCandidates),
                filledRemovableNoteHostCell: getCellAxesValues(filledRemovableNoteHostCell),
            }
            return {
                msg: dynamicInterpolation(W_WING.REMOVABLE_NOTE_CELL_FILLED.CONJUGATE_HOUSE_FILLED, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        if (nakedPairCellsFilled) {
            const filledNakedPairCells = filterFilledCellsInTryOut(wWing.nakedPairCells, boardInputs)
            if (filledNakedPairCells.length === 1) {
                const msgPlaceholdersValues = {
                    emptyNakedPairCell: getCellAxesValues(filledNakedPairCells[0])
                }
                return {
                    msg: dynamicInterpolation(W_WING.REMOVABLE_NOTE_CELL_FILLED.ONE_NAKED_PAIR_CELL_FILLED, msgPlaceholdersValues),
                    state: TRY_OUT_RESULT_STATES.START,
                }
            }

            const msgPlaceholdersValues = {
                conjugateHouse: getHouseNumAndName(wWing.conjugateHouse),
                conjugateHouseNote: wWing.conjugateNote,
                removableNote: wWing.removableNote,
                filledRemovableNoteHostCell: getCellAxesValues(filledRemovableNoteHostCell),
            }
            return {
                msg: dynamicInterpolation(W_WING.REMOVABLE_NOTE_CELL_FILLED.BOTH_NAKED_PAIR_CELLS_FILLED, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }
    }

    if (conjugateHouseFilled) {
        if (!nakedPairCellsFilled && !removableNoteHostCellsFilled) {
            const nakedSingleCells = filterNakedSingleCells(wWing.nakedPairCells, boardInputs)
            const msgPlaceholdersValues = {
                nakedSinglesCells: getCellAxesValues(nakedSingleCells[0]),
                removableNote: wWing.removableNote
            }
            return {
                msg: dynamicInterpolation(W_WING.CONJUGATE_CELL_FILLED.NO_OTHER_CELL_FILLED, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

        if (nakedPairCellsFilled) {
            const emptyNakedPairCells = filterCellsWithoutTryoutInput(wWing.nakedPairCells, boardInputs)

            if (_isEmpty(emptyNakedPairCells)) {
                const msgPlaceholdersValues = { removableNote: wWing.removableNote }
                return {
                    msg: dynamicInterpolation(W_WING.CONJUGATE_CELL_FILLED.BOTH_NAKED_PAIR_CELL_FILLED, msgPlaceholdersValues),
                    state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
                }
            }

            if (emptyNakedPairCells.length === 1) {

                const nakedPairCellFilledWithRemovableNote = wWing.nakedPairCells.some((nakedPairCell) => {
                    return MainNumbersRecord.isCellFilledWithNumber(boardInputs.tryOutMainNumbers, wWing.removableNote, nakedPairCell)
                })

                if (nakedPairCellFilledWithRemovableNote) {
                    const msgPlaceholdersValues = {
                        removableNote: wWing.removableNote,
                        candidatesChoicesInEmptyCell: getCandidatesListText(NotesRecord.getCellVisibleNotesList(boardInputs.tryOutNotes, emptyNakedPairCells[0])),
                        emptyCell: getCellAxesValues(emptyNakedPairCells[0]),
                    }
                    return {
                        msg: dynamicInterpolation(W_WING.CONJUGATE_CELL_FILLED.ONE_NAKED_PAIR_CELL_FILLED.REMOVABLE_NOTE_FILLED_IN_NAKED_PAIR_CELL, msgPlaceholdersValues),
                        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
                    }
                }

                const msgPlaceholdersValues = {
                    emptyCell: getCellAxesValues(emptyNakedPairCells[0]),
                }
                return {
                    msg: dynamicInterpolation(W_WING.CONJUGATE_CELL_FILLED.ONE_NAKED_PAIR_CELL_FILLED.CONJUGATE_NOTE_FILLED_IN_NAKED_PAIR_CELL, msgPlaceholdersValues),
                    state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
                }
            }
        }
    }

    if (nakedPairCellsFilled) {
        const noPlaceForConjugateNote = !NotesRecord.isNotePresentInCell(boardInputs.tryOutNotes, wWing.conjugateNote, conjugateHouseCells[0])
            && !NotesRecord.isNotePresentInCell(boardInputs.tryOutNotes, wWing.conjugateNote, conjugateHouseCells[1])
        if (noPlaceForConjugateNote) {
            const msgPlaceholdersValues = {
                conjugateHouse: getHouseNumAndName(wWing.conjugateHouse),
                conjugateHouseNote: wWing.conjugateNote,
                nakedPairCells: getCellsAxesValuesListText(wWing.nakedPairCells)
            }
            return {
                msg: dynamicInterpolation(W_WING.NAKED_PAIR_CELL_FILLED.NO_PLACE_FOR_CONJUGATE_NOTE_IN_CONJUGATE_HOUSE, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const filledNakedPairCells = filterFilledCellsInTryOut(wWing.nakedPairCells, boardInputs)

        const allNakedPairCellsFilledWithRemovableNote = filledNakedPairCells.every((filledNakedPairCell) => {
            return MainNumbersRecord.isCellFilledWithNumber(boardInputs.tryOutMainNumbers, wWing.removableNote, filledNakedPairCell)
        })
        if (allNakedPairCellsFilledWithRemovableNote) {
            const msgPlaceholdersValues = {
                filledNakedPairCells: getCellsAxesValuesListText(filledNakedPairCells),
                removableNote: wWing.removableNote
            }
            return {
                msg: dynamicInterpolation(W_WING.NAKED_PAIR_CELL_FILLED.FILLED_WITH_REMOVABLE_NOTE, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

        const oneNakedPairCellFilledWithConjugateNote = filledNakedPairCells.length === 1
            && MainNumbersRecord.isCellFilledWithNumber(boardInputs.tryOutMainNumbers, wWing.conjugateNote, filledNakedPairCells[0])
        if (oneNakedPairCellFilledWithConjugateNote) {
            const msgPlaceholdersValues = {
                conjugateHouse: getHouseNumAndName(wWing.conjugateHouse),
                hiddenSingleCell: getCellAxesValues(getNoteHostCellsInHouse(wWing.conjugateNote, wWing.conjugateHouse, boardInputs.tryOutNotes)[0]),
                conjugateNote: wWing.conjugateNote,
            }
            return {
                msg: dynamicInterpolation(W_WING.NAKED_PAIR_CELL_FILLED.ONE_NAKED_PAIR_CELL_FILLED_WITH_CONJUGATE_NOTE, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

    }

    return {
        msg: 'Oops! Invalid State.',
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
