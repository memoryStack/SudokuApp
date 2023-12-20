import _map from '@lodash/map'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _keys from '@lodash/keys'
import _isNil from '@lodash/isNil'
import _compact from '@lodash/compact'
import _head from '@lodash/head'
import _reverse from '@lodash/reverse'
import _last from '@lodash/last'

import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import _difference from '@lodash/difference'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import {
    TransformedRawHint,
    SmartHintsColorSystem,
    CellsFocusData,
    Chain,
    NotesToHighlightData,
    NotesRemovalHintAction,
    InputPanelNumbersVisibility,
    TryOutInputsColors,
    ChainLink,
} from '../../types'
import { XYChainTransformerArgs } from './types'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { XChainRawHint } from '../../chains/xChain/types'
import { BoardIterators } from '../../../classes/boardIterators'
import {
    getHintExplanationStepsFromHintChunks,
    setCellDataInHintResult,
    transformCellBGColor,
    setCellNotesHighlightDataInHintResult,
    getTryOutInputPanelNumbersVisibility,
} from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { LINK_TYPES } from '../../chains/xChain/xChain.constants'
import { convertBoardCellToNum } from '../../../cellTransformers'
import { getCellsAxesValuesListText, getHouseNumAndName, joinStringsListWithArrow } from '../helpers'
import { getCellAxesValues, getCellsCommonHousesInfo } from '../../../util'
import { XYChainRawHint } from '../../chains/xyChain/types'

const CHAIN_CELLS_NOTES_COLORS_TEXT = ['blue', 'green']

const CHAIN_CELLS_NOTES_COLORS = ['#4B61D1', 'green']

const getUICellsToFocusData = (
    xyChain: XYChainRawHint,
    smartHintsColorSystem: SmartHintsColorSystem,
    notes: Notes,
): CellsFocusData => {
    const result = {}

    BoardIterators.forBoardEachCell(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        setCellDataInHintResult(cell, cellHighlightData, result)
    })

    const { note, removableNotesHostCells, chain: chainCells } = xyChain

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

const getExplainationStepsText = () => {
    const a = 10
    return [{
        text: 'explaination coming soon',
    }]
}

const getNumberToFillInChainCell = (cell: Cell, numberNotToFill: number, notes: Notes) => _head(
    _difference(
        NotesRecord.getCellVisibleNotesList(notes, cell),
        [numberNotToFill],
    ),
)

const getSvgData = (xyChain: XYChainRawHint, notes: Notes) => {
    const result: Chain = []

    const { note, chain: chainCells } = xyChain

    let numberToFillInStartCell = getNumberToFillInChainCell(chainCells[0], note, notes)
    for (let i = 1; i < chainCells.length; i++) {
        const startCell = chainCells[i - 1]
        const endCell = chainCells[i]
        result.push({
            start: { cell: startCell, note: numberToFillInStartCell },
            end: { cell: endCell, note: numberToFillInStartCell },
            type: LINK_TYPES.WEAK,
        })
        numberToFillInStartCell = getNumberToFillInChainCell(endCell, numberToFillInStartCell, notes)
    }

    return result
}

const addLinkCellsNotesHighlightedColor = (
    chainLinks: Chain,
    notes: Notes,
    cellsToFocusData: CellsFocusData,
) => {
    const highlightLinkTerminal = (linkTerminal: ChainLink['start' | 'end']) => {
        const { cell, note: noteToBeFilledInCell } = linkTerminal
        const notesHighlightData: NotesToHighlightData = {}
        notesHighlightData[noteToBeFilledInCell] = { fontColor: CHAIN_CELLS_NOTES_COLORS[1] }
        const noteRemovedFromCell = getNumberToFillInChainCell(cell, noteToBeFilledInCell, notes)
        notesHighlightData[noteRemovedFromCell] = { fontColor: CHAIN_CELLS_NOTES_COLORS[0] }
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, cellsToFocusData)
    }

    _forEach(chainLinks, (chainLink: ChainLink) => {
        highlightLinkTerminal(chainLink.start)
    })
    highlightLinkTerminal(_last(chainLinks).end)
}

export const transformXYChainRawHint = ({ rawHint: xyChain, notesData, smartHintsColorSystem }: XYChainTransformerArgs): TransformedRawHint => {
    const chainLinks = getSvgData(xyChain, notesData)
    const cellsToFocusData = getUICellsToFocusData(xyChain, smartHintsColorSystem, notesData)
    addLinkCellsNotesHighlightedColor(chainLinks, notesData, cellsToFocusData)
    // const { note, chain, removableNotesHostCells } = xChain
    // const clickableCells = [...chain, ...removableNotesHostCells]

    // const tryOutInputsColors = getTryOutInputsColors(clickableCells, cellsToFocusData)

    return ({
        type: HINTS_IDS.XY_CHAIN,
        title: HINT_ID_VS_TITLES[HINTS_IDS.XY_CHAIN],
        cellsToFocusData,
        // focusedCells: clickableCells,
        steps: getExplainationStepsText(),
        svgProps: { data: chainLinks },
        hasTryOut: false, // TODO:
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([note]) as InputPanelNumbersVisibility,
        // // tryOutAnalyserData: { xChain, tryOutInputsColors },
        // tryOutAnalyserData: { xChain },
        // clickableCells,
        // unclickableCellClickInTryOutMsg: 'you can only select Chain cells or cells which have candidates highlighted in red color',
        // applyHint: getApplyHintData(xChain),
        // tryOutInputsColors,
    })
}
