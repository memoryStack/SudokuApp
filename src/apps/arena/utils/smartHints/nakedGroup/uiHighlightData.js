import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'

import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog } from '../../../../../utils/util'

import { CELLS_IN_HOUSE, HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../../constants'

import {
    areSameCells,
    areSameRowCells,
    areSameColCells,
    areSameBlockCells,
    getCellVisibleNotesCount,
    getRowAndCol,
    getBlockAndBoxNum,
} from '../../util'

import { isHintValid } from '../validityTest'
import {
    maxHintsLimitReached,
    setCellDataInHintResult,
    getCandidatesListText,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    removeDuplicteCells,
} from '../util'

import {
    GROUPS, HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    SMART_HINTS_CELLS_BG_COLOR
} from '../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../stringLiterals'

export const getNakedTrippleHintData = ({ groupCandidates, groupCells, focusedCells, cellsToFocusData }) => {
    // TODO: explore if we can use the below array for naked double and naked tripple as well in same way
    const msgPlaceholdersValues = {
        candidatesListText: getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }

    const hintChunks = HINT_EXPLANATION_TEXTS[HINTS_IDS.NAKED_TRIPPLE].map(hintChunkTemplate => {
        return dynamicInterpolation(hintChunkTemplate, msgPlaceholdersValues)
    })

    return {
        hasTryOut: true,
        cellsToFocusData,
        focusedCells,
        type: HINTS_IDS.NAKED_TRIPPLE,
        title: HINT_ID_VS_TITLES[HINTS_IDS.NAKED_TRIPPLE],
        steps: getHintExplanationStepsFromHintChunks(hintChunks),
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells,
            groupCells,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(groupCandidates),
    }
}

export const prepareNakedDublesOrTriplesHintData = (
    noOfInstances,
    cellsHighlightable,
    groupCells,
    groupCandidates,
    notesData,
) => {
    // TODO: found an issue while testing tryOut analyser for naked tripple.
    // i wish has developed it using TDD
    const toBeHighlightedCells = removeDuplicteCells(cellsHighlightable)

    const isNakedDoubles = noOfInstances === 2
    const cellsToFocusData = {}

    const isGroupHostCell = cell => groupCells.some(groupCell => areSameCells(groupCell, cell))

    toBeHighlightedCells.forEach(({ row, col }) => {
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }

        const notesToHighlightData = {}
        let notesWillBeHighlighted = false
        groupCandidates.forEach(groupCandidate => {
            const groupCandidateNum = parseInt(groupCandidate, 10)
            if (notesData[row][col][groupCandidateNum - 1].show) {
                if (isGroupHostCell({ row, col })) {
                    notesToHighlightData[groupCandidate] = { fontColor: 'green' }
                } else {
                    notesToHighlightData[groupCandidate] = { fontColor: 'red' }
                }
                notesWillBeHighlighted = true
            }
        })

        if (notesWillBeHighlighted) cellHighlightData.notesToHighlightData = notesToHighlightData
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })

    if (!isNakedDoubles) {
        return getNakedTrippleHintData({
            groupCandidates,
            cellsToFocusData,
            focusedCells: toBeHighlightedCells,
            groupCells,
        })
    }

    const msgPlaceholdersValues = {
        candidatesListText: getCandidatesListText(groupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    }
    const hintChunks = HINT_EXPLANATION_TEXTS[HINTS_IDS.NAKED_DOUBLE].map(hintChunkTemplate => {
        return dynamicInterpolation(hintChunkTemplate, msgPlaceholdersValues)
    })

    return {
        hasTryOut: true,
        focusedCells: toBeHighlightedCells,
        cellsToFocusData,
        type: HINTS_IDS.NAKED_DOUBLE,
        title: HINT_ID_VS_TITLES[HINTS_IDS.NAKED_DOUBLE],
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells: toBeHighlightedCells,
            groupCells,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(groupCandidates),
        steps: getHintExplanationStepsFromHintChunks(hintChunks),
    }
}