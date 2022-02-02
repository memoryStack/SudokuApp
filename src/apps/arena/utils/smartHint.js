import { consoleLog, getBlockAndBoxNum, getRowAndCol } from '../../../utils/util'
import { getAllNakedSingles } from './smartHints/nakedSingle/nakedSingle'
import { getAllHiddenSingles } from './smartHints/hiddenSingle/hiddenSingle'
import { highlightNakedDoublesOrTriples } from './smartHints/nakedGroup'
import { NAKED_SINGLE_TYPES, HIDDEN_SINGLE_TYPES, SMART_HINTS_CELLS_BG_COLOR } from './smartHints/constants'
import { isCellEmpty } from './util'

const HOUSE_TYPE = {
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

// hidden singles starts here
const getHiddenSingleLogic = (type, value) => {
    return `in the highlighted ${type}, ${value} can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come`
}

const getCandidateInstanceCoordinatesInRow = (candidate, row, mainNumbers) => {
    for (let col = 0; col < 9; col++) {
        if (mainNumbers[row][col].value === candidate) return { row, col }
    }
    return null
}

const getCandidateInstanceCoordinatesInCol = (candidate, col, mainNumbers) => {
    for (let row = 0; row < 9; row++) {
        if (mainNumbers[row][col].value === candidate) return { row, col }
    }
    return null
}

const getCandidateInstanceCoordinatesInBlock = (candidate, block, mainNumbers) => {
    for (let cell = 0; cell < 9; cell++) {
        const { row, col } = getRowAndCol(block, cell)
        if (mainNumbers[row][col].value === candidate) return { row, col }
    }
    return null
}

const getInhabitableCellData = () => {
    return {
        bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT,
        inhabitable: true,
    }
}

// TODO: write test cases for it
const getBlockStartCell = blockNum => {
    return {
        row: blockNum - (blockNum % 3),
        col: (blockNum % 3) * 3,
    }
}

const hiddenSingleInRowHighlightBlockCells = ({
    selectedRow,
    selectedCol,
    blockNum,
    mainNumbers,
    cellsToFocusData,
    candidateCordinatesInBlock,
}) => {
    const winnerCandidate = mainNumbers[selectedRow][selectedCol].solutionValue
    if (!cellsToFocusData[selectedRow]) cellsToFocusData[selectedRow] = {}

    const currentBlockStartColumn = getBlockStartCell(blockNum).col
    for (let i = 0; i < 3; i++) {
        const col = currentBlockStartColumn + i
        if (col === selectedCol) continue
        if (!mainNumbers[selectedRow][col].value) {
            if (!candidateCordinatesInBlock) {
                const { row: instanceRow, col: instanceCol } = getCandidateInstanceCoordinatesInCol(
                    winnerCandidate,
                    col,
                    mainNumbers,
                )
                if (!cellsToFocusData[instanceRow]) cellsToFocusData[instanceRow] = {}
                cellsToFocusData[instanceRow][instanceCol] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            }
            cellsToFocusData[selectedRow][col] = getInhabitableCellData()
        } else {
            cellsToFocusData[selectedRow][col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        }
    }
}

const hiddenSingleInColHighlightBlockCells = ({
    selectedRow,
    selectedCol,
    blockNum,
    mainNumbers,
    cellsToFocusData,
    candidateCordinatesInBlock,
}) => {
    const winnerCandidate = mainNumbers[selectedRow][selectedCol].solutionValue
    const currentBlockStartRow = getBlockStartCell(blockNum).row
    for (let i = 0; i < 3; i++) {
        const row = currentBlockStartRow + i
        if (row === selectedRow) continue
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        if (!mainNumbers[row][selectedCol].value) {
            if (!candidateCordinatesInBlock) {
                const { row: instanceRow, col: instanceCol } = getCandidateInstanceCoordinatesInRow(
                    winnerCandidate,
                    row,
                    mainNumbers,
                )
                if (!cellsToFocusData[instanceRow]) cellsToFocusData[instanceRow] = {}
                cellsToFocusData[instanceRow][instanceCol] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            }
            cellsToFocusData[row][selectedCol] = getInhabitableCellData()
        } else {
            cellsToFocusData[row][selectedCol] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
        }
    }
}

const shouldHighlightWinnerCandidateInstanceInBlock = (hostCell, blockNum, singleType, mainNumbers) => {
    const blockFirstCell = getRowAndCol(blockNum, 0)
    const cellIncrementer = singleType === HIDDEN_SINGLE_TYPES.ROW ? { row: 0, col: 1 } : { row: 1, col: 0 }
    const hostHouseCellInBlock =
        singleType === HIDDEN_SINGLE_TYPES.ROW
            ? { row: hostCell.row, col: blockFirstCell.col }
            : { row: blockFirstCell.row, col: hostCell.col }

    let hostCellsCountInBlock = 3
    for (let i = 0; i < hostCellsCountInBlock; i++) {
        if (isCellEmpty(hostHouseCellInBlock, mainNumbers)) return true
        hostHouseCellInBlock.row += cellIncrementer.row
        hostHouseCellInBlock.col += cellIncrementer.col
    }
    return false
}

// TODO: simplify this flow
const highlightBlockCells = ({ selectedRow, selectedCol, blockNum, mainNumbers, cellsToFocusData, singleType }) => {
    const winnerCandidate = mainNumbers[selectedRow][selectedCol].solutionValue

    const candidateCordinatesInBlock = getCandidateInstanceCoordinatesInBlock(winnerCandidate, blockNum, mainNumbers)
    if (
        shouldHighlightWinnerCandidateInstanceInBlock(
            { row: selectedRow, col: selectedCol },
            blockNum,
            singleType,
            mainNumbers,
        ) &&
        candidateCordinatesInBlock
    ) {
        const { row, col } = candidateCordinatesInBlock
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        cellsToFocusData[row][col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
    }

    if (singleType === HIDDEN_SINGLE_TYPES.ROW) {
        hiddenSingleInRowHighlightBlockCells({
            selectedRow,
            selectedCol,
            blockNum,
            mainNumbers,
            cellsToFocusData,
            candidateCordinatesInBlock,
        })
    } else {
        hiddenSingleInColHighlightBlockCells({
            selectedRow,
            selectedCol,
            blockNum,
            mainNumbers,
            cellsToFocusData,
            candidateCordinatesInBlock,
        })
    }
}

const getNextNeighbourBlock = (currentBlockNum, type) => {
    let neighbourBlockNum = -1
    if (type === HIDDEN_SINGLE_TYPES.ROW) {
        neighbourBlockNum = currentBlockNum + 1
        if (neighbourBlockNum % 3 === 0) neighbourBlockNum -= 3
    } else if (type === HIDDEN_SINGLE_TYPES.COL) {
        neighbourBlockNum = (currentBlockNum + 3) % 9
    }
    return neighbourBlockNum
}

// row and column are going to have same logic, let's write them down in the same function only
// let's make it generic for col as well
const getHiddenSingleInRowOrColData = (cell, type, mainNumbers) => {
    const { row: selectedRow, col: selectedCol } = cell
    const cellsToFocusData = {}
    if (!cellsToFocusData[selectedRow]) cellsToFocusData[selectedRow] = {}
    cellsToFocusData[selectedRow][selectedCol] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }

    const { blockNum: currentBlockNum } = getBlockAndBoxNum(cell)
    highlightBlockCells({
        selectedRow,
        selectedCol,
        blockNum: currentBlockNum,
        mainNumbers,
        cellsToFocusData,
        singleType: type,
    })

    // check in 2 neighbour blocks
    let neighboursBlocks = 2
    let neighbourBlockNum = getNextNeighbourBlock(currentBlockNum, type)
    while (neighboursBlocks--) {
        highlightBlockCells({
            selectedRow,
            selectedCol,
            blockNum: neighbourBlockNum,
            mainNumbers,
            cellsToFocusData,
            singleType: type,
        })
        neighbourBlockNum = getNextNeighbourBlock(neighbourBlockNum, type)
    }
    return cellsToFocusData
}

const getWinnerInstanceInfoInRow = (firstCell, winnerCandidate, mainNumbers, neighbourRows) => {
    const getWinnerInstancePosInRow = () => {
        for (let col = 0; col < 9; col++) {
            if (mainNumbers[firstCell.row][col].value === winnerCandidate) return col
        }
        return -1
    }

    const getBlockEmptyCellsCountInRow = () => {
        let result = 0
        for (let i = 0; i < 3; i++) {
            if (isCellEmpty({ row: firstCell.row, col: firstCell.col + i }, mainNumbers)) result++
        }
        return result
    }

    const emptyCellsCount = getBlockEmptyCellsCountInRow()
    if (emptyCellsCount) {
        const winnerInstancePos = getWinnerInstancePosInRow()
        if (winnerInstancePos !== -1) {
            neighbourRows[firstCell.row] = {
                emptyCellsCount,
                col: winnerInstancePos,
            }
        }
    }
}

const getWinnerInstanceInfoInCol = (firstCell, winnerCandidate, mainNumbers, neighbourCols) => {
    const getWinnerInstancePosInCol = () => {
        for (let row = 0; row < 9; row++) {
            if (mainNumbers[row][firstCell.col].value === winnerCandidate) return row
        }
        return -1
    }

    const getBlockEmptyCellsCountInCol = () => {
        let result = 0
        for (let i = 0; i < 3; i++) {
            if (isCellEmpty({ row: firstCell.row + i, col: firstCell.col }, mainNumbers)) result++
        }
        return result
    }

    const emptyCellsCount = getBlockEmptyCellsCountInCol()
    if (emptyCellsCount) {
        const winnerInstancePos = getWinnerInstancePosInCol()
        if (winnerInstancePos !== -1) {
            neighbourCols[firstCell.col] = {
                emptyCellsCount,
                row: winnerInstancePos,
            }
        }
    }
}

const getHiddenSingleInBlockData = (hostCell, mainNumbers) => {
    const { row: hostRow, col: hostCol } = hostCell

    // highlight all the cells of the current block
    // change the naming of "neighbourRows" and "neighbourCols"
    // it doesn't communicate anything
    const neighbourRows = {}
    const neighbourCols = {}
    const { blockNum: hostBlockNum } = getBlockAndBoxNum(hostCell)
    const { row: startRow, col: startCol } = getBlockStartCell(hostBlockNum)
    const winnerCandidate = mainNumbers[hostRow][hostCol].solutionValue
    for (let i = 0; i < 3; i++) {
        const row = startRow + i

        if (row !== hostRow) {
            getWinnerInstanceInfoInRow({ row, col: startCol }, winnerCandidate, mainNumbers, neighbourRows)
        }

        const col = startCol + i
        if (col !== hostCol) {
            getWinnerInstanceInfoInCol({ row: startRow, col }, winnerCandidate, mainNumbers, neighbourCols)
        }
    }

    const mustHighlightWinnerInstances = { row: {}, col: {} } // will store which instances will be must highlighted
    const cellsToFocusData = {}
    Object.keys(neighbourRows).forEach(rowKey => {
        const rowInt = parseInt(rowKey, 10)
        if (!mainNumbers[rowInt][hostCol].value) {
            const { col: instanceColumn } = neighbourRows[rowKey]
            if (!cellsToFocusData[rowInt]) cellsToFocusData[rowInt] = {}
            cellsToFocusData[rowInt][instanceColumn] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            mustHighlightWinnerInstances.row[rowKey] = true
        }
    })

    Object.keys(neighbourCols).forEach(colKey => {
        const colInt = parseInt(colKey, 10)
        if (!mainNumbers[hostRow][colInt].value) {
            const { row: instanceRow } = neighbourCols[colKey]
            if (!cellsToFocusData[instanceRow]) cellsToFocusData[instanceRow] = {}
            cellsToFocusData[instanceRow][colInt] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            mustHighlightWinnerInstances.col[colKey] = true
        }
    })

    for (let cellNo = 0; cellNo < 9; cellNo++) {
        const { row, col } = getRowAndCol(hostBlockNum, cellNo)
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        if (mainNumbers[row][col].value) {
            cellsToFocusData[row][col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            continue
        }
        if (row === hostRow && col === hostCol) {
            cellsToFocusData[row][col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }
            continue
        }

        if (!mainNumbers[row][col].value) {
            cellsToFocusData[row][col] = getInhabitableCellData()
            // calculate who wins here and highlight that instance and record it
            if (mustHighlightWinnerInstances.row[row] || mustHighlightWinnerInstances.col[col]) continue

            let highlightInstanceHouseType = ''
            if (neighbourRows[row] && neighbourCols[col]) {
                const cellsRuledOutByRowInstance = neighbourRows[row].emptyCellsCount
                const cellsRuledOutByColInstance = neighbourCols[col].emptyCellsCount
                highlightInstanceHouseType =
                    cellsRuledOutByRowInstance > cellsRuledOutByColInstance ? HOUSE_TYPE.ROW : HOUSE_TYPE.COL
            }

            if (!neighbourRows[row] && neighbourCols[col]) {
                highlightInstanceHouseType = HOUSE_TYPE.COL
            }

            if (neighbourRows[row] && !neighbourCols[col]) {
                highlightInstanceHouseType = HOUSE_TYPE.ROW
            }

            if (highlightInstanceHouseType === HOUSE_TYPE.ROW) {
                mustHighlightWinnerInstances.row[row] = true
                const { col: instanceColumn } = neighbourRows[row]
                cellsToFocusData[row][instanceColumn] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            } else if (highlightInstanceHouseType === HOUSE_TYPE.COL) {
                mustHighlightWinnerInstances.col[col] = true
                const { row: instanceRow } = neighbourCols[col]
                if (!cellsToFocusData[instanceRow]) cellsToFocusData[instanceRow] = {}
                cellsToFocusData[instanceRow][col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            }
        }
    }
    return cellsToFocusData
}

// TODO: simplify the flow from here
export const getHiddenSingleTechniqueInfo = (cell, type, mainNumbers) => {
    let cellsToFocusData =
        type === HIDDEN_SINGLE_TYPES.BLOCK
            ? getHiddenSingleInBlockData(cell, mainNumbers)
            : getHiddenSingleInRowOrColData(cell, type, mainNumbers)

    return {
        cellsToFocusData,
        techniqueInfo: {
            title: SMART_HINTS_TECHNIQUES.HIDDEN_SINGLE.TITLE,
            logic: getHiddenSingleLogic(type, mainNumbers[cell.row][cell.col].solutionValue),
        },
        selectCellOnClose: cell,
    }
}
// hidden singles ends here

// write this in JS and if performance is not good then shift to native side
const getSmartHint = async (originalMainNumbers, notesData) => {
    // why are we copying it ?? is it getting modified somewhere ??
    // TODO: write a test case for it, so that it doesn't modifiy the inputs at all

    // const nakedSinglesData = getAllNakedSingles(originalMainNumbers, notesData)
    // if (nakedSinglesData.length) {
    //     return nakedSinglesData.map(({ cell, type }) => {
    //         return getNakedSingleTechniqueToFocus(type, originalMainNumbers, cell)
    //     })
    // }

    const hiddenSinglesData = getAllHiddenSingles(originalMainNumbers, notesData)
    if (hiddenSinglesData.length) {
        return hiddenSinglesData.map(({ cell, type }) => {
            return getHiddenSingleTechniqueInfo(cell, type, originalMainNumbers)
        })
    }

    const possibleGroupCandidatesCount = [2, 3]
    for (let i = 0; i < possibleGroupCandidatesCount.length; i++) {
        const groupCandidatesCount = possibleGroupCandidatesCount[i]
        const { present: nakedGroupFound, returnData } = highlightNakedDoublesOrTriples(
            groupCandidatesCount,
            notesData,
            originalMainNumbers,
        )
        if (nakedGroupFound) {
            consoleLog('@@@@@ naked multiple hint data', returnData)
            return returnData
        }
    }

    return null
}

export { getSmartHint }
