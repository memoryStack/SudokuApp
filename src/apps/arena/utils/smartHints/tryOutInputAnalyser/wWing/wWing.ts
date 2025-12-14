import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _sortBy from '@lodash/sortBy'
import _unique from '@lodash/unique'
import _head from '@lodash/head'

import { NotesRecord } from '@domain/board/records/notesRecord'

import { getCellAxesValues, getNoteHostCellsInHouse } from '../../../util'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'

import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    anyCellHasTryOutInput,
    filterCellsWithoutTryoutInput,
    filterFilledCellsInTryOut,
    filterNakedSingleCells,
    getCellsWithNoCandidates
} from '../helpers'

import { BoardInputs } from '../types'
import { WWingRawHint } from '../../wWing/types'
import { getCandidatesListText, getHouseWithNumAndNameText, getAxisValuesFromTranslations } from '../../util'
import _isEmpty from '@lodash/isEmpty'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { SmartHintsTranslationsTexts } from '../../types'

export const wWingTryOutAnalyser = (
    { wWing }: { wWing: WWingRawHint },
    boardInputs: BoardInputs,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts
) => {
    const conjugateHouseCells = getNoteHostCellsInHouse(wWing.conjugateNote, wWing.conjugateHouse, boardInputs.actualNotes)
    const conjugateHouseFilled = anyCellHasTryOutInput(conjugateHouseCells, boardInputs)
    const removableNoteHostCellsFilled = anyCellHasTryOutInput(wWing.removableNoteHostCells, boardInputs)
    const nakedPairCellsFilled = anyCellHasTryOutInput(wWing.nakedPairCells, boardInputs)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const config = smartHintsTranslationsTexts.tryOutAnalyser.wWing.config

    if (!(conjugateHouseFilled || removableNoteHostCellsFilled || nakedPairCellsFilled)) {
        const msgPlaceholdersValues = {
            nakedPairCandidates: getCandidatesListText(wWing.nakedPairNotes, smartHintsTranslationsTexts.common.conjugations.and),
            removableCandidate: wWing.removableNote,
            removableNoteHostCells: getCellsAxesValuesListText(wWing.removableNoteHostCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
        }
        return {
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.noInput, msgPlaceholdersValues),
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    if (removableNoteHostCellsFilled) {
        const filledRemovableNoteHostCell = filterFilledCellsInTryOut(wWing.removableNoteHostCells, boardInputs)[0]

        if (!(conjugateHouseFilled || nakedPairCellsFilled)) {
            const msgPlaceholdersValues = {
                nakedSinglesCells: getCellsAxesValuesListText(wWing.nakedPairCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues)
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.removableNoteCellFilled.noOtherCellFilled, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.START,
            }
        }

        if (conjugateHouseFilled) {
            const nakedPairCellWithNoCandidates = getCellsWithNoCandidates(wWing.nakedPairCells, boardInputs)[0]
            const msgPlaceholdersValues = {
                removableNote: wWing.removableNote,
                nakedPairCellWithNoCandidates: getCellAxesValues(nakedPairCellWithNoCandidates, axisValues),
                filledRemovableNoteHostCell: getCellAxesValues(filledRemovableNoteHostCell, axisValues),
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.removableNoteCellFilled.conjugateHouseFilled, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        if (nakedPairCellsFilled) {
            const filledNakedPairCells = filterFilledCellsInTryOut(wWing.nakedPairCells, boardInputs)
            if (filledNakedPairCells.length === 1) {
                const msgPlaceholdersValues = {
                    emptyNakedPairCell: getCellAxesValues(filledNakedPairCells[0], axisValues)
                }
                return {
                    msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.removableNoteCellFilled.oneNakedPairCellFilled, msgPlaceholdersValues),
                    state: TRY_OUT_RESULT_STATES.START,
                }
            }

            const msgPlaceholdersValues = {
                conjugateHouse: getHouseWithNumAndNameText(wWing.conjugateHouse, config.conjugateHouse, smartHintsTranslationsTexts),
                conjugateHouseNote: wWing.conjugateNote,
                removableNote: wWing.removableNote,
                filledRemovableNoteHostCell: getCellAxesValues(filledRemovableNoteHostCell, axisValues),
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.removableNoteCellFilled.bothNakedPairCellsFilled, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }
    }

    if (conjugateHouseFilled) {
        if (!nakedPairCellsFilled && !removableNoteHostCellsFilled) {
            const nakedSingleCells = filterNakedSingleCells(wWing.nakedPairCells, boardInputs)
            const msgPlaceholdersValues = {
                nakedSinglesCells: getCellAxesValues(nakedSingleCells[0], axisValues),
                removableNote: wWing.removableNote
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.conjugateCellFilled.noOtherCellFilled, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

        if (nakedPairCellsFilled) {
            const emptyNakedPairCells = filterCellsWithoutTryoutInput(wWing.nakedPairCells, boardInputs)

            if (_isEmpty(emptyNakedPairCells)) {
                const msgPlaceholdersValues = { removableNote: wWing.removableNote }
                return {
                    msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.conjugateCellFilled.bothNakedPairCellFilled, msgPlaceholdersValues),
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
                        candidatesChoicesInEmptyCell: getCandidatesListText(NotesRecord.getCellVisibleNotesList(boardInputs.tryOutNotes, emptyNakedPairCells[0]), smartHintsTranslationsTexts.common.conjugations.and),
                        emptyCell: getCellAxesValues(emptyNakedPairCells[0], axisValues),
                    }
                    return {
                        msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.conjugateCellFilled.oneNakedPairCellFilled.removableNoteFilledInNakedPairCell, msgPlaceholdersValues),
                        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
                    }
                }

                const msgPlaceholdersValues = {
                    emptyCell: getCellAxesValues(emptyNakedPairCells[0], axisValues),
                }
                return {
                    msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.conjugateCellFilled.oneNakedPairCellFilled.conjugateNoteFilledInNakedPairCell, msgPlaceholdersValues),
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
                conjugateHouse: getHouseWithNumAndNameText(wWing.conjugateHouse, config.conjugateHouse, smartHintsTranslationsTexts),
                conjugateHouseNote: wWing.conjugateNote,
                nakedPairCells: getCellsAxesValuesListText(wWing.nakedPairCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues)
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.nakedPairCellFilled.noPlaceForConjugateNoteInConjugateHouse, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            }
        }

        const filledNakedPairCells = filterFilledCellsInTryOut(wWing.nakedPairCells, boardInputs)

        const allNakedPairCellsFilledWithRemovableNote = filledNakedPairCells.every((filledNakedPairCell) => {
            return MainNumbersRecord.isCellFilledWithNumber(boardInputs.tryOutMainNumbers, wWing.removableNote, filledNakedPairCell)
        })
        if (allNakedPairCellsFilledWithRemovableNote) {
            const msgPlaceholdersValues = {
                filledNakedPairCells: getCellsAxesValuesListText(filledNakedPairCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
                removableNote: wWing.removableNote
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.nakedPairCellFilled.filledWithRemovableNote, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

        const oneNakedPairCellFilledWithConjugateNote = filledNakedPairCells.length === 1
            && MainNumbersRecord.isCellFilledWithNumber(boardInputs.tryOutMainNumbers, wWing.conjugateNote, filledNakedPairCells[0])
        if (oneNakedPairCellFilledWithConjugateNote) {
            const msgPlaceholdersValues = {
                conjugateHouse: getHouseWithNumAndNameText(wWing.conjugateHouse, config.conjugateHouse, smartHintsTranslationsTexts),
                hiddenSingleCell: getCellAxesValues(getNoteHostCellsInHouse(wWing.conjugateNote, wWing.conjugateHouse, boardInputs.tryOutNotes)[0], axisValues),
                conjugateNote: wWing.conjugateNote,
            }
            return {
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.wWing.nakedPairCellFilled.oneNakedPairCellFilledWithConjugateNote, msgPlaceholdersValues),
                state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
            }
        }

    }

    return {
        msg: smartHintsTranslationsTexts.tryOutAnalyser.unattainableState,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}
