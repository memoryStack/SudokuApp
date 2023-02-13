import _reduce from 'lodash/src/utils/reduce'
import _forEach from 'lodash/src/utils/forEach'

import { forBoardEachCell } from '../../../util'
import { HINTS_IDS, SMART_HINTS_CELLS_BG_COLOR } from '../../constants'
import { HINT_ID_VS_TITLES } from '../../stringLiterals'
import { setCellDataInHintResult, setCellNotesHighlightDataInHintResult } from '../../util'

const REMOTE_PAIRS_COLORS = ['green', 'rgb(217, 19, 235)']

export const transformRemotePairsRawHint = ({ rawHint: remotePairs, notesData }) => {
    const a = '10'
    return {
        cellsToFocusData: getUICellsToFocusData(remotePairs, notesData),
        title: HINT_ID_VS_TITLES[HINTS_IDS.REMOTE_PAIRS],
        // steps: [{ text: getHintExplaination(remotePairs, notesData) }],
        // applyHint: getApplyHintData(remotePairs, notesData),
    }
}

export const getNotesColors = remotePairNotes => _reduce(remotePairNotes, (acc, note, index) => ({
    ...acc,
    [note]: REMOTE_PAIRS_COLORS[index],
}), {})

// TODO: how to test schema of this function ??
// or what and how to test functions like this.
const getUICellsToFocusData = remotePairs => {
    const result = {}

    const {
        remotePairNotes,
        orderedChainCells,
        removableNotesHostCells,
    } = remotePairs

    forBoardEachCell(cell => {
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        setCellDataInHintResult(cell, cellHighlightData, result)
    })

    const remotePairsNotesColors = getNotesColors(remotePairNotes)
    _forEach(orderedChainCells, cell => {
        const notesHighlightData = {}
        _forEach(remotePairNotes, note => {
            notesHighlightData[note] = remotePairsNotesColors[note]
        })
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, result)
    })

    const removableNotesColors = {
        [remotePairNotes[0]]: 'red',
        [remotePairNotes[1]]: 'red',
    }
    _forEach(removableNotesHostCells, cell => {
        const notesHighlightData = {}
        _forEach(remotePairNotes, note => {
            notesHighlightData[note] = removableNotesColors[note]
        })
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, result)
    })

    return result
}
