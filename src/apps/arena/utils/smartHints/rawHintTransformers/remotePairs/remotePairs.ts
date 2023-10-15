import _reduce from '@lodash/reduce'
import _forEach from '@lodash/forEach'
import _map from '@lodash/map'

import { HINTS_IDS } from '../../constants'
import { HINT_ID_VS_TITLES } from '../../stringLiterals'
import { setCellDataInHintResult, setCellNotesHighlightDataInHintResult, transformCellBGColor } from '../../util'
import { BoardIterators } from '../../../classes/boardIterators'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { RemotePairsTransformerArgs } from './types'
import {
    CellsFocusData, Chain, NotesToHighlightData, SmartHintsColorSystem, TransformedRawHint,
} from '../../types'
import { RemotePairsRawHint } from '../../remotePairs/types'

const REMOTE_PAIRS_COLORS = ['green', 'rgb(217, 19, 235)']

type NotesColors = { [key: string]: string }

export const transformRemotePairsRawHint = ({ rawHint: remotePairs, smartHintsColorSystem }: RemotePairsTransformerArgs): TransformedRawHint => ({
    cellsToFocusData: getUICellsToFocusData(remotePairs, smartHintsColorSystem),
    title: HINT_ID_VS_TITLES[HINTS_IDS.REMOTE_PAIRS],
    applyHint: [], // TODO: implement this
    steps: [{ text: 'bla bla bla' }],
    svgProps: {
        data: getSvgData(remotePairs),
    },
})

export const getNotesColors = (remotePairNotes: NoteValue[]): NotesColors => _reduce(remotePairNotes, (acc: NotesColors, note: NoteValue, index: number) => ({
    ...acc,
    [note]: REMOTE_PAIRS_COLORS[index],
}), {})

// TODO: how to test schema of this function ??
// or what and how to test functions like this in general
const getUICellsToFocusData = (remotePairs: RemotePairsRawHint, smartHintsColorSystem: SmartHintsColorSystem): CellsFocusData => {
    const result = {}

    const {
        remotePairNotes,
        orderedChainCells,
        removableNotesHostCells,
    } = remotePairs

    BoardIterators.forBoardEachCell(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        setCellDataInHintResult(cell, cellHighlightData, result)
    })

    const remotePairsNotesColors = getNotesColors(remotePairNotes)
    highlightCellsAllNotes(orderedChainCells, remotePairNotes, remotePairsNotesColors, result)

    const removableNotesColors = {
        [remotePairNotes[0]]: 'red',
        [remotePairNotes[1]]: 'red',
    }
    highlightCellsAllNotes(removableNotesHostCells, remotePairNotes, removableNotesColors, result)

    return result
}

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

const getSvgData = ({ remotePairNotes, orderedChainCells }: RemotePairsRawHint): Chain => {
    let currentNote = remotePairNotes[0]

    const getAlternateNote = (note: NoteValue) => (note === remotePairNotes[0] ? remotePairNotes[1] : remotePairNotes[0])

    return _map(orderedChainCells, (cell: Cell, cellIdx: number) => {
        if (cellIdx === 0) {
            const data = {
                cell,
                out: currentNote,
            }

            return data
        }

        if (cellIdx === orderedChainCells.length - 1) {
            return {
                cell,
                in: currentNote,
            }
        }

        const data = {
            cell,
            in: currentNote,
            out: getAlternateNote(currentNote),
        }
        currentNote = getAlternateNote(currentNote)
        return data
    })
}

// const chainTrack = [
//     {
//         cell: { row: 0, col: 0 },
//         out: 5,
//     },
//     {
//         cell: { row: 2, col: 2 },
//         in: 3,
//         out: 9,
//     },
//     {
//         cell: { row: 5, col: 2 },
//         in: 1,
//         out: 7,
//     },
//     {
//         cell: { row: 3, col: 4 },
//         in: 1,
//         out: 7,
//     },
//     {
//         cell: { row: 3, col: 6 },
//         in: 7,
//         out: 3,
//     },
//     {
//         cell: { row: 4, col: 6 },
//         in: 7,
//         out: 3,
//     },
//     {
//         cell: { row: 4, col: 7 },
//         in: 1,
//         out: 3,
//     },
// ]
