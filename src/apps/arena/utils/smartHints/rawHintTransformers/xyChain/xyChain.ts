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
import _intersection from '@lodash/intersection'
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
import { BoardIterators } from '@domain/board/utils/boardIterators'
import {
    getHintExplanationStepsFromHintChunks,
    setCellDataInHintResult,
    transformCellBGColor,
    setCellNotesHighlightDataInHintResult,
    getTryOutInputPanelNumbersVisibility,
} from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { LINK_TYPES } from '../../chains/xChain/xChain.constants'
import { convertBoardCellToNum } from '@domain/board/utils/cellsTransformers'
import {
    getCellsAxesList, getCellsAxesValuesListText, getHouseNumAndName, joinStringsListWithArrow,
} from '../helpers'
import { getCellAxesValues, getCellsCommonHousesInfo, getCommonNoteInCells } from '../../../util'
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

const getExplainationStepsText = (xyChain: XYChainRawHint, notes: Notes) => {
    const { note: removableNote, chain, removableNotesHostCells } = xyChain
    const chainFirstCellAxesText = getCellAxesValues(chain[0])
    const chainSecondCellAxesText = getCellAxesValues(chain[1])
    const chainLastCellAxesText = getCellAxesValues(_last(chain))

    const firstCellCandidateOtherThanRemovableCandidate = _difference(NotesRecord.getCellVisibleNotesList(notes, chain[0]), [removableNote])[0]

    const chainCellFillingText = '{{cell}} must be filled by {{candidate}}'

    let previousCellFilledCandidate = firstCellCandidateOtherThanRemovableCandidate
    const chainFillingWay = _compact(_map(chain, (cell: Cell, index: number) => {
        if (index === 0) return null

        const currentCellCandidate = _difference(NotesRecord.getCellVisibleNotesList(notes, cell), [previousCellFilledCandidate])[0]
        previousCellFilledCandidate = currentCellCandidate
        return dynamicInterpolation(chainCellFillingText, { cell: getCellAxesValues(cell), candidate: currentCellCandidate })
    }))

    const placeholdersValues = {
        chainFirstCell: chainFirstCellAxesText,
        chainSecondCell: chainSecondCellAxesText,
        chainLastCell: chainLastCellAxesText,
        chain: joinStringsListWithArrow(getCellsAxesList(chain)),
        firstLinkCommonCandidate: getCommonNoteInCells(chain[0], chain[1], notes),
        removableNote,
        firstCellCandidateOtherThanRemovableCandidate,
        chainFillingWay: chainFillingWay.join(', '),
        removableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }

    const rawExplainationTexts = HINT_EXPLANATION_TEXTS[HINTS_IDS.XY_CHAIN]
    const explainationTextsWithPlaceholdersFilled = _map(rawExplainationTexts, (aStepRawText: string) => dynamicInterpolation(aStepRawText, placeholdersValues))

    return getHintExplanationStepsFromHintChunks(explainationTextsWithPlaceholdersFilled, false)
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

const getApplyHintData = (xyChain: XYChainRawHint) => {
    const result: NotesRemovalHintAction[] = []

    const { note, removableNotesHostCells } = xyChain
    _forEach(removableNotesHostCells, (cell: Cell) => {
        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [note] },
        })
    })
    return result
}

export const transformXYChainRawHint = ({ rawHint: xyChain, notesData, smartHintsColorSystem }: XYChainTransformerArgs): TransformedRawHint => {
    const chainLinks = getSvgData(xyChain, notesData)
    const cellsToFocusData = getUICellsToFocusData(xyChain, smartHintsColorSystem, notesData)
    addLinkCellsNotesHighlightedColor(chainLinks, notesData, cellsToFocusData)

    return ({
        type: HINTS_IDS.XY_CHAIN,
        title: HINT_ID_VS_TITLES[HINTS_IDS.XY_CHAIN],
        cellsToFocusData,
        // focusedCells: clickableCells,
        steps: getExplainationStepsText(xyChain, notesData),
        svgProps: { data: chainLinks },
        applyHint: getApplyHintData(xyChain),
        hasTryOut: false, // TODO:
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([note]) as InputPanelNumbersVisibility,
        // // tryOutAnalyserData: { xChain, tryOutInputsColors },
        // tryOutAnalyserData: { xChain },
        // clickableCells,
        // unclickableCellClickInTryOutMsg: 'you can only select Chain cells or cells which have candidates highlighted in red color',

        // tryOutInputsColors,
    })
}
