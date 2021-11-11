import { getBlockAndBoxNum, getRowAndCol } from '../../../utils/util'
import { duplicacyPresent } from './util'
import { Styles as boardStyles } from '../gameBoard/style'

const NAKED_SINGLE_TYPES = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
    MIX: 'mix',
}

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
    HIDDEN_SINGLE: {
        title: 'Hidden Single',
    },
}

/*
    TODO: come upp with better colors later on
    let's focus on the functionality for now
*/

const SMART_HINTS_CELLS_BG_COLOR = {
    SELECTED: boardStyles.selectedCellBGColor,
    IN_FOCUS_DEFAULT: boardStyles.defaultCellBGColor,
}

const copyBoardMainNumbers = mainNumbers => {
    const boardCopy = new Array(9)
    for (let i = 0; i < 9; i++) {
        const rowData = new Array(9)
        for (let j = 0; j < 9; j++) {
            rowData[j] = { ...mainNumbers[i][j] }
        }
        boardCopy[i] = rowData
    }
    return boardCopy
}

// DS for naked singles
// const getCellsNotesInfo = (mainNumbers) => {
//     const notesData = new Array(9)
//     for (let i = 0; i < 9; i++) {
//         const rowNotes = []
//         for (let j = 0; j < 9; j++) {
//             const boxNotes = new Array(9)
//             let cellNotesCount = 0
//             for (let k = 1; k <= 9; k++) {
//                 if (!duplicacyPresent(i, j, k, mainNumbers)) {
//                     boxNotes[k - 1] = k
//                     cellNotesCount++
//                 }
//             }
//             rowNotes.push({ boxNotes, count: cellNotesCount })
//         }
//         notesData[i] = rowNotes
//     }
//     return notesData
// }

const getNakedSingleInfo = (row, col, mainNumbers) => {
    let singleType = ''
    let candidatesFilled = 0
    for (let col = 0; col < 9; col++) {
        // check for row
        if (mainNumbers[row][col].value) candidatesFilled++
    }
    if (candidatesFilled === 8) {
        singleType = NAKED_SINGLE_TYPES.ROW
    } else {
        candidatesFilled = 0
    }

    if (candidatesFilled === 0) {
        // check for column
        for (let row = 0; row < 9; row++) {
            if (mainNumbers[row][col].value) candidatesFilled++
        }
        if (candidatesFilled === 8) singleType = NAKED_SINGLE_TYPES.COL
        else candidatesFilled = 0
    }

    if (candidatesFilled === 0) {
        // check for block
        const { blockNum } = getBlockAndBoxNum(row, col)
        for (let boxNum = 0; boxNum < 9; boxNum++) {
            const { row, col } = getRowAndCol(blockNum, boxNum)
            if (mainNumbers[row][col].value) candidatesFilled++
        }
        if (candidatesFilled === 8) singleType = NAKED_SINGLE_TYPES.BLOCK
        else candidatesFilled = 0
    }

    if (candidatesFilled === 0) {
        // check for mix
        for (let num = 1; num <= 9; num++) {
            if (duplicacyPresent(row, col, num, mainNumbers)) candidatesFilled++
        }
        if (candidatesFilled === 8) singleType = NAKED_SINGLE_TYPES.MIX
        else candidatesFilled = 0
    }

    return {
        present: singleType !== '', // a boolean
        type: singleType, // row, col, block or mix of all the houses
    }
}

const nakedSingleRowDataToHighlight = (row, col, cellsToFocusData = {}) => {
    // const cellsToFocusData = {[row]: {}}
    for (let cell = 0; cell < 9; cell++) {
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        const cellBGColor =
            cell === col ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT
        cellsToFocusData[row][cell] = { bgColor: cellBGColor }
    }
    return cellsToFocusData
}

const nakedSingleColDataToHighlight = (row, col, cellsToFocusData = {}) => {
    // const cellsToFocusData = {[col]: {}}
    for (let cell = 0; cell < 9; cell++) {
        if (!cellsToFocusData[cell]) cellsToFocusData[cell] = {}
        const cellBGColor =
            cell === row ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT
        cellsToFocusData[cell][col] = { bgColor: cellBGColor }
    }
    return cellsToFocusData
}

const nakedSingleBlockDataToHighlight = (selectedRow, selectedCol, cellsToFocusData = {}) => {
    const { blockNum } = getBlockAndBoxNum(selectedRow, selectedCol)
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
const nakedSingleMixHousesDataToHighlight = (row, col) => {
    let cellsToFocusData = nakedSingleRowDataToHighlight(row, col)
    cellsToFocusData = nakedSingleColDataToHighlight(row, col, cellsToFocusData)
    cellsToFocusData = nakedSingleBlockDataToHighlight(row, col, cellsToFocusData)
    return cellsToFocusData
}

const getNakedSingleTechniqueToFocus = (row, col, type, mainNumbers) => {
    let cellsToFocusData = null
    let logic = ''
    switch (type) {
        case NAKED_SINGLE_TYPES.ROW:
            cellsToFocusData = nakedSingleRowDataToHighlight(row, col)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                'row',
                mainNumbers[row][col].solutionValue,
            )
            break
        case NAKED_SINGLE_TYPES.COL:
            cellsToFocusData = nakedSingleColDataToHighlight(row, col)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                'col',
                mainNumbers[row][col].solutionValue,
            )
            break
        case NAKED_SINGLE_TYPES.BLOCK:
            cellsToFocusData = nakedSingleBlockDataToHighlight(row, col)
            logic = SMART_HINTS_TECHNIQUES.NAKED_SINGLE.DESCRIPTION.getSingleHouseMsg(
                'block',
                mainNumbers[row][col].solutionValue,
            )
            break
        case NAKED_SINGLE_TYPES.MIX:
            cellsToFocusData = nakedSingleMixHousesDataToHighlight(row, col)
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
    }
}

// deep clone the mainNumbers
// write this in JS and if performance is not good then shift to native side
const getSmartHint = async ({ row, col }, originalMainNumbers) => {
    const boardMainNumbersCopy = copyBoardMainNumbers(originalMainNumbers)

    // we don't need this DS to know if aked single is present or not in this cell
    // const nakedSinglesNotesInfo = getCellsNotesInfo(boardMainNumbersCopy)

    const { present: nakedSinglePresent, type: nakedSingleType } = getNakedSingleInfo(row, col, boardMainNumbersCopy)
    if (nakedSinglePresent) {
        return getNakedSingleTechniqueToFocus(row, col, nakedSingleType, originalMainNumbers)
    }

    // next: search for hidden singles in this cell

    return null
}

export { getSmartHint }
