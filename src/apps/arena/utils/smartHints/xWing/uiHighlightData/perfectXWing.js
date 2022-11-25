import { dynamicInterpolation } from 'lodash/src/utils/dynamicInterpolation'

import { getHouseCells } from '../../../houseCells'
import { isCellExists, isCellNoteVisible } from '../../../util'

import { HOUSE_TYPE, SMART_HINTS_CELLS_BG_COLOR, HINTS_IDS } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import {
    setCellDataInHintResult,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    getCellsFromCellsToFocusedData,
} from '../../util'
import { getCellsAxesValuesListText } from '../../tryOutInputAnalyser/helpers'

import {
    getCrossHouseType,
    getXWingCandidate,
    getXWingHousesTexts,
    getXWingRectangleCornersAxesText,
    getDiagonalsCornersAxesTexts,
    getCrossHouseAxesText,
    getXWingCells,
} from '../utils'

import { getXWingHouseFullName, getXWingCrossHouseFullNamePlural } from './helpers'

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
            .forEach(cell =>
                setCellDataInHintResult(
                    cell,
                    { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT },
                    cellsToFocusData,
                ),
            )
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

                const cellNotes = notesData[cell.row][cell.col]
                if (cellNotes[candidate - 1].show) {
                    cellHighlightData.notesToHighlightData = {
                        [candidate]: { fontColor: 'red' },
                    }
                }

                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            })
    })
}

const getHintChunks = (xWing, removableNotesHostCells) => {
    const { topDown: topDownDiagonalText, bottomUp: bottomUpDiagonalText } = getDiagonalsCornersAxesTexts(xWing)
    const msgPlaceholdersValues = {
        candidate: getXWingCandidate(xWing),
        ...getXWingHousesTexts(xWing.houseType, xWing.legs),
        houseFullName: getXWingHouseFullName(xWing),
        rectangleCornersText: getXWingRectangleCornersAxesText(xWing.legs),
        topDownDiagonalText,
        bottomUpDiagonalText,
        ...getCrossHouseAxesText(xWing),
        crossHouseFullName: getXWingCrossHouseFullNamePlural(xWing),
        cellsAxesListText: getCellsAxesValuesListText(removableNotesHostCells),
    }

    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.PERFECT_X_WING]
    return msgTemplates.map(template => {
        return dynamicInterpolation(template, msgPlaceholdersValues)
    })
}

const getRemovableNotesHostCells = (xWingCells, candidate, focusedCells, notes) => {
    return focusedCells.filter(cell => {
        return !isCellExists(cell, xWingCells) && isCellNoteVisible(candidate, notes[cell.row][cell.col])
    })
}

export const getPerfectXWingUIData = (xWing, notesData) => {
    const { legs, houseType } = xWing
    const candidate = legs[0].candidate
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
        steps: getHintExplanationStepsFromHintChunks(getHintChunks(xWing, removableNotesHostCells)),
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(tryOutInputPanelAllowedCandidates),
        tryOutAnalyserData: {
            xWingCells,
            removableNotesHostCells,
            xWing,
        },
    }
}
