import { getRowAndCol, getBlockAndBoxNum } from '../../../../../utils/util'
import { dynamicInterpolation } from '../../../../../utils/utilities/dynamicInterpolation'
import { SMART_HINTS_CELLS_BG_COLOR, NAKED_SINGLE_TYPES, HINTS_IDS } from '../constants'
import { HINT_ID_VS_TITLES } from '../stringLiterals'
import { setCellDataInHintResult } from '../util'

const getSingleHouseNakedSingleDescription = (houseType, solutionValue) => {

    const msgValues = {
        houseType,
        solutionValue,
    }

    const msgPlaceholder = `in this {{houseType}} only the selected cell is empty so from 1-9 only one number can come in this cell which is {{solutionValue}}`

    return dynamicInterpolation(msgPlaceholder, msgValues)

    return `in this ${houseType} only the selected cell is empty so from 1-9 only one number can come in this cell which is ${solutionValue}`
}

const getMultipleHousesNakeSingleDescription = solutionValue => {

    const msgValues = {
        solutionValue,
    }

    const msgPlaceholder = `except {{solutionValue}} every other number from 1-9 is preset in the row, col and block of this highlighted cell so only number that can appear in this cell is {{solutionValue}}`

    return dynamicInterpolation(msgPlaceholder, msgValues)

    return `except ${solutionValue} every other number from 1-9 is preset in the row, col and block of this highlighted cell so only number that can appear in this cell is ${solutionValue}`
}

const SMART_HINTS_TECHNIQUES = {
    NAKED_SINGLE: {
        TITLE: HINT_ID_VS_TITLES[HINTS_IDS.NAKED_SINGLE],
        DESCRIPTION: {
            getSingleHouseMsg: (houseType, solutionValue) =>
                getSingleHouseNakedSingleDescription(houseType, solutionValue),
            getMultipleHouseMsg: solutionValue => getMultipleHousesNakeSingleDescription(solutionValue),
        },
    },
}

const nakedSingleRowDataToHighlight = (cell, cellsToFocusData = {}) => {
    for (let col = 0; col < 9; col++) {
        const cellHighlightData = {
            bgColor:
                col === cell.col ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
        }
        setCellDataInHintResult({ row: cell.row, col }, cellHighlightData, cellsToFocusData)
    }
    return cellsToFocusData
}

const nakedSingleColDataToHighlight = (cell, cellsToFocusData = {}) => {
    for (let row = 0; row < 9; row++) {
        const cellHighlightData = {
            bgColor:
                row === cell.row ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
        }
        setCellDataInHintResult({ row, col: cell.col }, cellHighlightData, cellsToFocusData)
    }
    return cellsToFocusData
}

const nakedSingleBlockDataToHighlight = (hostCell, cellsToFocusData = {}) => {
    const { blockNum } = getBlockAndBoxNum(hostCell)
    for (let cell = 0; cell < 9; cell++) {
        const { row, col } = getRowAndCol(blockNum, cell)
        const cellHighlightData = {
            bgColor:
                hostCell.row === row && hostCell.col === col
                    ? SMART_HINTS_CELLS_BG_COLOR.SELECTED
                    : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
        }
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    }
    return cellsToFocusData
}

// if naked single is because of the mix of two or more houses
const nakedSingleMixHousesDataToHighlight = cell => {
    let cellsToFocusData = nakedSingleRowDataToHighlight(cell)
    cellsToFocusData = nakedSingleColDataToHighlight(cell, cellsToFocusData)
    cellsToFocusData = nakedSingleBlockDataToHighlight(cell, cellsToFocusData)
    return cellsToFocusData
}

const getNakedSingleTechniqueToFocus = (type, mainNumbers, cell) => {
    const { row, col } = cell
    let cellsToFocusData = null
    let logic = ''
    switch (type) {
        case NAKED_SINGLE_TYPES.ROW:
            cellsToFocusData = nakedSingleRowDataToHighlight(cell)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                'row',
                mainNumbers[row][col].solutionValue,
            )
            break
        case NAKED_SINGLE_TYPES.COL:
            cellsToFocusData = nakedSingleColDataToHighlight(cell)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                'col',
                mainNumbers[row][col].solutionValue,
            )
            break
        case NAKED_SINGLE_TYPES.BLOCK:
            cellsToFocusData = nakedSingleBlockDataToHighlight(cell)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                'block',
                mainNumbers[row][col].solutionValue,
            )
            break
        case NAKED_SINGLE_TYPES.MIX:
            cellsToFocusData = nakedSingleMixHousesDataToHighlight(cell)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getMultipleHouseMsg(
                mainNumbers[row][col].solutionValue,
            )
    }

    return {
        cellsToFocusData,
        title: SMART_HINTS_TECHNIQUES.NAKED_SINGLE.TITLE,
        steps: [{ text: logic }],
        selectCellOnClose: { row, col },
    }
}

const getUIHighlightData = (singles, mainNumbers) => {
    if (!singles.length) return null
    return singles.map(({ cell, type }) => {
        return getNakedSingleTechniqueToFocus(type, mainNumbers, cell)
    })
}

export { getUIHighlightData }
