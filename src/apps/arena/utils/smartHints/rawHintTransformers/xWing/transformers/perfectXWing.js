import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'

import { getHouseCells } from '../../../../houseCells'
import { getCellAxesValues, isCellExists } from '../../../../util'

import { HOUSE_TYPE, SMART_HINTS_CELLS_BG_COLOR, HINTS_IDS } from '../../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../../stringLiterals'
import {
    setCellDataInHintResult,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    getCellsFromCellsToFocusedData,
} from '../../../util'
import { getCrossHouseType, getXWingCandidate, getXWingCells } from '../../../xWing/utils'

import {
    getXWingCrossHouseFullNamePlural,
    getXWingHousesTexts,
    getCrossHouseAxesText,
    getDiagonalsCornersAxesTexts,
    getXWingHouseFullNamePlural,
    getXWingCornerCells,
    getApplyHintData,
} from './helpers'

// TODO: come up with a better color scheme
const DIAGONAL_CELLS_COLORS = {
    TOP_LEFT_BOTTOM_RIGHT: 'orange',
    BOTTOM_LEFT_TOP_RIGHT: 'pink',
}

const highlightXWingCells = (cells, candidate, cellsToFocusData) => {
    cells.forEach(({ row, col }, index) => {
        const isTopLeftCell = index === 0
        const isBottomRightCell = index === 3

        const cellHighlightData = {
            bgColor: {
                backgroundColor:
                    isTopLeftCell || isBottomRightCell
                        ? DIAGONAL_CELLS_COLORS.TOP_LEFT_BOTTOM_RIGHT
                        : DIAGONAL_CELLS_COLORS.BOTTOM_LEFT_TOP_RIGHT,
            },
            notesToHighlightData: {
                [candidate]: { fontColor: 'green' },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

// TODO: synchronize the structre in which cells is passed around for all xWings
const highlightHouseCells = ({ houseType, cells }, cellsToFocusData) => {
    // TODO: this logic is repeated
    const firstHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = houseType === HOUSE_TYPE.ROW ? cells[1][0].row : cells[1][0].col

    const xWingCells = [...cells[0], ...cells[1]]

    // TODO: weird bug. we have to declare this array first. else it doesn't work
    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells({ type: houseType, num: houseNum })
            .filter(cell => !isCellExists(cell, xWingCells))
            .forEach(cell => setCellDataInHintResult(
                cell,
                { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT },
                cellsToFocusData,
            ))
    })
}

const highlightCrossHouseCells = ({ houseType, cells, candidate }, notesData, cellsToFocusData) => {
    const xWingCells = [...cells[0], ...cells[1]]
    const firstCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][1].col : cells[0][1].row
    const crossHousesNum = [firstCrossHouseNum, secondCrossHouseNum]
    crossHousesNum.forEach(houseNum => {
        const crossHouseType = getCrossHouseType(houseType)
        getHouseCells({ type: crossHouseType, num: houseNum })
            .filter(cell => !isCellExists(cell, xWingCells))
            .forEach(cell => {
                const cellHighlightData = {
                    bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
                }

                if (NotesRecord.isNotePresentInCell(notesData, candidate, cell)) {
                    cellHighlightData.notesToHighlightData = {
                        [candidate]: { fontColor: 'red' },
                    }
                }

                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            })
    })
}

const getXWingCornersText = xWing => {
    const {
        topLeft, topRight, bottomLeft, bottomRight,
    } = getXWingCornerCells(xWing)
    return [topLeft, topRight, bottomRight, bottomLeft, topLeft]
        .map(cell => getCellAxesValues(cell))
        .join(` ${String.fromCodePoint(0x279d)} `)
}

const getHintChunks = xWing => {
    const { topDown: topDownDiagonalText, bottomUp: bottomUpDiagonalText } = getDiagonalsCornersAxesTexts(xWing)
    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        ...getXWingHousesTexts(xWing.houseType, xWing.legs),
        houseFullNamePlural: getXWingHouseFullNamePlural(xWing),
        rectangleCornersText: getXWingCornersText(xWing),
        topDownDiagonalText,
        bottomUpDiagonalText,
        ...getCrossHouseAxesText(xWing),
        crossHouseFullNamePlural: getXWingCrossHouseFullNamePlural(xWing),
    }

    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.PERFECT_X_WING]
    return msgTemplates.map(template => dynamicInterpolation(template, msgPlaceholdersValues))
}

const getRemovableNotesHostCells = (xWingCells, candidate, focusedCells, notes) => focusedCells.filter(cell => !isCellExists(cell, xWingCells)
    && NotesRecord.isNotePresentInCell(notes, candidate, cell))

export const getPerfectXWingUIData = (xWing, notesData) => {
    const { legs, houseType } = xWing
    const { candidate } = legs[0]
    const cells = legs.map(leg => leg.cells)
    const xWingCells = getXWingCells(xWing.legs)

    const cellsToFocusData = {}
    highlightXWingCells(xWingCells, candidate, cellsToFocusData)
    highlightHouseCells({ houseType, cells }, cellsToFocusData)
    highlightCrossHouseCells({ houseType, cells, candidate }, notesData, cellsToFocusData)

    const tryOutInputPanelAllowedCandidates = [candidate]

    const focusedCells = getCellsFromCellsToFocusedData(cellsToFocusData)
    const removableNotesHostCells = getRemovableNotesHostCells(xWingCells, candidate, focusedCells, notesData)

    return {
        hasTryOut: true,
        type: HINTS_IDS.PERFECT_X_WING,
        title: HINT_ID_VS_TITLES[HINTS_IDS.PERFECT_X_WING],
        cellsToFocusData,
        focusedCells,
        steps: getHintExplanationStepsFromHintChunks(getHintChunks(xWing)),
        applyHint: getApplyHintData(candidate, removableNotesHostCells),
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(tryOutInputPanelAllowedCandidates),
        tryOutAnalyserData: {
            xWingCells,
            removableNotesHostCells,
            xWing,
        },
    }
}
