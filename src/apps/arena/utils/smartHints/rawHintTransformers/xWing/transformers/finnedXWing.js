import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

import { Houses } from '../../../../classes/houses'
import { NotesRecord } from '../../../../../RecordUtilities/boardNotes'
import { getHouseCells } from '../../../../houseCells'

import {
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE,
    HOUSE_TYPE_VS_FULL_NAMES,
} from '../../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../../stringLiterals'
import { getCellAxesValues, getCellHouseForHouseType } from '../../../../util'

import {
    getCellsFromCellsToFocusedData,
    setCellDataInHintResult,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
    transformCellBGColor,
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
import smartHintColorSystemReader from '../../../colorSystem.reader'

// TODO: come up with a better color scheme
// TODO: RENAME IT
const DIAGONAL_CELLS_COLORS = {
    TOP_LEFT_BOTTOM_RIGHT: 'orange',
    BOTTOM_LEFT_TOP_RIGHT: 'pink',
    FINN: 'rgb(255, 245, 187)',
}

const getCrossHouseType = houseType => (Houses.isRowHouse(houseType) ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

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
const defaultHighlightHouseCells = ({ houseType, cells }, cellsToFocusData, smartHintsColorSystem) => {
    const firstHouseNum = Houses.isRowHouse(houseType) ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = Houses.isRowHouse(houseType) ? cells[1][0].row : cells[1][0].col

    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells({ type: houseType, num: houseNum }).forEach(cell => {
            const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
    })
}

const defaultHighlightCrossHouseCells = ({ houseType, cells }, cellsToFocusData, smartHintsColorSystem) => {
    const firstCrossHouseNum = Houses.isRowHouse(houseType) ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = Houses.isRowHouse(houseType) ? cells[0][1].col : cells[0][1].row
    const crossHousesNum = [firstCrossHouseNum, secondCrossHouseNum]
    crossHousesNum.forEach(houseNum => {
        const crossHouseType = getCrossHouseType(houseType)
        getHouseCells({ type: crossHouseType, num: houseNum }).forEach(cell => {
            const cellHighlightData = {
                bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
            }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
    })
}

const highlightXWingCells = (cells, candidate, cellsToFocusData, smartHintsColorSystem) => {
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
                [candidate]: { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

const highlightFinnCells = (finnCells, candidate, cellsToFocusData, smartHintsColorSystem) => {
    finnCells.forEach(({ row, col }) => {
        const cellHighlightData = {
            bgColor: {
                backgroundColor: DIAGONAL_CELLS_COLORS.FINN,
            },
            notesToHighlightData: {
                [candidate]: { fontColor: smartHintColorSystemReader.safeNoteColor(smartHintsColorSystem) },
            },
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })
}

const highlightRemovableNotesHostCells = (hostCells, candidate, notesData, cellsToFocusData, smartHintsColorSystem) => {
    hostCells
        .filter(cell => NotesRecord.isNotePresentInCell(notesData, candidate, cell))
        .forEach(cell => {
            const cellHighlightData = {
                bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)),
                notesToHighlightData: {
                    [candidate]: { fontColor: smartHintColorSystemReader.toBeRemovedNoteColor(smartHintsColorSystem) },
                },
            }
            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
}

export const getFinnedXWingUIData = (xWing, notesData, smartHintsColorSystem) => {
    const { type: finnedXWingType, legs, houseType } = xWing
    const { candidate } = legs[0]

    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)

    const { perfect: finnedLegPerfectCells, finns: finnCells } = categorizeFinnedLegCells(
        perfectLeg.cells,
        finnedLeg.cells,
    )

    const cellsToFocusData = {}

    const removableNotesHostCells = getFinnedXWingRemovableNotesHostCells({ houseType, legs }, notesData)

    defaultHighlightHouseCells({ houseType, cells: [perfectLeg.cells, finnedLegPerfectCells] }, cellsToFocusData, smartHintsColorSystem)
    defaultHighlightCrossHouseCells({ houseType, cells: [perfectLeg.cells, finnedLegPerfectCells] }, cellsToFocusData, smartHintsColorSystem)
    highlightXWingCells([...perfectLeg.cells, ...finnedLegPerfectCells], candidate, cellsToFocusData, smartHintsColorSystem)
    highlightFinnCells(finnCells, candidate, cellsToFocusData, smartHintsColorSystem)
    highlightRemovableNotesHostCells(removableNotesHostCells, candidate, notesData, cellsToFocusData, smartHintsColorSystem)

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
