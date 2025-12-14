import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _sortBy from '@lodash/sortBy'
import _unique from '@lodash/unique'
import _head from '@lodash/head'

import { NotesRecord } from '@domain/board/records/notesRecord'

import { getCellAxesValues, getNoteHostCellsInHouse } from '../../../util'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { anyCellHasTryOutInput, filterFilledCellsInTryOut } from '../helpers'

import { EmptyRectangleRawHint } from '../../emptyRectangle/types'

import { BoardInputs } from '../types'
import { getBlockHostHouse } from '../../emptyRectangle/helpers'
import { getHouseWithNumAndNameText, getAxisValuesFromTranslations } from '../../util'
import { SmartHintsTranslationsTexts } from '../../types'

export const emptyRectangleTryOutAnalyser = (
    { emptyRectangle }: { emptyRectangle: EmptyRectangleRawHint },
    boardInputs: BoardInputs,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {
    const blockHostHouse = getBlockHostHouse(emptyRectangle)
    const conjugateHouseCells = getNoteHostCellsInHouse(emptyRectangle.note, emptyRectangle.conjugateHouse, boardInputs.actualNotes)
    const blockHostHouseCells = getNoteHostCellsInHouse(emptyRectangle.note, blockHostHouse, boardInputs.actualNotes)

    const conjugateHouseFilled = anyCellHasTryOutInput(conjugateHouseCells, boardInputs)
    const blockHostHouseFilled = anyCellHasTryOutInput(blockHostHouseCells, boardInputs)
    const removableNoteHostCellFilled = anyCellHasTryOutInput([emptyRectangle.removableNotesHostCell], boardInputs)

    const config = smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.config
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    if (!(conjugateHouseFilled || blockHostHouseFilled || removableNoteHostCellFilled)) {
        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell, axisValues)
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.noInput, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (removableNoteHostCellFilled) {
        if (conjugateHouseFilled || blockHostHouseFilled) {
            const inhabitableHouse = conjugateHouseFilled ? blockHostHouse : emptyRectangle.conjugateHouse
            const msgPlaceholdersValues = {
                candidate: emptyRectangle.note,
                candidateInhabitableHostHouse: getHouseWithNumAndNameText(inhabitableHouse, config.candidateInhabitableHostHouse, smartHintsTranslationsTexts),
                removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell, axisValues)
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.removableNoteCellFilled.blockOrConjugateHouseFilled, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            conjugateHouse: getHouseWithNumAndNameText(emptyRectangle.conjugateHouse, config.conjugateHouse, smartHintsTranslationsTexts),
            blockHostHouse: getHouseWithNumAndNameText(blockHostHouse, config.blockHostHouse, smartHintsTranslationsTexts)
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.removableNoteCellFilled.blockOrConjugateHouseNotFilled, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (conjugateHouseFilled && blockHostHouseFilled) {
        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            conjugateHouse: getHouseWithNumAndNameText(emptyRectangle.conjugateHouse, config.conjugateHouse, smartHintsTranslationsTexts),
            blockHostHouse: getHouseWithNumAndNameText(blockHostHouse, config.blockHostHouse, smartHintsTranslationsTexts),
            removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell, axisValues)
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.conjugateHouseAndBlockHostHouseFilled, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    if (conjugateHouseFilled) {
        const notePresentInCell = NotesRecord.isNotePresentInCell(boardInputs.tryOutNotes, emptyRectangle.note, emptyRectangle.removableNotesHostCell)
        if (notePresentInCell) {
            const msgPlaceholdersValues = {
                candidate: emptyRectangle.note,
                blockHostHouse: getHouseWithNumAndNameText(blockHostHouse, config.blockHostHouse, smartHintsTranslationsTexts),
                removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell, axisValues),
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.conjugateHouseFilled.removableNotePresent, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            filledHostCell: getCellAxesValues(_head(filterFilledCellsInTryOut(conjugateHouseCells, boardInputs)), axisValues),
            removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell, axisValues),
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.conjugateHouseFilled.removableNoteRemoved, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    if (blockHostHouseFilled) {
        const notePresentInCell = NotesRecord.isNotePresentInCell(boardInputs.tryOutNotes, emptyRectangle.note, emptyRectangle.removableNotesHostCell)
        if (notePresentInCell) {
            const msgPlaceholdersValues = {
                candidate: emptyRectangle.note,
                conjugateHouse: getHouseWithNumAndNameText(emptyRectangle.conjugateHouse, config.conjugateHouse, smartHintsTranslationsTexts),
                removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell, axisValues),
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.blockHostHouseFilled.removableNotePresent, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

        const msgPlaceholdersValues = {
            candidate: emptyRectangle.note,
            filledHostCell: getCellAxesValues(_head(filterFilledCellsInTryOut(blockHostHouseCells, boardInputs)), axisValues),
            removableNoteHostCell: getCellAxesValues(emptyRectangle.removableNotesHostCell, axisValues),
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.emptyRectangle.blockHostHouseFilled.removableNoteRemoved, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }

    return {
        msg: smartHintsTranslationsTexts.tryOutAnalyser.unattainableState,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
