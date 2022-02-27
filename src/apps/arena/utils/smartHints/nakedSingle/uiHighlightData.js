import { getRowAndCol, getBlockAndBoxNum } from '../../../../../utils/util'
import { SMART_HINTS_CELLS_BG_COLOR, NAKED_SINGLE_TYPES } from '../constants'

const getSingleHouseNakedSingleDescription = (houseType, solutionValue) =>
    `in this ${houseType} only the selected cell is empty so from 1-9 only one number can come in this cell which is ${solutionValue}`

const getMultipleHousesNakeSingleDescription = solutionValue =>
    `except ${solutionValue} every other number from 1-9 is preset in the row, col and block of this highlighted cell so only number that can appear in this cell is ${solutionValue}`

const SMART_HINTS_TECHNIQUES = {
    NAKED_SINGLE: {
        TITLE: 'Naked Single',
        DESCRIPTION: {
            getSingleHouseMsg: (houseType, solutionValue) =>
                getSingleHouseNakedSingleDescription(houseType, solutionValue),
            getMultipleHouseMsg: solutionValue => getMultipleHousesNakeSingleDescription(solutionValue),
        },
    },
}

const nakedSingleRowDataToHighlight = (cell, cellsToFocusData = {}) => {
    for (let col = 0; col < 9; col++) {
        if (!cellsToFocusData[cell.row]) cellsToFocusData[cell.row] = {}
        const cellBGColor =
            col === cell.col ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT
        cellsToFocusData[cell.row][col] = { bgColor: cellBGColor }
    }
    return cellsToFocusData
}

const nakedSingleColDataToHighlight = (cell, cellsToFocusData = {}) => {
    for (let row = 0; row < 9; row++) {
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        const cellBGColor =
            row === cell.row ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT
        cellsToFocusData[row][cell.col] = { bgColor: cellBGColor }
    }
    return cellsToFocusData
}

const nakedSingleBlockDataToHighlight = ({ row: selectedRow, col: selectedCol }, cellsToFocusData = {}) => {
    const selectedCell = {
        row: selectedRow,
        col: selectedCol,
    }
    const { blockNum } = getBlockAndBoxNum(selectedCell)
    for (let cell = 0; cell < 9; cell++) {
        const { row, col } = getRowAndCol(blockNum, cell)
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        const cellBGColor =
            selectedRow === row && selectedCol === col
                ? SMART_HINTS_CELLS_BG_COLOR.SELECTED
                : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT
        cellsToFocusData[row][col] = { bgColor: cellBGColor }
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
        techniqueInfo: {
            title: SMART_HINTS_TECHNIQUES.NAKED_SINGLE.TITLE,
            logic,
        },
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
