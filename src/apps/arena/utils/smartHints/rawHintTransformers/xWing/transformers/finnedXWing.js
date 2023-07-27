import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import { getHouseCells } from '../../../../houseCells'

import {
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE,
    HOUSE_TYPE_VS_FULL_NAMES,
    SMART_HINTS_CELLS_BG_COLOR,
} from '../../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../../stringLiterals'
import { getCellAxesValues, getCellHouseForHouseType, isCellNoteVisible } from '../../../../util'

import {
    getCellsFromCellsToFocusedData,
    setCellDataInHintResult,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
} from '../../../util'
import { getCellsAxesValuesListText } from '../../helpers'

import {
    categorizeLegs,
    categorizeFinnedLegCells,
    getFinnedXWingRemovableNotesHostCells,
    getPerfectCellsInFinnedBlock,
    getXWingCandidate,
    getXWingHosuesInOrder,
    getXWingCells,
} from '../../../xWing/utils'
import { XWING_TYPES } from '../../../xWing/constants'

import { getApplyHintData, getHouseAxesText, getXWingCrossHouseFullNamePlural } from './helpers'

// TODO: come up with a better color scheme
// TODO: RENAME IT
const DIAGONAL_CELLS_COLORS = {
    TOP_LEFT_BOTTOM_RIGHT: 'orange',
    BOTTOM_LEFT_TOP_RIGHT: 'pink',
    FINN: 'rgb(255, 245, 187)',
}

const getCrossHouseType = houseType => (houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

const getPlaceholdersValues = (xWing, removableNotesHostCells) => {
    const { houseType, legs } = xWing
    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)
    const { finns: finnCells } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)
    const finnedBlockPerfectCells = getPerfectCellsInFinnedBlock(legs)
    const xWingHouses = getXWingHosuesInOrder(xWing)

    return {
        candidate: getXWingCandidate(xWing),
        finnedLegAxesText: getHouseAxesText(getCellHouseForHouseType(houseType, finnedLeg.cells[0])),
        finnedLegHouseText: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        finnCellsAxesListText: getCellsAxesValuesListText(finnCells),
        finnCellEnglishText: finnCells.length === 1 ? 'cell' : 'cells',
        shareVerbGrammaticalText: finnCells.length === 1 ? 'shares' : 'share',
        finnedBlockPerfectCellsAxesText: getCellsAxesValuesListText(
            finnedBlockPerfectCells,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
        ),
        cornersText: finnedBlockPerfectCells.length === 1 ? 'corner' : 'corners',
        crossHouseFullNamePlural: getXWingCrossHouseFullNamePlural(xWing),
        hostHousesAxesListText: `${getHouseAxesText(xWingHouses[0])}, ${getHouseAxesText(xWingHouses[1])}`,
        hostHousePluralName: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME_PLURAL,
        removableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCells),
        removableNotesHostCellsText: removableNotesHostCells.length === 1 ? 'cell' : 'cells',
    }
}

const getFinnedXWingHintChunks = (xWing, removableNotesHostCells) => {
    const msgPlaceholdersValues = getPlaceholdersValues(xWing, removableNotesHostCells)

    return HINT_EXPLANATION_TEXTS[HINTS_IDS.FINNED_X_WING].map(template => dynamicInterpolation(template, msgPlaceholdersValues))
}

// this implementation is different from utils implementation
const getSashimiCell = (xWing, notes) => {
    const { legs } = xWing
    const { otherLeg: finnedLeg } = categorizeLegs(...legs)

    const candidate = getXWingCandidate(xWing)
    return finnedLeg.cells.find(cell => !NotesRecord.isNotePresentInCell(notes, candidate, cell))
}

const getSashimiFinnedHintChunks = (xWing, removableNotesHostCells, notes) => {
    const placeholdersValues = {
        ...getPlaceholdersValues(xWing, removableNotesHostCells),
        sashimiCellAxesText: getCellAxesValues(getSashimiCell(xWing, notes)),
    }

    return HINT_EXPLANATION_TEXTS[HINTS_IDS.SASHIMI_FINNED_X_WING].map(template => dynamicInterpolation(template, placeholdersValues))
}

