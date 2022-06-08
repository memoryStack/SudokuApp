import { HOUSE_TYPE, SMART_HINTS_CELLS_BG_COLOR } from '../../constants'
import { isCellExists, isCellNoteVisible } from '../../../util'
import { setCellDataInHintResult } from '../../util'
import { getHouseCells } from '../../../houseCells'
import { categorizeLegs, categorizeFinnedLegCells, getFinnedXWingRemovableNotesHostCells } from '../utils'
import { XWING_TYPES } from '../constants'


// TODO: come up with a better color scheme
// TODO: RENAME IT
const DIAGONAL_CELLS_COLORS = {
    TOP_LEFT_BOTTOM_RIGHT: 'orange',
    BOTTOM_LEFT_TOP_RIGHT: 'pink',
    FINN: 'rgb(255, 245, 187)'
}

// export it to constants
const HOUSE_TYPE_VOCABOLARY = {
    [HOUSE_TYPE.ROW]: {
        FULL_NAME: 'row',
        FULL_NAME_PLURAL: 'rows',
    },
    [HOUSE_TYPE.COL]: {
        FULL_NAME: 'column',
        FULL_NAME_PLURAL: 'columns',
    },
}

const HOUSE_ORDER_KEYS = {
    FIRST: 'first',
    SECOND: 'second'
}

const LEGS_LOCATION_TEXT = {
    [HOUSE_TYPE.ROW]: {
        first: 'upper',
        second: 'lower'
    },
    [HOUSE_TYPE.COL]: {
        first: 'left',
        second: 'right'
    },
}

const getCrossHouseType = houseType => (houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

const getLegsLocation = (houseType, { perfectLeg, finnedLeg }) => {
    const perfectLegHouseNum = perfectLeg.cells[0][houseType]
    const finnedLegHouseNum = finnedLeg.cells[0][houseType]

    const perfectHouseKey = perfectLegHouseNum < finnedLegHouseNum ? HOUSE_ORDER_KEYS.FIRST : HOUSE_ORDER_KEYS.SECOND
    const finnedHouseKey = perfectHouseKey === HOUSE_ORDER_KEYS.SECOND ? HOUSE_ORDER_KEYS.FIRST : HOUSE_ORDER_KEYS.SECOND

    return {
        perfect: LEGS_LOCATION_TEXT[houseType][perfectHouseKey],
        finned: LEGS_LOCATION_TEXT[houseType][finnedHouseKey],
    }
}

// TODO: learn RegExes and write a better versio the func mentioned in the below link
// https://stackoverflow.com/questions/40672651/es6-multiline-template-strings-with-no-new-lines-and-allow-indents
const getTechniqueExplaination = ({ finnedXWingType, houseType, legs }) => {
    const { perfect: perfectHouseLocation, finned: finnedHouseLocation } = getLegsLocation(houseType, legs)
    const candidate = legs.perfectLeg.candidate
    if (finnedXWingType === XWING_TYPES.FINNED) {
        return `If you don't know about X-Wing then you won't be able to understand this hint.\n`
            + `Finned X-Wing is basically X-Wing with finns.`
            + ` Finn cells are extra cells in the same block as one of the orange/pink colored cell which have same candidate we focus on in X-Wing.`
            + ` Finns are cells highlighted in yellow color which have ${candidate} present in them.`
            + ` Only one of these 4 cells in orange/pink color can have finns to make it a valid Finned X-Wing.\n`
            + `In the ${perfectHouseLocation} ${houseType} it doesn't matter where we place ${candidate}, in the ${finnedHouseLocation} ${houseType} ${candidate} will`
            + ` be placed such that ${candidate} note highlighted in red color will always be eliminated. so it's safe to remove it from there.`
    } else {
        return `If you don't know about "Finned X-Wing" then you won't be able to understand this hint.\n`
            + `Sashimi Finned X-Wing is basically Finned X-Wing but here one cell is allowed to not have the candidate which we are targeting in X-Wing. And the cell which doesn't have`
            + ` targetted candidate in that will have finn cell in it's block. This arrangement of any number makes a Sashimi Finned X-Wing.`
            + ` As we can see here in the ${finnedHouseLocation} ${houseType} one cell highlighted in orange/pink color doesn't have ${candidate} but has has finn cells in the block.`
            + ` Now just like Finned X-Wing, we can claim that all the ${candidate} highlighted in the red color can be eliminated.\n`
            + `In the ${perfectHouseLocation} ${houseType} it doesn't matter where we place ${candidate}, in the ${finnedHouseLocation} ${houseType} ${candidate} will`
            + ` be placed such that ${candidate} note highlighted in red color will always be eliminated. so it's safe to remove it from there.`
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

export const getFinnedXWingUIData = ({ type: finnedXWingType, legs, houseType }, notesData) => {
    const candidate = legs[0].candidate

    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)

    const { perfect: finnedLegPerfectCells, finns: finnCells } = categorizeFinnedLegCells(
        perfectLeg.cells,
        finnedLeg.cells,
    )

    const cellsToFocusData = {}

    defaultHighlightHouseCells({ houseType, cells: [perfectLeg.cells, finnedLegPerfectCells] }, cellsToFocusData)
    defaultHighlightCrossHouseCells({ houseType, cells: [perfectLeg.cells, finnedLegPerfectCells] }, cellsToFocusData)
    highlightXWingCells([...perfectLeg.cells, ...finnedLegPerfectCells], candidate, cellsToFocusData)
    highlightFinnCells(finnCells, candidate, cellsToFocusData)
    highlightRemovableNotesHostCells(
        getFinnedXWingRemovableNotesHostCells({ houseType, legs }),
        candidate,
        notesData,
        cellsToFocusData,
    )

    return {
        cellsToFocusData,
        title: finnedXWingType === XWING_TYPES.FINNED ? 'Finned X-Wing' : 'Sashimi Finned X-Wing',
        steps: [{ text: getTechniqueExplaination({ finnedXWingType, houseType, legs: { perfectLeg, finnedLeg } }) }],
    }
}
