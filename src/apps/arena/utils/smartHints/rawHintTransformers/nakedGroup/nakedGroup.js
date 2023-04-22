import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _filter from '@lodash/filter'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'

import {
    getHousesCellsSharedByCells, getUniqueNotesFromCells, isCellExists, isCellNoteVisible,
} from '../../../util'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, SMART_HINTS_CELLS_BG_COLOR } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    setCellDataInHintResult,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
} from '../../util'
import { NAKED_DOUBLE_CANDIDATES_COUNT } from '../../nakedGroup/nakedGroup.constants'

import { getCellsAxesValuesListText } from '../helpers'
import { BOARD_MOVES_TYPES } from '../../../../constants'

export const transformNakedGroupRawHint = ({ rawHint, notesData }) => {
    const { groupCells } = rawHint
    const focusedCells = getHousesCellsSharedByCells(groupCells)
    const groupCandidates = getUniqueNotesFromCells(groupCells, notesData)

    return {
        hasTryOut: true,
        cellsToFocusData: getCellsHighlightData(focusedCells, groupCells, groupCandidates, notesData),
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

const getCellsHighlightData = (cells, groupCells, groupCandidates, notesData) => {
    const result = {}

    cells.forEach(({ row, col }) => {
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }

        const notesToHighlightData = {}
        let notesWillBeHighlighted = false
        groupCandidates.forEach(groupCandidate => {
            if (notesData[row][col][groupCandidate - 1].show) {
                if (isCellExists({ row, col }, groupCells)) { notesToHighlightData[groupCandidate] = { fontColor: 'green' } } else notesToHighlightData[groupCandidate] = { fontColor: 'red' }
                notesWillBeHighlighted = true
            }
        })

        if (notesWillBeHighlighted) cellHighlightData.notesToHighlightData = notesToHighlightData
        setCellDataInHintResult({ row, col }, cellHighlightData, result)
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
        const groupCandidatesVisible = _filter(groupCandidates, groupCandidate => isCellNoteVisible(groupCandidate, notesData[cell.row][cell.col]))
        if (!_isEmpty(groupCandidatesVisible)) {
            result.push({
                cell,
                action: { type: BOARD_MOVES_TYPES.REMOVE, notes: groupCandidatesVisible },
            })
        }
    })

    return result
}
