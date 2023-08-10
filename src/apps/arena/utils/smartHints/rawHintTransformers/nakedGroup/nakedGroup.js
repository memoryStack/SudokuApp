import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _filter from '@lodash/filter'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'
import {
    getHousesCellsSharedByCells, getUniqueNotesFromCells, isCellExists,
} from '../../../util'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    setCellDataInHintResult,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    transformCellBGColor,
} from '../../util'
import { NAKED_DOUBLE_CANDIDATES_COUNT } from '../../nakedGroup/nakedGroup.constants'

import { getCellsAxesValuesListText } from '../helpers'
import { BOARD_MOVES_TYPES } from '../../../../constants'
import smartHintColorSystemReader from '../../colorSystemReader'

export const transformNakedGroupRawHint = ({ rawHint, notesData, smartHintsColorSystem }) => {
    const { groupCells } = rawHint
    const focusedCells = getHousesCellsSharedByCells(groupCells)
    const groupCandidates = getUniqueNotesFromCells(groupCells, notesData)

    return {
        hasTryOut: true,
        cellsToFocusData: getCellsHighlightData(focusedCells, groupCells, groupCandidates, notesData, smartHintsColorSystem),
        focusedCells,
        type: getHintId(groupCandidates),
        title: HINT_ID_VS_TITLES[getHintId(groupCandidates)],
        steps: getHintExplanationStepsFromHintChunks(getHintChunks(groupCandidates, groupCells)),
        applyHint: getApplyHintData(focusedCells, groupCells, groupCandidates, notesData),
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells,
            groupCells,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(groupCandidates),
    }
}

const getCellsHighlightData = (cells, groupCells, groupCandidates, notesData, smartHintsColorSystem) => {
    const result = {}

    cells.forEach(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }

        const notesToHighlightData = {}
        let notesWillBeHighlighted = false
        groupCandidates.forEach(groupCandidate => {
            if (NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell)) {
                if (isCellExists(cell, groupCells)) {
                    notesToHighlightData[groupCandidate] = { fontColor: 'green' }
                } else {
                    notesToHighlightData[groupCandidate] = { fontColor: 'red' }
                }
                notesWillBeHighlighted = true
            }
        })

        if (notesWillBeHighlighted) cellHighlightData.notesToHighlightData = notesToHighlightData
        setCellDataInHintResult(cell, cellHighlightData, result)
    })

    return result
}

const getHintChunks = (groupCandidates, groupCells) => {
    const msgPlaceholdersValues = {
        candidatesListTextAndConcatenated: getCandidatesListText(
            groupCandidates,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
        ),
        candidatesListTextOrConcatenated: getCandidatesListText(
            groupCandidates,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.OR,
        ),
        groupCellsText: getCellsAxesValuesListText(groupCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }
    return HINT_EXPLANATION_TEXTS[getHintId(groupCandidates)].map(hintChunkTemplate => dynamicInterpolation(hintChunkTemplate, msgPlaceholdersValues))
}

const getHintId = groupCandidates => (groupCandidates.length === NAKED_DOUBLE_CANDIDATES_COUNT ? HINTS_IDS.NAKED_DOUBLE : HINTS_IDS.NAKED_TRIPPLE)

const getApplyHintData = (focusedCells, groupCells, groupCandidates, notesData) => {
    const result = []

    const cellsWithoutGroupCells = _filter(focusedCells, cell => !isCellExists(cell, groupCells))

    _forEach(cellsWithoutGroupCells, cell => {
        const groupCandidatesVisible = _filter(groupCandidates, groupCandidate => NotesRecord.isNotePresentInCell(notesData, groupCandidate, cell))
        if (!_isEmpty(groupCandidatesVisible)) {
            result.push({
                cell,
                action: { type: BOARD_MOVES_TYPES.REMOVE, notes: groupCandidatesVisible },
            })
        }
    })

    return result
}
