import { consoleLog, getBlockAndBoxNum, getRowAndCol } from '../../../utils/util'
import { getAllNakedSingles } from './smartHints/nakedSingle/nakedSingle'
import { getAllHiddenSingles } from './smartHints/hiddenSingle/hiddenSingle'
import { highlightNakedDoublesOrTriples } from './smartHints/nakedGroup'
import { NAKED_SINGLE_TYPES, HIDDEN_SINGLE_TYPES, SMART_HINTS_CELLS_BG_COLOR } from './smartHints/constants'
import { areSameCells, isCellEmpty } from './util'
import { highlightHiddenGroups } from './smartHints/hiddenGroup/hiddenGroup'

export const HOUSE_TYPE = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
}

// naked single starts here
// TODO: transfer it in other file of hints and tricks
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
        TITLE: 'Hidden Single',
    },
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
//                 if (!duplicacyPresent( k, mainNumbers, {row: i, col: j})) {
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

const nakedSingleRowDataToHighlight = (cell, cellsToFocusData = {}) => {
    const { row, col } = cell
    for (let cellNo = 0; cellNo < 9; cellNo++) {
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        const cellBGColor =
            cellNo === col ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT
        cellsToFocusData[row][cellNo] = { bgColor: cellBGColor }
    }
    return cellsToFocusData
}

const nakedSingleColDataToHighlight = ({ row, col }, cellsToFocusData = {}) => {
    for (let cell = 0; cell < 9; cell++) {
        if (!cellsToFocusData[cell]) cellsToFocusData[cell] = {}
        const cellBGColor =
            cell === row ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT
        cellsToFocusData[cell][col] = { bgColor: cellBGColor }
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
// naked single ends here

// TODO: change the below to support selective hints as well

const hintsHandlerMap = {
    0: function (mainNumbers, notesData) {
        let result = null
        const nakedSinglesData = getAllNakedSingles(mainNumbers, notesData)
        if (nakedSinglesData.length) {
            result = nakedSinglesData.map(({ cell, type }) => {
                return getNakedSingleTechniqueToFocus(type, mainNumbers, cell)
            })
        }
        return result
    },
    1: function (mainNumbers, notesData) {
        return getAllHiddenSingles(mainNumbers, notesData)
    },
    2: function (mainNumbers, notesData) {
        return hintsHandlerMap['NAKED_GROUP'](2, mainNumbers, notesData)
    },
    3: function (mainNumbers, notesData) {
        return hintsHandlerMap['HIDDEN_GROUP'](2, mainNumbers, notesData)
    },
    4: function (mainNumbers, notesData) {
        return hintsHandlerMap['NAKED_GROUP'](3, mainNumbers, notesData)
    },
    5: function (mainNumbers, notesData) {
        return hintsHandlerMap['HIDDEN_GROUP'](3, mainNumbers, notesData)
    },
    NAKED_GROUP: function (candidatesCount, mainNumbers, notesData) {
        const { present: nakedGroupFound, returnData } = highlightNakedDoublesOrTriples(
            candidatesCount,
            notesData,
            mainNumbers,
        )
        if (nakedGroupFound) return returnData
        return null
    },
    HIDDEN_GROUP: function (candidatesCount, mainNumbers, notesData) {
        const { present, returnData } = highlightHiddenGroups(candidatesCount, notesData, mainNumbers)
        if (present) return returnData
        return null
    },
    '-1': function (mainNumbers, notesData) {
        const result = []
        const nakedSingles = hintsHandlerMap['0'](mainNumbers, notesData)
        if (nakedSingles) result.push(...nakedSingles)

        const hiddenSingles = hintsHandlerMap['1'](mainNumbers, notesData)
        if (hiddenSingles) result.push(...hiddenSingles)

        const nakedDoubles = hintsHandlerMap['2'](mainNumbers, notesData)
        if (nakedDoubles) result.push(...nakedDoubles)

        const hiddenDoubles = hintsHandlerMap['3'](mainNumbers, notesData)
        if (hiddenDoubles) result.push(...hiddenDoubles)

        const nakedTripples = hintsHandlerMap['4'](mainNumbers, notesData)
        if (nakedTripples) result.push(...nakedTripples)

        const hiddenTripples = hintsHandlerMap['5'](mainNumbers, notesData)
        if (hiddenTripples) result.push(...hiddenTripples)

        return result
    },
}

const getSmartHint = async (originalMainNumbers, notesData, hintCode) => {
    const handler = hintsHandlerMap[hintCode]
    if (handler) {
        return handler(originalMainNumbers, notesData)
    }
    throw 'invalid type of selective hint'
}

// Below is the older hints generator func
// write this in JS and if performance is not good then shift to native side
// const getSmartHint = async (originalMainNumbers, notesData) => {
//     // why are we copying it ?? is it getting modified somewhere ??
//     // TODO: write a test case for it, so that it doesn't modifiy the inputs at all

//     const nakedSinglesData = getAllNakedSingles(originalMainNumbers, notesData)
//     if (nakedSinglesData.length) {
//         return nakedSinglesData.map(({ cell, type }) => {
//             return getNakedSingleTechniqueToFocus(type, originalMainNumbers, cell)
//         })
//     }

//     const hiddenSinglesData = getAllHiddenSingles(originalMainNumbers, notesData)
//     if (hiddenSinglesData.length) {
//         return hiddenSinglesData.map(({ cell, type }) => {
//             return getHiddenSingleTechniqueInfo(cell, type, originalMainNumbers)
//         })
//     }

//     const possibleGroupCandidatesCount = [2, 3]
//     for (let i = 0; i < possibleGroupCandidatesCount.length; i++) {
//         const groupCandidatesCount = possibleGroupCandidatesCount[i]
//         const { present: nakedGroupFound, returnData } = highlightNakedDoublesOrTriples(
//             groupCandidatesCount,
//             notesData,
//             originalMainNumbers,
//         )
//         if (nakedGroupFound) return returnData
//     }

//     for (let i = 0; i < possibleGroupCandidatesCount.length; i++) {
//         const groupCandidatesCount = possibleGroupCandidatesCount[i]
//         const { present, returnData } = highlightHiddenGroups(groupCandidatesCount, notesData, originalMainNumbers)
//         if (present) return returnData
//     }

//     return null
// }

export { getSmartHint }
