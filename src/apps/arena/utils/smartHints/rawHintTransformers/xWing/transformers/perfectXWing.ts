import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { Houses } from '../../../../classes/houses'
import { NotesRecord } from '../../../../../RecordUtilities/boardNotes'

import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { getCellAxesValues, isCellExists } from '../../../../util'

import { HINTS_IDS } from '../../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../../stringLiterals'
import {
    setCellDataInHintResult,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    getCellsFromCellsToFocusedData,
    transformCellBGColor,
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
import smartHintColorSystemReader from '../../../colorSystem.reader'
import { XWingRawHint } from '../../../xWing/types'
import {
    CellsFocusData, SmartHintsColorSystem, CellHighlightData, TransformedRawHint,
} from '../../../types'
import { joinStringsListWithArrow } from '../../helpers'

const highlightXWingCells = (
    cells: Cell[],
    candidate: NoteValue,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    cells.forEach(({ row, col }, index) => {
        const isTopLeftCell = index === 0
        const isBottomRightCell = index === 3

        const cellHighlightData = {
            bgColor: transformCellBGColor(
                isTopLeftCell || isBottomRightCell ? smartHintColorSystemReader.xWingTopLeftBottomRightCellBGColor(smartHintsColorSystem)
                    : smartHintColorSystemReader.xWingTopRightBottomLeftCellBGColor(smartHintsColorSystem),
            ),
            notesToHighlightData: {
                [candidate]: { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

// TODO: synchronize the structre in which cells is passed around for all xWings
const highlightHouseCells = (
    { houseType, cells }: { houseType: HouseType, cells: Cell[][] },
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    // TODO: this logic is repeated
    const firstHouseNum = Houses.isRowHouse(houseType) ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = Houses.isRowHouse(houseType) ? cells[1][0].row : cells[1][0].col

    const xWingCells = [...cells[0], ...cells[1]]

    // TODO: weird bug. we have to declare this array first. else it doesn't work
    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells({ type: houseType, num: houseNum })
            .filter(cell => !isCellExists(cell, xWingCells))
            .forEach(cell => setCellDataInHintResult(
                cell,
                { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) },
                cellsToFocusData,
            ))
    })
}

const highlightCrossHouseCells = (
    { houseType, cells, candidate }: { houseType: HouseType, cells: Cell[][], candidate: NoteValue },
    notesData: Notes,
    cellsToFocusData: CellsFocusData,
    smartHintsColorSystem: SmartHintsColorSystem,
) => {
    const xWingCells = [...cells[0], ...cells[1]]
    const firstCrossHouseNum = Houses.isRowHouse(houseType) ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = Houses.isRowHouse(houseType) ? cells[0][1].col : cells[0][1].row
    const crossHousesNum = [firstCrossHouseNum, secondCrossHouseNum]
    crossHousesNum.forEach(houseNum => {
        const crossHouseType = getCrossHouseType(houseType)
        getHouseCells({ type: crossHouseType, num: houseNum })
            .filter(cell => !isCellExists(cell, xWingCells))
            .forEach(cell => {
                const cellHighlightData: CellHighlightData = {
                    bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
                }

                if (NotesRecord.isNotePresentInCell(notesData, candidate, cell)) {
                    cellHighlightData.notesToHighlightData = {
                        [candidate]: { fontColor: smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem) },
                    }
                }

                setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
            })
    })
}

const getXWingCornersText = (xWing: XWingRawHint) => {
    const {
        topLeft, topRight, bottomLeft, bottomRight,
    } = getXWingCornerCells(xWing)

    const cornersAxesList = [topLeft, topRight, bottomRight, bottomLeft, topLeft]
        .map(cell => getCellAxesValues(cell))
    return joinStringsListWithArrow(cornersAxesList)
}

const getHintChunks = (xWing: XWingRawHint) => {
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

    const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.PERFECT_X_WING] as string[]
    return msgTemplates.map(template => dynamicInterpolation(template, msgPlaceholdersValues))
}

const getRemovableNotesHostCells = (
    xWingCells: Cell[],
    candidate: NoteValue,
    focusedCells: Cell[],
    notes: Notes,
) => focusedCells.filter(cell => !isCellExists(cell, xWingCells)
    && NotesRecord.isNotePresentInCell(notes, candidate, cell))

export const getPerfectXWingUIData = (
    xWing: XWingRawHint,
    notesData: Notes,
    smartHintsColorSystem: SmartHintsColorSystem,
): TransformedRawHint => {
    const { legs, houseType } = xWing
    const { candidate } = legs[0]
    const cells = legs.map(leg => leg.cells)
    const xWingCells = getXWingCells(xWing.legs)

    const cellsToFocusData: CellsFocusData = {}
    highlightXWingCells(xWingCells, candidate, cellsToFocusData, smartHintsColorSystem)
    highlightHouseCells({ houseType, cells }, cellsToFocusData, smartHintsColorSystem)
    highlightCrossHouseCells({ houseType, cells, candidate }, notesData, cellsToFocusData, smartHintsColorSystem)

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
        clickableCells: [...xWingCells, ...removableNotesHostCells],
        unclickableCellClickInTryOutMsg: 'you can select cells which have candidates highlighted in green or red color. because we are not commenting about other cells.',
        applyHint: getApplyHintData(candidate, removableNotesHostCells),
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(tryOutInputPanelAllowedCandidates) as InputPanelVisibleNumbers,
        tryOutAnalyserData: {
            xWingCells,
            removableNotesHostCells,
            xWing,
        },
    }
}
