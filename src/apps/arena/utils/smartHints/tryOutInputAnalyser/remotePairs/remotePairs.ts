import _isEmpty from '@lodash/isEmpty'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _isNil from '@lodash/isNil'
import _keys from '@lodash/keys'
import _map from '@lodash/map'
import _unique from '@lodash/unique'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

import { convertBoardCellToNum } from '@domain/board/utils/cellsTransformers'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { TryOutInputsColors } from '../../types'

import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    filterCellsWithoutTryoutInput,
    filterFilledCellsInTryOut,
    getCellsWithNoCandidates,
    noInputInTryOut,
} from '../helpers'
import { BoardInputs } from '../types'
import { getCandidatesListText, getAxisValuesFromTranslations } from '../../util'
import { RemotePairsRawHint } from '../../chains/remotePairs/types'
import { SmartHintsTranslationsTexts } from '../../types'

const getNoInputResult = (smartHintsTranslationsTexts: SmartHintsTranslationsTexts) => ({
    msg: smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.noInput,
    state: TRY_OUT_RESULT_STATES.START,
})

const getFilledChainCellsGroupByColors = (
    filledChainCells: Cell[],
    inputsColors: TryOutInputsColors,
    boardInputs: BoardInputs,
) => {
    const result: { [fontColor: string]: Cell[] } = {}

    _forEach(filledChainCells, (cell: Cell) => {
        const cellMainValue = MainNumbersRecord.getCellMainValue(boardInputs.tryOutMainNumbers, cell)
        const cellNum = convertBoardCellToNum(cell)
        const mainValueFontColor = inputsColors[cellNum][cellMainValue]
        if (_isNil(result[mainValueFontColor])) {
            result[mainValueFontColor] = []
        }
        result[mainValueFontColor].push(cell)
    })

    return result
}

export const remotePairsTryOutAnalyser = (
    data: { remotePairs: RemotePairsRawHint, tryOutInputsColors: TryOutInputsColors },
    boardInputs: BoardInputs,
    smartHintsTranslationsTexts: SmartHintsTranslationsTexts,
) => {
    const { remotePairs, tryOutInputsColors } = data

    const { removableNotesHostCells, orderedChainCells } = remotePairs
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    if (noInputInTryOut([...orderedChainCells, ...removableNotesHostCells], boardInputs)) {
        return getNoInputResult(smartHintsTranslationsTexts)
    }

    const filledChainCells = filterFilledCellsInTryOut(orderedChainCells, boardInputs)
    const chainCellsGroupByFilledNumberFontColor = getFilledChainCellsGroupByColors(filledChainCells, tryOutInputsColors, boardInputs)
    const errorInFillingChainCells = _keys(chainCellsGroupByFilledNumberFontColor).length === 2
    const chainCellsWithoutAnyCandidates = getCellsWithNoCandidates(orderedChainCells, boardInputs)

    const filledRemovableNotesHostCells = filterFilledCellsInTryOut(removableNotesHostCells, boardInputs)
    if (!_isEmpty(filledRemovableNotesHostCells)) {
        if (!_isEmpty(chainCellsWithoutAnyCandidates)) {
            const placeholderValues = {
                emptyCells: getCellsAxesValuesListText(chainCellsWithoutAnyCandidates, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
                removableNotesFilledHostCells: getCellsAxesValuesListText(filledRemovableNotesHostCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
            }

            const msgTemplate = _isEmpty(filledChainCells) || !errorInFillingChainCells
                ? smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.removableNotesCellFilled.chainCellWithoutCandidate.onlyRemovableNotesFilled
                : smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.removableNotesCellFilled.chainCellWithoutCandidate.bothColorsCandidatesFilled

            return ({
                msg: dynamicInterpolation(msgTemplate, placeholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            })
        }

        const removableNotesFilled = _unique(_map(filledRemovableNotesHostCells, (cell: Cell) => MainNumbersRecord.getCellMainValue(boardInputs.tryOutMainNumbers, cell)))
        const placeholderValues = {
            removableNotesFilled: getCandidatesListText(removableNotesFilled, smartHintsTranslationsTexts.common.conjugations.and),
            removableNotesFilledHostCells: getCellsAxesValuesListText(filledRemovableNotesHostCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
        }

        if (!_isEmpty(filledChainCells)) {
            return ({
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.removableNotesCellFilled.chainCellsPartiallyFilled, placeholderValues),
                state: TRY_OUT_RESULT_STATES.START,
            })
        }

        return ({
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.removableNotesCellFilled.allChainCellsEmpty, placeholderValues),
            state: TRY_OUT_RESULT_STATES.START,
        })
    }

    const emptyChainCells = filterCellsWithoutTryoutInput(orderedChainCells, boardInputs)
    if (_isEmpty(emptyChainCells)) {
        return ({
            msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.validFill.full, { removableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCells, smartHintsTranslationsTexts.common.conjugations.and, axisValues) }),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        })
    }

    if (errorInFillingChainCells) {
        if (!_isEmpty(chainCellsWithoutAnyCandidates)) {
            const mainNumbersColors = _keys(chainCellsGroupByFilledNumberFontColor)
            const colorACells = getCellsAxesValuesListText(chainCellsGroupByFilledNumberFontColor[mainNumbersColors[0]], smartHintsTranslationsTexts.common.conjugations.and, axisValues)
            const colorBCells = getCellsAxesValuesListText(chainCellsGroupByFilledNumberFontColor[mainNumbersColors[1]], smartHintsTranslationsTexts.common.conjugations.and, axisValues)
            const placeholderValues = {
                emptyCells: getCellsAxesValuesListText(chainCellsWithoutAnyCandidates, smartHintsTranslationsTexts.common.conjugations.and, axisValues),
                colorACells,
                colorBCells,
            }
            return ({
                msg: dynamicInterpolation(smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.chainCellsBothColorCandidatesFilled.cellWithNoCandidates, placeholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            })
        }

        return ({
            msg: smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.chainCellsBothColorCandidatesFilled.cellWithNoCandidatesInProgress,
            state: TRY_OUT_RESULT_STATES.START,
        })
    }

    return ({
        msg: smartHintsTranslationsTexts.tryOutAnalyser.remotePairs.validFill.partial,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    })
}
