import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'

import { getHousesCellsSharedByCells, getUniqueNotesFromCells, isCellExists } from '../../util'

import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, SMART_HINTS_CELLS_BG_COLOR } from '../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../stringLiterals'
import {
    setCellDataInHintResult,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
} from '../util'
import { NAKED_DOUBLE_CANDIDATES_COUNT } from './nakedGroup.constants'

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
        steps: getHintExplanationStepsFromHintChunks(getHintChunks(groupCandidates)),
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
                if (isCellExists({ row, col }, groupCells))
                    notesToHighlightData[groupCandidate] = { fontColor: 'green' }
                else notesToHighlightData[groupCandidate] = { fontColor: 'red' }
                notesWillBeHighlighted = true
            }
        })

        if (notesWillBeHighlighted) cellHighlightData.notesToHighlightData = notesToHighlightData
        setCellDataInHintResult({ row, col }, cellHighlightData, result)
    })

    return result
}

const getHintChunks = groupCandidates => {
    const msgPlaceholdersValues = {
        candidatesListText: getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }
    return HINT_EXPLANATION_TEXTS[getHintId(groupCandidates)].map(hintChunkTemplate => {
        return dynamicInterpolation(hintChunkTemplate, msgPlaceholdersValues)
    })
}

const getHintId = groupCandidates =>
    groupCandidates.length === NAKED_DOUBLE_CANDIDATES_COUNT ? HINTS_IDS.NAKED_DOUBLE : HINTS_IDS.NAKED_TRIPPLE
