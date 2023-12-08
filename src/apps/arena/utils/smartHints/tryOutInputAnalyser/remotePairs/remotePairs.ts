import _isEmpty from '@lodash/isEmpty'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _isNil from '@lodash/isNil'
import _keys from '@lodash/keys'
import _map from '@lodash/map'
import _unique from '@lodash/unique'

import { MainNumbersRecord } from '../../../../RecordUtilities/boardMainNumbers'

import { convertBoardCellToNum } from '../../../cellTransformers'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { TryOutInputsColors } from '../../types'

import { TRY_OUT_RESULT_STATES } from '../constants'
import {
    filterCellsWithoutTryoutInput,
    filterFilledCellsInTryOut,
    getCellsWithNoCandidates,
    noInputInTryOut,
} from '../helpers'
import { REMOTE_PAIRS } from '../stringLiterals'
import { BoardInputs } from '../types'
import { getCandidatesListText } from '../../util'
import { RemotePairsRawHint } from '../../remotePairs/types'

const getNoInputResult = () => ({
    msg: REMOTE_PAIRS.NO_INPUT,
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
) => {
    const { remotePairs, tryOutInputsColors } = data

    const { removableNotesHostCells, orderedChainCells } = remotePairs

    if (noInputInTryOut([...orderedChainCells, ...removableNotesHostCells], boardInputs)) {
        return getNoInputResult()
    }

    const filledChainCells = filterFilledCellsInTryOut(orderedChainCells, boardInputs)
    const chainCellsGroupByFilledNumberFontColor = getFilledChainCellsGroupByColors(filledChainCells, tryOutInputsColors, boardInputs)
    const errorInFillingChainCells = _keys(chainCellsGroupByFilledNumberFontColor).length === 2
    const chainCellsWithoutAnyCandidates = getCellsWithNoCandidates(orderedChainCells, boardInputs)

    const filledRemovableNotesHostCells = filterFilledCellsInTryOut(removableNotesHostCells, boardInputs)
    if (!_isEmpty(filledRemovableNotesHostCells)) {
        if (!_isEmpty(chainCellsWithoutAnyCandidates)) {
            const placeholderValues = {
                emptyCells: getCellsAxesValuesListText(chainCellsWithoutAnyCandidates),
                removableNotesFilledHostCells: getCellsAxesValuesListText(filledRemovableNotesHostCells),
            }

            const msgTemplate = _isEmpty(filledChainCells) || !errorInFillingChainCells
                ? REMOTE_PAIRS.REMOVABLE_NOTES_CELL_FILLED.CHAIN_CELL_WITHOUT_CANDIDATE.ONLY_REMOVABLE_NOTES_FILLED
                : REMOTE_PAIRS.REMOVABLE_NOTES_CELL_FILLED.CHAIN_CELL_WITHOUT_CANDIDATE.BOTH_COLORS_CANDIDATES_FILLED

            return ({
                msg: dynamicInterpolation(msgTemplate, placeholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            })
        }

        const removableNotesFilled = _unique(_map(filledRemovableNotesHostCells, (cell: Cell) => MainNumbersRecord.getCellMainValue(boardInputs.tryOutMainNumbers, cell)))
        const placeholderValues = {
            removableNotesFilled: getCandidatesListText(removableNotesFilled),
            removableNotesFilledHostCells: getCellsAxesValuesListText(filledRemovableNotesHostCells),
        }

        if (!_isEmpty(filledChainCells)) {
            return ({
                msg: dynamicInterpolation(REMOTE_PAIRS.REMOVABLE_NOTES_CELL_FILLED.CHAIN_CELLS_PARTIALLY_FILLED, placeholderValues),
                state: TRY_OUT_RESULT_STATES.START,
            })
        }

        return ({
            msg: dynamicInterpolation(REMOTE_PAIRS.REMOVABLE_NOTES_CELL_FILLED.ALL_CHAIN_CELLS_EMPTY, placeholderValues),
            state: TRY_OUT_RESULT_STATES.START,
        })
    }

    const emptyChainCells = filterCellsWithoutTryoutInput(orderedChainCells, boardInputs)
    if (_isEmpty(emptyChainCells)) {
        return ({
            msg: dynamicInterpolation(REMOTE_PAIRS.VALID_FILL.FULL, { removableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND) }),
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        })
    }

    if (errorInFillingChainCells) {
        if (!_isEmpty(chainCellsWithoutAnyCandidates)) {
            const mainNumbersColors = _keys(chainCellsGroupByFilledNumberFontColor)
            const colorACells = getCellsAxesValuesListText(chainCellsGroupByFilledNumberFontColor[mainNumbersColors[0]])
            const colorBCells = getCellsAxesValuesListText(chainCellsGroupByFilledNumberFontColor[mainNumbersColors[1]])
            const placeholderValues = {
                emptyCells: getCellsAxesValuesListText(chainCellsWithoutAnyCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
                colorACells,
                colorBCells,
            }
            return ({
                msg: dynamicInterpolation(REMOTE_PAIRS.CHAIN_CELLS_BOTH_COLOR_CANDIDATES_FILLED.CELL_WITH_NO_CANDIDATES, placeholderValues),
                state: TRY_OUT_RESULT_STATES.ERROR,
            })
        }

        return ({
            msg: REMOTE_PAIRS.CHAIN_CELLS_BOTH_COLOR_CANDIDATES_FILLED.CELL_WITH_NO_CANDIDATES_IN_PROGRESS,
            state: TRY_OUT_RESULT_STATES.START,
        })
    }

    return ({
        msg: REMOTE_PAIRS.VALID_FILL.PARTIAL,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    })
}
