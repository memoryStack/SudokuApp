import _forEach from '@lodash/forEach'
import _map from '@lodash/map'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _keys from '@lodash/keys'
import _intersection from '@lodash/intersection'
import _at from '@lodash/at'
import _head from '@lodash/head'
import _last from '@lodash/last'
import _isNil from '@lodash/isNil'

import { BOARD_MOVES_TYPES } from '../../../../constants'
import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    setCellDataInHintResult,
    setCellNotesHighlightDataInHintResult,
    transformCellBGColor,
} from '../../util'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { RemotePairsTransformerArgs } from './types'
import {
    CellsFocusData,
    Chain,
    InputPanelNumbersVisibility,
    NotesRemovalHintAction,
    NotesToHighlightData,
    SmartHintsColorSystem,
    TransformedRawHint,
    TryOutInputsColors,
} from '../../types'
import { RemotePairsRawHint } from '../../chains/remotePairs/types'
import { areCommonHouseCells, getCellAxesValues } from '../../../util'
import { getCellsAxesValuesListText, joinStringsListWithArrow } from '../helpers'
import { convertBoardCellToNum } from '@domain/board/utils/cellsTransformers'
import { LINK_TYPES } from '../../chains/xChain/xChain.constants'

const REMOTE_PAIRS_COLORS_TEXT = ['green', 'blue']

const REMOTE_PAIRS_COLORS = ['green', '#4B61D1']

type NotesColors = { [key: string]: string }

const highlightCellsAllNotes = (cells: Cell[], notes: NoteValue[], notesColors: NotesColors, cellsToFocusData: CellsFocusData) => {
    _forEach(cells, (cell: Cell) => {
        const notesHighlightData: NotesToHighlightData = {}
        _forEach(notes, (note: NoteValue) => {
            notesHighlightData[note] = {
                fontColor: notesColors[note], // TODO: this fontColor key is necessary here, same with background color for cell
            }
        })
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, cellsToFocusData)
    })
}

const highlightChainCellsNotes = (remotePairs: RemotePairsRawHint, cellsToFocusData: CellsFocusData) => {
    const {
        orderedChainCells,
        remotePairNotes,
    } = remotePairs

    _forEach(orderedChainCells, (cell: Cell, cellIndx: number) => {
        const notesHighlightData: NotesToHighlightData = {}
        _forEach(remotePairNotes, (note: NoteValue, noteIndx: number) => {
            notesHighlightData[note] = {
                fontColor: cellIndx % 2 === 0 ? REMOTE_PAIRS_COLORS[noteIndx] : REMOTE_PAIRS_COLORS[1 - noteIndx],
            }
        })
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, cellsToFocusData)
    })
}

// TODO: how to test schema of this function ??
// or what and how to test functions like this in general
const getUICellsToFocusData = (remotePairs: RemotePairsRawHint, smartHintsColorSystem: SmartHintsColorSystem): CellsFocusData => {
    const result = {}

    BoardIterators.forBoardEachCell(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        setCellDataInHintResult(cell, cellHighlightData, result)
    })

    highlightChainCellsNotes(remotePairs, result)

    const { remotePairNotes, removableNotesHostCells } = remotePairs
    const removableNotesColors = {
        [remotePairNotes[0]]: 'red',
        [remotePairNotes[1]]: 'red',
    }
    highlightCellsAllNotes(removableNotesHostCells, remotePairNotes, removableNotesColors, result)

    return result
}

const getSvgData = ({ remotePairNotes, orderedChainCells }: RemotePairsRawHint): Chain => {
    const getAlternateNote = (note: NoteValue) => (note === remotePairNotes[0] ? remotePairNotes[1] : remotePairNotes[0])

    const result: Chain = []
    let sourceNote = remotePairNotes[0]
    let sinkNote = remotePairNotes[1]
    for (let i = 1; i < orderedChainCells.length; i++) {
        result.push({
            start: {
                cell: orderedChainCells[i - 1],
                note: sourceNote,
            },
            end: {
                cell: orderedChainCells[i],
                note: sinkNote,
            },
            type: LINK_TYPES.WEAK,
        })
        sourceNote = getAlternateNote(sourceNote)
        sinkNote = getAlternateNote(sinkNote)
    }
    return result
}

