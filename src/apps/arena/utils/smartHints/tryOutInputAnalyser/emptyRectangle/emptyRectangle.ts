import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _sortBy from '@lodash/sortBy'
import _unique from '@lodash/unique'
import _head from '@lodash/head'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'

import { getCellAxesValues, getNoteHostCellsInHouse } from '../../../util'

import { getHouseNumAndName } from '../../rawHintTransformers/helpers'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { anyCellHasTryOutInput, filterFilledCellsInTryOut } from '../helpers'
import { EMPTY_RECTANGLE } from '../stringLiterals'

import { EmptyRectangleRawHint } from '../../emptyRectangle/types'

import { BoardInputs } from '../types'
import { getBlockHostHouse } from '../../emptyRectangle/helpers'

export const emptyRectangleTryOutAnalyser = (
    { emptyRectangle }: { emptyRectangle: EmptyRectangleRawHint },
    boardInputs: BoardInputs
) => {
    const blockHostHouse = getBlockHostHouse(emptyRectangle)
    const conjugateHouseCells = getNoteHostCellsInHouse(emptyRectangle.note, emptyRectangle.conjugateHouse, boardInputs.actualNotes)
    const blockHostHouseCells = getNoteHostCellsInHouse(emptyRectangle.note, blockHostHouse, boardInputs.actualNotes)

    const conjugateHouseFilled = anyCellHasTryOutInput(conjugateHouseCells, boardInputs)
    const blockHostHouseFilled = anyCellHasTryOutInput(blockHostHouseCells, boardInputs)
    const removableNoteHostCellFilled = anyCellHasTryOutInput([emptyRectangle.removableNotesHostCell], boardInputs)

    if (!(conjugateHouseFilled || blockHostHouseFilled || removableNoteHostCellFilled)) {
        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell)
        }
        return {
            msg: dynamicInterpolation(EMPTY_RECTANGLE.NO_INPUT, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (removableNoteHostCellFilled) {
        if (conjugateHouseFilled || blockHostHouseFilled) {
            const msgPlaceholdersValues = {
                candidate: emptyRectangle.note,
                candidateInhabitableHostHouse: getHouseNumAndName(conjugateHouseFilled ? blockHostHouse : emptyRectangle.conjugateHouse),
                removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell)
            }
            return {
                msg: dynamicInterpolation(EMPTY_RECTANGLE.REMOVABLE_NOTE_CELL_FILLED.BLOCK_OR_CONJUGATE_HOUSE_FILLED, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            conjugateHouse: getHouseNumAndName(emptyRectangle.conjugateHouse),
            blockHostHouse: getHouseNumAndName(blockHostHouse)
        }
        return {
            msg: dynamicInterpolation(EMPTY_RECTANGLE.REMOVABLE_NOTE_CELL_FILLED.BLOCK_OR_CONJUGATE_HOUSE_NOT_FILLED, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (conjugateHouseFilled && blockHostHouseFilled) {
        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            conjugateHouse: getHouseNumAndName(emptyRectangle.conjugateHouse),
            blockHostHouse: getHouseNumAndName(blockHostHouse),
            removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell)
        }
        return {
            msg: dynamicInterpolation(EMPTY_RECTANGLE.CONJUGATE_HOUSE_AND_BLOCK_HOST_HOUSE_FILLED, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    if (conjugateHouseFilled) {
        const notePresentInCell = NotesRecord.isNotePresentInCell(boardInputs.tryOutNotes, emptyRectangle.note, emptyRectangle.removableNotesHostCell)
        if (notePresentInCell) {
            const msgPlaceholdersValues = {
                candidate: emptyRectangle.note,
                blockHostHouse: getHouseNumAndName(blockHostHouse),
                removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell),
            }
            return {
                msg: dynamicInterpolation(EMPTY_RECTANGLE.CONJUGATE_HOUSE_FILLED.REMOVABLE_NOTE_PRESENT, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            filledHostCell: getCellAxesValues(_head(filterFilledCellsInTryOut(conjugateHouseCells, boardInputs))),
            removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell),
        }
        return {
            msg: dynamicInterpolation(EMPTY_RECTANGLE.CONJUGATE_HOUSE_FILLED.REMOVABLE_NOTE_REMOVED, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    if (blockHostHouseFilled) {
        const notePresentInCell = NotesRecord.isNotePresentInCell(boardInputs.tryOutNotes, emptyRectangle.note, emptyRectangle.removableNotesHostCell)
        if (notePresentInCell) {
            const msgPlaceholdersValues = {
                candidate: emptyRectangle.note,
                conjugateHouse: getHouseNumAndName(emptyRectangle.conjugateHouse),
                removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell),
            }
            return {
                msg: dynamicInterpolation(EMPTY_RECTANGLE.BLOCK_HOST_HOUSE_FILLED.REMOVABLE_NOTE_PRESENT, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            filledHostCell: getCellAxesValues(_head(filterFilledCellsInTryOut(blockHostHouseCells, boardInputs))),
            removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell),
        }
        return {
            msg: dynamicInterpolation(EMPTY_RECTANGLE.BLOCK_HOST_HOUSE_FILLED.REMOVABLE_NOTE_REMOVED, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    return {
        msg: 'Oops! Invalid State.',
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