// doing 2 things
const defaultHighlightHouseCells = ({ houseType, cells }, cellsToFocusData) => {
    const firstHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = houseType === HOUSE_TYPE.ROW ? cells[1][0].row : cells[1][0].col

    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells({ type: houseType, num: houseNum }).forEach(cell => setCellDataInHintResult(cell, { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }, cellsToFocusData))
    })
}

const defaultHighlightCrossHouseCells = ({ houseType, cells }, cellsToFocusData) => {
    const firstCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][1].col : cells[0][1].row
    const crossHousesNum = [firstCrossHouseNum, secondCrossHouseNum]
    crossHousesNum.forEach(houseNum => {
        const crossHouseType = getCrossHouseType(houseType)
        getHouseCells({ type: crossHouseType, num: houseNum }).forEach(cell => {
            const cellHighlightData = {
                bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
            }

            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
    })
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

const highlightFinnCells = (finnCells, candidate, cellsToFocusData) => {
    finnCells.forEach(({ row, col }) => {
        const cellHighlightData = {
            bgColor: {
                backgroundColor: DIAGONAL_CELLS_COLORS.FINN,
            },
            notesToHighlightData: {
                [candidate]: { fontColor: 'green' },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

const highlightRemovableNotesHostCells = (hostCells, candidate, notesData, cellsToFocusData) => {
    hostCells
        .filter(cell => {
            const cellNotes = notesData[cell.row][cell.col]
            return isCellNoteVisible(candidate, cellNotes)
        })
        .forEach(cell => {
            const cellHighlightData = {
                bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
                notesToHighlightData: {
                    [candidate]: { fontColor: 'red' },
                },
            }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
}

export const getFinnedXWingUIData = (xWing, notesData) => {
    const { type: finnedXWingType, legs, houseType } = xWing
    const { candidate } = legs[0]

    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)

    const { perfect: finnedLegPerfectCells, finns: finnCells } = categorizeFinnedLegCells(
        perfectLeg.cells,
        finnedLeg.cells,
    )

    const cellsToFocusData = {}

    const removableNotesHostCells = getFinnedXWingRemovableNotesHostCells({ houseType, legs }, notesData)

    defaultHighlightHouseCells({ houseType, cells: [perfectLeg.cells, finnedLegPerfectCells] }, cellsToFocusData)
    defaultHighlightCrossHouseCells({ houseType, cells: [perfectLeg.cells, finnedLegPerfectCells] }, cellsToFocusData)
    highlightXWingCells([...perfectLeg.cells, ...finnedLegPerfectCells], candidate, cellsToFocusData)
    highlightFinnCells(finnCells, candidate, cellsToFocusData)
    highlightRemovableNotesHostCells(removableNotesHostCells, candidate, notesData, cellsToFocusData)

    const focusedCells = getCellsFromCellsToFocusedData(cellsToFocusData)
    const tryOutProps = {
        hasTryOut: true,
        type: HINTS_IDS.FINNED_X_WING,
        focusedCells,
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([candidate]),
        clickableCells: [...removableNotesHostCells, ...getXWingCells(xWing.legs)],
        tryOutAnalyserData: {
            xWing,
            removableNotesHostCells,
        },
    }

    const hintChunks = finnedXWingType === XWING_TYPES.FINNED
        ? getFinnedXWingHintChunks(xWing, removableNotesHostCells)
        : getSashimiFinnedHintChunks(xWing, removableNotesHostCells, notesData)

    return {
        cellsToFocusData,
        title:
            finnedXWingType === XWING_TYPES.FINNED
                ? HINT_ID_VS_TITLES[HINTS_IDS.FINNED_X_WING]
                : HINT_ID_VS_TITLES[HINTS_IDS.SASHIMI_FINNED_X_WING],
        steps: getHintExplanationStepsFromHintChunks(hintChunks),
        applyHint: getApplyHintData(candidate, removableNotesHostCells),
        ...tryOutProps,
    }
}