const getChainCellsWhichRemoveNotesInCell = (cell: Cell, chainCells: RemotePairsRawHint['orderedChainCells']) => {
    let result: Cell[] = []
    for (let i = 0; i < chainCells.length - 3; i++) {
        const [firstChainCell, secondChainCell] = _at(chainCells, [i, i + 3])
        if (areCommonHouseCells(cell, firstChainCell) && areCommonHouseCells(cell, secondChainCell)) {
            result = [firstChainCell, secondChainCell]
            break
        }
    }

    return result
}

const getExplainationStepsText = (remotePairs: RemotePairsRawHint, notes: Notes) => {
    const { remotePairNotes, orderedChainCells, removableNotesHostCells } = remotePairs
    const rawExplainationTexts = HINT_EXPLANATION_TEXTS[HINTS_IDS.REMOTE_PAIRS]
    const chainText = joinStringsListWithArrow(_map(orderedChainCells, (chainCell: Cell) => getCellAxesValues(chainCell)))
    const exampleRemovableNotesHostCell = _head(removableNotesHostCells)
    const exampleRemovableNotesInCell = _intersection(NotesRecord.getCellVisibleNotesList(notes, exampleRemovableNotesHostCell), remotePairNotes)
    const exampleChainCells = getChainCellsWhichRemoveNotesInCell(exampleRemovableNotesHostCell, orderedChainCells)

    const placeholdersValues = {
        chain: chainText,
        remotePairNotes: getCandidatesListText(remotePairNotes, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        chainFirstCell: getCellAxesValues(_head(orderedChainCells)),
        chainLastCell: getCellAxesValues(_last(orderedChainCells)),
        colorA: REMOTE_PAIRS_COLORS_TEXT[0],
        colorB: REMOTE_PAIRS_COLORS_TEXT[1],
        exampleRemovableNotesHostCell: getCellAxesValues(exampleRemovableNotesHostCell),
        exampleRemovableNotesInCell: getCandidatesListText(exampleRemovableNotesInCell, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        exampleChainCells: getCellsAxesValuesListText(exampleChainCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }

    const explainationTextsWithPlaceholdersFilled = _map(rawExplainationTexts, (aStepRawText: string) => dynamicInterpolation(aStepRawText, placeholdersValues))
    return getHintExplanationStepsFromHintChunks(explainationTextsWithPlaceholdersFilled)
}

const getApplyHintData = (remotePairs: RemotePairsRawHint, notes: Notes) => {
    const result: NotesRemovalHintAction[] = []
    const { removableNotesHostCells, remotePairNotes } = remotePairs
    _forEach(removableNotesHostCells, (cell: Cell) => {
        const removableNotesInCell = _intersection(NotesRecord.getCellVisibleNotesList(notes, cell), remotePairNotes)
        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: removableNotesInCell },
        })
    })
    return result
}

const getTryOutInputsColors = (
    chainCells: Cell[],
    cellsToFocusData: CellsFocusData,
) => {
    const result: TryOutInputsColors = {}

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

export const transformRemotePairsRawHint = ({ rawHint: remotePairs, notesData, smartHintsColorSystem }: RemotePairsTransformerArgs): TransformedRawHint => {
    const { orderedChainCells, removableNotesHostCells } = remotePairs
    const clickableCells = [...orderedChainCells, ...removableNotesHostCells]
    const cellsToFocusData = getUICellsToFocusData(remotePairs, smartHintsColorSystem)

    const tryOutInputsColors = getTryOutInputsColors(clickableCells, cellsToFocusData)

    return ({
        type: HINTS_IDS.REMOTE_PAIRS,
        title: HINT_ID_VS_TITLES[HINTS_IDS.REMOTE_PAIRS],
        cellsToFocusData,
        focusedCells: clickableCells, // TODO: this "focusedCells" field is just simple two faced
        steps: getExplainationStepsText(remotePairs, notesData),
        svgProps: { data: getSvgData(remotePairs) },
        hasTryOut: true,
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(remotePairs.remotePairNotes) as InputPanelNumbersVisibility,
        tryOutAnalyserData: { remotePairs, tryOutInputsColors },
        clickableCells,
        unclickableCellClickInTryOutMsg: 'you can only select Chain cells or cells which have candidates highlighted in red color',
        applyHint: getApplyHintData(remotePairs, notesData),
        tryOutInputsColors,
    })
}
