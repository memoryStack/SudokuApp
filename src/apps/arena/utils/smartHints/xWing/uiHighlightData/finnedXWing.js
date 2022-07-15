import {
    HINTS_IDS,
    HINT_TEXT_ELEMENTS_JOIN_CONJUGATION,
    HOUSE_TYPE,
    HOUSE_TYPE_VS_FULL_NAMES,
    SMART_HINTS_CELLS_BG_COLOR,
} from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { getCellHouseInfo, isCellExists, isCellNoteVisible } from '../../../util'
import {
    getCellsFromCellsToFocusedData,
    setCellDataInHintResult,
    getHintExplanationStepsFromHintChunks,
    getTryOutInputPanelNumbersVisibility,
} from '../../util'
import { getHouseCells } from '../../../houseCells'
import {
    categorizeLegs,
    categorizeFinnedLegCells,
    getFinnedXWingRemovableNotesHostCells,
    getHouseAxesText,
    getPerfectCellsInFinnedBlock,
    getXWingCandidate,
    getXWingHosuesInOrder,
    getXWingCells,
} from '../utils'
import { XWING_TYPES } from '../constants'
import { dynamicInterpolation } from '../../../../../../utils/utilities/dynamicInterpolation'
import { getCellsAxesValuesListText } from '../../tryOutInputAnalyser/helpers'

// TODO: come up with a better color scheme
// TODO: RENAME IT
const DIAGONAL_CELLS_COLORS = {
    TOP_LEFT_BOTTOM_RIGHT: 'orange',
    BOTTOM_LEFT_TOP_RIGHT: 'pink',
    FINN: 'rgb(255, 245, 187)',
}

const HOUSE_ORDER_KEYS = {
    FIRST: 'first',
    SECOND: 'second',
}

const LEGS_LOCATION_TEXT = {
    [HOUSE_TYPE.ROW]: {
        first: 'upper',
        second: 'lower',
    },
    [HOUSE_TYPE.COL]: {
        first: 'left',
        second: 'right',
    },
}

const getCrossHouseType = houseType => (houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

const getLegsLocation = (houseType, { perfectLeg, finnedLeg }) => {
    const perfectLegHouseNum = perfectLeg.cells[0][houseType]
    const finnedLegHouseNum = finnedLeg.cells[0][houseType]

    const perfectHouseKey = perfectLegHouseNum < finnedLegHouseNum ? HOUSE_ORDER_KEYS.FIRST : HOUSE_ORDER_KEYS.SECOND
    const finnedHouseKey =
        perfectHouseKey === HOUSE_ORDER_KEYS.SECOND ? HOUSE_ORDER_KEYS.FIRST : HOUSE_ORDER_KEYS.SECOND

    return {
        perfect: LEGS_LOCATION_TEXT[houseType][perfectHouseKey],
        finned: LEGS_LOCATION_TEXT[houseType][finnedHouseKey],
    }
}

const getTechniqueExplaination = ({ finnedXWingType, houseType, legs, removableNotesHostCells }) => {
    const xWing = { type: finnedXWingType, houseType, legs }
    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)

    const { perfect: perfectHouseLocation, finned: finnedHouseLocation } = getLegsLocation(houseType, {
        perfectLeg,
        finnedLeg,
    })

    const candidate = getXWingCandidate(xWing)

    const { finns: finnCells } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)

    const finnedLegHouse = getCellHouseInfo(houseType, finnedLeg.cells[0])

    const finnedBlockPerfectCells = getPerfectCellsInFinnedBlock(legs)

    const xWingHouses = getXWingHosuesInOrder(xWing)

    const msgPlaceholdersValues = {
        candidate,
        houseType: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        perfectHouseLocation,
        finnedHouseLocation,

        // new msg placeholder values
        finnedLegAxesText: getHouseAxesText(finnedLegHouse),
        finnedLegHouseText: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME,
        finnCellsAxesListText: getCellsAxesValuesListText(finnCells),
        finnCellEnglishText: finnCells.length === 1 ? 'cell' : 'cells',
        shareVerbGrammaticalText: finnCells.length === 1 ? 'shares' : 'share',
        finnedBlockPerfectCellsAxesText: getCellsAxesValuesListText(
            finnedBlockPerfectCells,
            HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
        ),
        finnedBlockPerfectCellsEnglishText: finnedBlockPerfectCells.length === 1 ? 'cell' : 'cells',
        hostHousesAxesListText: `${getHouseAxesText(xWingHouses[0])}, ${getHouseAxesText(xWingHouses[1])}`,
        hostHousePluralName: HOUSE_TYPE_VS_FULL_NAMES[houseType].FULL_NAME_PLURAL,
        removableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCells),
        removableNotesHostCellsText: removableNotesHostCells.length === 1 ? 'cell' : 'cells',
    }

    if (finnedXWingType === XWING_TYPES.FINNED) {
        const msgTemplates = HINT_EXPLANATION_TEXTS[HINTS_IDS.FINNED_X_WING]
        return msgTemplates.map(template => {
            return dynamicInterpolation(template, msgPlaceholdersValues)
        })
    } else {
        return dynamicInterpolation(HINT_EXPLANATION_TEXTS[HINTS_IDS.SASHIMI_FINNED_X_WING], msgPlaceholdersValues)
    }
}

// doing 2 things
const defaultHighlightHouseCells = ({ houseType, cells }, cellsToFocusData) => {
    const firstHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].row : cells[0][0].col
    const secondHouseNum = houseType === HOUSE_TYPE.ROW ? cells[1][0].row : cells[1][0].col

    const xWingHousesNum = [firstHouseNum, secondHouseNum]
    xWingHousesNum.forEach(houseNum => {
        getHouseCells(houseType, houseNum).forEach(cell =>
            setCellDataInHintResult(cell, { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }, cellsToFocusData),
        )
    })
}

// fully usable by sashimi  as well
const defaultHighlightCrossHouseCells = ({ houseType, cells }, cellsToFocusData) => {
    const firstCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][0].col : cells[0][0].row
    const secondCrossHouseNum = houseType === HOUSE_TYPE.ROW ? cells[0][1].col : cells[0][1].row
    const crossHousesNum = [firstCrossHouseNum, secondCrossHouseNum]
    crossHousesNum.forEach(houseNum => {
        const crossHouseType = getCrossHouseType(houseType)
        getHouseCells(crossHouseType, houseNum).forEach(cell => {
            const cellHighlightData = {
                bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
            }

            setCellDataInHintResult(cell, cellHighlightData, cellsToFocusData)
        })
    })
}

// sahimi can use it fully
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

// most of it can be used by sashimi
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

// sashimi-finned can also use it completely
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
    const candidate = legs[0].candidate

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
    const tryOutProps =
        finnedXWingType === XWING_TYPES.FINNED
            ? {
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
            : {}

    const hintSteps =
        finnedXWingType === XWING_TYPES.FINNED
            ? getHintExplanationStepsFromHintChunks(
                getTechniqueExplaination({ finnedXWingType, houseType, legs, removableNotesHostCells }),
            )
            : [{ text: getTechniqueExplaination({ finnedXWingType, houseType, legs, removableNotesHostCells }) }]
    return {
        cellsToFocusData,
        title:
            finnedXWingType === XWING_TYPES.FINNED
                ? HINT_ID_VS_TITLES[HINTS_IDS.FINNED_X_WING]
                : HINT_ID_VS_TITLES[HINTS_IDS.SASHIMI_FINNED_X_WING],
        steps: hintSteps,
        ...tryOutProps,
    }
}
