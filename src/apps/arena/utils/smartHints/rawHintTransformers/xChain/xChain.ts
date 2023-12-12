import _map from '@lodash/map'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _keys from '@lodash/keys'
import _isNil from '@lodash/isNil'

import { BOARD_MOVES_TYPES } from 'src/apps/arena/constants'
import {
    TransformedRawHint,
    SmartHintsColorSystem,
    CellsFocusData,
    Chain,
    NotesToHighlightData,
    NotesRemovalHintAction,
    InputPanelNumbersVisibility,
    TryOutInputsColors,
} from '../../types'
import { XChainTransformerArgs } from './types'
import { HINTS_IDS } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { XChainRawHint } from '../../xChain/types'
import { BoardIterators } from '../../../classes/boardIterators'
import {
    getHintExplanationStepsFromHintChunks,
    setCellDataInHintResult,
    transformCellBGColor,
    setCellNotesHighlightDataInHintResult,
    getTryOutInputPanelNumbersVisibility,
} from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { LINK_TYPES } from '../../xChain/xChain.constants'
import { convertBoardCellToNum } from '../../../cellTransformers'

// TODO: these colors are also used in remote pairs as well
const CHAIN_CELLS_NOTES_COLORS_TEXT = ['blue', 'green']

const CHAIN_CELLS_NOTES_COLORS = ['#4B61D1', 'green']

const getUICellsToFocusData = (xChain: XChainRawHint, smartHintsColorSystem: SmartHintsColorSystem): CellsFocusData => {
    const result = {}

    BoardIterators.forBoardEachCell(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        setCellDataInHintResult(cell, cellHighlightData, result)
    })

    const { note, removableNotesHostCells, chain: chainCells } = xChain

    _forEach(removableNotesHostCells, (cell: Cell) => {
        const notesHighlightData: NotesToHighlightData = {}
        notesHighlightData[note] = {
            fontColor: 'red',
        }
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, result)
    })

    _forEach(chainCells, (cell: Cell, indx: number) => {
        const notesHighlightData: NotesToHighlightData = {}
        notesHighlightData[note] = { fontColor: CHAIN_CELLS_NOTES_COLORS[indx % 2] }
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, result)
    })

    return result
}

const getExplainationStepsText = (xChain: XChainRawHint, notes: Notes) => {
    const rawExplainationTexts = HINT_EXPLANATION_TEXTS[HINTS_IDS.REMOTE_PAIRS]
    const placeholdersValues = {}
    const explainationTextsWithPlaceholdersFilled = _map(rawExplainationTexts, (aStepRawText: string) => dynamicInterpolation(aStepRawText, placeholdersValues))
    return getHintExplanationStepsFromHintChunks(explainationTextsWithPlaceholdersFilled)
}

const getSvgData = (xChain: XChainRawHint) => {
    const { note, chain: chainCells } = xChain

    const result: Chain = []
    for (let i = 1; i < chainCells.length; i++) {
        const startCell = chainCells[i - 1]
        const endCell = chainCells[i]

        result.push({
            start: { cell: startCell, note },
            end: { cell: endCell, note },
            type: i % 2 === 1 ? LINK_TYPES.STRONG : LINK_TYPES.WEAK,
        })
    }

    return result
}

const getApplyHintData = (xChain: XChainRawHint) => {
    const result: NotesRemovalHintAction[] = []

    const { note, removableNotesHostCells } = xChain
    _forEach(removableNotesHostCells, (cell: Cell) => {
        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [note] },
        })
    })
    return result
}

// TODO: this is copied as it is from remotepairs
const getTryOutInputsColors = (
    chainCells: Cell[],
    cellsToFocusData: CellsFocusData,
) => {
    const result: TryOutInputsColors = { }

    _forEach(chainCells, (cell: Cell) => {
        const cellNum = convertBoardCellToNum(cell)
        const cellNotesHighlightData = cellsToFocusData[cell.row][cell.col].notesToHighlightData as NotesToHighlightData
        const highlightedNotes = _keys(cellNotesHighlightData)
        _forEach(highlightedNotes, (note: number) => {
            if (_isNil(result[cellNum])) result[cellNum] = {}
            result[cellNum][note] = cellNotesHighlightData[note].fontColor
        })
    })

    return result
}

export const transformXChainRawHint = ({ rawHint: xChain, notesData, smartHintsColorSystem }: XChainTransformerArgs): TransformedRawHint => {
    const cellsToFocusData = getUICellsToFocusData(xChain, smartHintsColorSystem)

    const { note, chain, removableNotesHostCells } = xChain
    const clickableCells = [...chain, ...removableNotesHostCells]

    const tryOutInputsColors = getTryOutInputsColors(clickableCells, cellsToFocusData)

    return ({
        type: HINTS_IDS.X_CHAIN,
        title: HINT_ID_VS_TITLES[HINTS_IDS.X_CHAIN],
        cellsToFocusData,
        focusedCells: clickableCells,
        steps: getExplainationStepsText(xChain, notesData),
        svgProps: { data: getSvgData(xChain) },
        hasTryOut: true,
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([note]) as InputPanelNumbersVisibility,
        tryOutAnalyserData: { xChain, tryOutInputsColors },
        clickableCells,
        unclickableCellClickInTryOutMsg: 'you can only select Chain cells or cells which have candidates highlighted in red color',
        applyHint: getApplyHintData(xChain),
        tryOutInputsColors,
    })
}
