import { getBlockAndBoxNum, getRowAndCol } from '../../../utils/util'
import { duplicacyPresent, areSameCells, areSameRowCells, areSameColCells, areSameBlockCells } from './util'
import { Styles as boardStyles } from '../gameBoard/style'
import { N_CHOOSE_K } from '../../../resources/constants'

const HOUSE_TYPE = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
}

const NAKED_SINGLE_TYPES = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
    MIX: 'mix',
}

const HIDDEN_SINGLE_TYPES = {
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

const checkNakedSingle = (row, col, mainNumbers) => {
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
        const { blockNum } = getBlockAndBoxNum({ row, col })
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
            // TODO: make a map here to make it faster. that way we can find the same
            // thing in 36 iterations instead of 81 iterations
            if (duplicacyPresent(num, mainNumbers, { row, col })) candidatesFilled++
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
    for (let cell = 0; cell < 9; cell++) {
        if (!cellsToFocusData[cell]) cellsToFocusData[cell] = {}
        const cellBGColor =
            cell === row ? SMART_HINTS_CELLS_BG_COLOR.SELECTED : SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT
        cellsToFocusData[cell][col] = { bgColor: cellBGColor }
    }
    return cellsToFocusData
}

const nakedSingleBlockDataToHighlight = (selectedRow, selectedCol, cellsToFocusData = {}) => {
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

    return [
        {
            cellsToFocusData,
            techniqueInfo: {
                title: SMART_HINTS_TECHNIQUES.NAKED_SINGLE.TITLE,
                logic,
            },
        },
    ]
}
// naked single ends here

// hidden singles starts here
const getHiddenSingleLogic = (type, value) => {
    return `in the highlighted ${type}, ${value} can't appear in crossed cells due to the highlighted instances of same number. So it has only one place where it can come`
}

const getCurrentCellNotes = (mainNumbers, cell) => {
    const { row, col } = cell
    const possibleCandiates = []
    const numbersAlreadyInHouses = {}
    for (let row = 0; row < 9; row++) {
        const filledValue = mainNumbers[row][col].value
        if (filledValue) numbersAlreadyInHouses[filledValue] = true
    }
    for (let col = 0; col < 9; col++) {
        const filledValue = mainNumbers[row][col].value
        if (filledValue) numbersAlreadyInHouses[filledValue] = true
    }
    const { blockNum } = getBlockAndBoxNum(cell)
    for (let cellNo = 0; cellNo < 9; cellNo++) {
        const { row, col } = getRowAndCol(blockNum, cellNo)
        const filledValue = mainNumbers[row][col].value
        if (filledValue) numbersAlreadyInHouses[filledValue] = true
    }
    for (let num = 1; num <= 9; num++) {
        if (!numbersAlreadyInHouses[num]) possibleCandiates.push(num)
    }
    return possibleCandiates
}

const checkHiddenSingle = (row, col, mainNumbers) => {
    const cell = { row, col }
    const possibleCandiates = getCurrentCellNotes(mainNumbers, cell)
    let singleType = ''

    for (let i = 0; i < possibleCandiates.length; i++) {
        const candidate = possibleCandiates[i]
        // first check in block
        let possibleOccurencesInHouse = 0
        const { blockNum } = getBlockAndBoxNum(cell)
        for (let cellNo = 0; cellNo < 9; cellNo++) {
            const { row, col } = getRowAndCol(blockNum, cellNo)
            const isEmptyCell = mainNumbers[row][col].value === 0
            if (isEmptyCell && !duplicacyPresent(candidate, mainNumbers, { row, col })) {
                possibleOccurencesInHouse++
            }
        }
        if (possibleOccurencesInHouse === 1) {
            singleType = HIDDEN_SINGLE_TYPES.BLOCK
            break
        }

        // check in col (more natural as per my experiance. would like to switch it as well just as a experience)
        possibleOccurencesInHouse = 0
        for (let row = 0; row < 9; row++) {
            const isEmptyCell = mainNumbers[row][col].value === 0
            if (isEmptyCell && !duplicacyPresent(candidate, mainNumbers, { row, col })) {
                possibleOccurencesInHouse++
            }
        }
        if (possibleOccurencesInHouse === 1) {
            singleType = HIDDEN_SINGLE_TYPES.COL
            break
        }

        // check in row
        possibleOccurencesInHouse = 0
        for (let col = 0; col < 9; col++) {
            const isEmptyCell = mainNumbers[row][col].value === 0
            if (isEmptyCell && !duplicacyPresent(candidate, mainNumbers, { row, col })) {
                possibleOccurencesInHouse++
            }
        }
        if (possibleOccurencesInHouse === 1) {
            singleType = HIDDEN_SINGLE_TYPES.ROW
            break
        }
    }

    return {
        present: singleType !== '',
        type: singleType,
    }
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
    const currentBlockStartColumn = (blockNum % 3) * 3
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
    const currentBlockStartRow = Math.floor(blockNum / 3) * 3
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

const highlightBlockCells = ({ selectedRow, selectedCol, blockNum, mainNumbers, cellsToFocusData, singleType }) => {
    const winnerCandidate = mainNumbers[selectedRow][selectedCol].solutionValue
    const candidateCordinatesInBlock = getCandidateInstanceCoordinatesInBlock(winnerCandidate, blockNum, mainNumbers)
    if (candidateCordinatesInBlock) {
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
const getHiddenSingleInRowOrColData = (selectedRow, selectedCol, type, mainNumbers) => {
    const cellsToFocusData = {}
    if (!cellsToFocusData[selectedRow]) cellsToFocusData[selectedRow] = {}
    cellsToFocusData[selectedRow][selectedCol] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.SELECTED }

    const selectedCell = {
        row: selectedRow,
        col: selectedCol,
    }
    const { blockNum: currentBlockNum } = getBlockAndBoxNum(selectedCell)
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

const getHiddenSingleInBlockData = (selectedRow, selectedCol, mainNumbers) => {
    // highlight all the cells of the current block
    const selectedCell = {
        row: selectedRow,
        col: selectedCol,
    }
    const { blockNum } = getBlockAndBoxNum(selectedCell)
    const winnerCandidate = mainNumbers[selectedRow][selectedCol].solutionValue
    const neighbourRows = {}
    const neighbourCols = {}
    const startRow = blockNum - (blockNum % 3)
    const startCol = (blockNum % 3) * 3
    for (let i = 0; i < 3; i++) {
        const row = startRow + i
        if (row !== selectedRow) {
            let winnerInstancePresent = false
            let emptyCellsCountInCurrentBlock = 0
            let winnerInstanceColumn
            for (let col = 0; col < 9; col++) {
                const filledValue = mainNumbers[row][col].value
                if (filledValue === winnerCandidate) {
                    winnerInstancePresent = true
                    winnerInstanceColumn = col
                }
                if (!filledValue && col >= startCol && col < startCol + 3) {
                    emptyCellsCountInCurrentBlock++
                }
            }
            if (winnerInstancePresent && emptyCellsCountInCurrentBlock) {
                neighbourRows[row] = {
                    emptyCellsCount: emptyCellsCountInCurrentBlock,
                    col: winnerInstanceColumn,
                }
            }
        }
        const col = startCol + i
        if (col !== selectedCol) {
            let winnerInstancePresent = false
            let emptyCellsCountInCurrentBlock = 0
            let winnerInstanceRow
            for (let row = 0; row < 9; row++) {
                const filledValue = mainNumbers[row][col].value
                if (filledValue === winnerCandidate) {
                    winnerInstancePresent = true
                    winnerInstanceRow = row
                }
                if (!filledValue && row >= startRow && row < startRow + 3) {
                    emptyCellsCountInCurrentBlock++
                }
            }
            if (winnerInstancePresent && emptyCellsCountInCurrentBlock) {
                neighbourCols[col] = {
                    emptyCellsCount: emptyCellsCountInCurrentBlock,
                    row: winnerInstanceRow,
                }
            }
        }
    }

    const mustHighlightWinnerInstances = { row: {}, col: {} } // will store which instances will be must highlighted
    const cellsToFocusData = {}
    Object.keys(neighbourRows).forEach(rowKey => {
        const rowInt = parseInt(rowKey, 10)
        if (!mainNumbers[rowInt][selectedCol].value) {
            const { col: instanceColumn } = neighbourRows[rowKey]
            if (!cellsToFocusData[rowInt]) cellsToFocusData[rowInt] = {}
            cellsToFocusData[rowInt][instanceColumn] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            mustHighlightWinnerInstances.row[rowKey] = true
        }
    })

    Object.keys(neighbourCols).forEach(colKey => {
        const colInt = parseInt(colKey, 10)
        if (!mainNumbers[selectedRow][colInt].value) {
            const { row: instanceRow } = neighbourCols[colKey]
            if (!cellsToFocusData[instanceRow]) cellsToFocusData[instanceRow] = {}
            cellsToFocusData[instanceRow][colInt] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            mustHighlightWinnerInstances.col[colKey] = true
        }
    })

    for (let cellNo = 0; cellNo < 9; cellNo++) {
        const { row, col } = getRowAndCol(blockNum, cellNo)
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        if (mainNumbers[row][col].value) {
            cellsToFocusData[row][col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }
            continue
        }
        if (row === selectedRow && col === selectedCol) {
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

const getHiddenSingleTechniqueInfo = (row, col, type, mainNumbers) => {
    let cellsToFocusData = null
    switch (type) {
        case HIDDEN_SINGLE_TYPES.ROW:
            cellsToFocusData = getHiddenSingleInRowOrColData(row, col, HIDDEN_SINGLE_TYPES.ROW, mainNumbers)
            break
        case HIDDEN_SINGLE_TYPES.COL:
            cellsToFocusData = getHiddenSingleInRowOrColData(row, col, HIDDEN_SINGLE_TYPES.COL, mainNumbers)
            break
        case HIDDEN_SINGLE_TYPES.BLOCK:
            cellsToFocusData = getHiddenSingleInBlockData(row, col, mainNumbers)
            break
    }

    return [
        {
            cellsToFocusData,
            techniqueInfo: {
                title: SMART_HINTS_TECHNIQUES.HIDDEN_SINGLE.TITLE,
                logic: getHiddenSingleLogic(type, mainNumbers[row][col].solutionValue),
            },
        },
    ]
}
// hidden singles ends here

// TODO: this file is getting huge, break it

// naked doubles or triples starts here
const prepareNakedDublesOrTriplesHintData = (
    noOfInstances,
    toBeHighlightedCells,
    groupCells,
    groupCandidates,
    notesData,
) => {
    const isNakedDoubles = noOfInstances === 2
    const cellsToFocusData = {}

    const isGroupHostCell = cell => groupCells.some(groupCell => areSameCells(groupCell, cell))

    toBeHighlightedCells.forEach(({ row, col }) => {
        if (!cellsToFocusData[row]) cellsToFocusData[row] = {}
        cellsToFocusData[row][col] = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }

        const notesToHighlightData = {}
        let notesWillBeHighlighted = false
        groupCandidates.forEach(groupCandidate => {
            const groupCandidateNum = parseInt(groupCandidate, 10)
            if (notesData[row][col][groupCandidateNum - 1].show) {
                if (isGroupHostCell({ row, col })) {
                    notesToHighlightData[groupCandidate] = { fontColor: 'green' }
                } else {
                    notesToHighlightData[groupCandidate] = { fontColor: 'red' }
                }
                notesWillBeHighlighted = true
            }
        })
        if (notesWillBeHighlighted) cellsToFocusData[row][col].notesToHighlightData = notesToHighlightData
    })

    const groupCellsCountEnglishText = isNakedDoubles ? 'two' : 'three'
    const getGroupCandidatesListText = () => {
        return isNakedDoubles
            ? `${groupCandidates[0]} and ${groupCandidates[1]}`
            : `${groupCandidates[0]}, ${groupCandidates[1]} and ${groupCandidates[2]}`
    }

    const getCellsHostingText = () => {
        const groupCandidatesText = isNakedDoubles
            ? `${groupCandidates[0]}, and another one ${groupCandidates[1]}`
            : `${groupCandidates[0]}, another ${groupCandidates[1]}, and the last ${groupCandidates[2]}`

        return `So one of the squares has to be ${groupCandidatesText} (which is which is yet unknown).`
    }

    // TODO: this msg needs to be simplified for tripple case [{1,2}, {1,2,3}, {2, 3}]
    // this case doesn't fit exactly in the below explaination
    const hintMessage = () =>
        `In the highlighted region, ${groupCellsCountEnglishText} cells have exactly same candidates ${getGroupCandidatesListText()} highlighted in green color. ${getCellsHostingText()} So ${getGroupCandidatesListText()} highlighted in red color can't appear there and we can erase these instances from these cells`

    return {
        cellsToFocusData,
        techniqueInfo: {
            title: isNakedDoubles ? 'Naked Double' : 'Naked Tripple',
            logic: hintMessage(),
        },
    }
}

// TODO: there can be multiple doubles and triples in the highlighted region
//         how to tackle those cases so that user get most benefit ??

const getVisibileNotesCount = ({ row, col }, notesData) => {
    let result = 0
    for (let note = 1; note <= 9; note++) {
        if (notesData[row][col][note - 1].show) result++
    }
    return result
}

// this func is used for a very special case in below func
const getHouseCellsNum = (cells, houseType) => {
    let result = []
    if (houseType === 'row' || houseType === 'col') {
        const cellNumKey = houseType === 'row' ? 'col' : 'row'
        result = cells.map(cell => cell[cellNumKey])
    }
    result = cells.map(cell => {
        const { boxNum } = getBlockAndBoxNum(cell)
        return boxNum
    })
    // the result will container numbers [0...9] so normal sort works
    return result.sort()
}

// TODO: think over the namings harder. i see a lot of in-consistencies
const highlightNakedDoublesOrTriples = (noOfInstances, notesData, sudokuBoard) => {
    const houseType = ['block', 'row', 'col']

    const groupsFoundInHouses = {
        row: {},
        col: {},
        block: {},
    }

    const hints = []
    for (let j = 0; j < houseType.length; j++) {
        for (let i = 0; i < 9; i++) {
            const houseNum = {
                row: i,
                col: i,
                block: i,
            }

            const houseAllBoxes = [] // all the house boxes
            const validBoxes = [] // all  the boxes with favorable number of instances in them
            for (let box = 0; box < 9; box++) {
                let row
                let col
                if (houseType[j] === 'row') {
                    row = houseNum.row
                    col = box
                }
                if (houseType[j] === 'col') {
                    row = box
                    col = houseNum.col
                }
                if (houseType[j] === 'block') {
                    const obj = getRowAndCol(houseNum.block, box)
                    row = obj.row
                    col = obj.col
                }
                houseAllBoxes.push({ row, col })

                if (sudokuBoard[row][col].value) continue

                // i guess we can store info for notes here only and then use that down below. What is this ??
                const boxVisibleNotesCount = getVisibileNotesCount({ row, col }, notesData)
                const MINIMUM_INSTANCES_IN_MULTIPLE_THRESHOLD = 2
                if (
                    boxVisibleNotesCount >= MINIMUM_INSTANCES_IN_MULTIPLE_THRESHOLD &&
                    boxVisibleNotesCount <= noOfInstances
                )
                    validBoxes.push({ row, col })
            }

            const validBoxesCount = validBoxes.length
            // TODO: check the below threshold for naked multiple cases.
            const VALID_BOXES_COUNT_THRESHOLD_TO_SEARCH = 6 // to avoid computing 7C2 and 7C3, because that might be heavy
            if (validBoxesCount > VALID_BOXES_COUNT_THRESHOLD_TO_SEARCH || validBoxesCount < noOfInstances) continue
            const possibleSelections = N_CHOOSE_K[validBoxesCount][noOfInstances]

            for (let k = 0; k < possibleSelections.length; k++) {
                const selectedBoxes = []
                for (let x = 0; x < possibleSelections[k].length; x++) {
                    const selectedIndex = possibleSelections[k][x]
                    const box = validBoxes[selectedIndex]
                    selectedBoxes.push(box)
                }

                // check these boxes if they are covered or not already
                if (houseType[j] === 'row' || houseType[j] === 'col') {
                    // TODO: let's wrap this condition into a func
                    const selectedCellsNum = getHouseCellsNum(selectedBoxes, houseType[j])
                    const houseCellsProcessed = groupsFoundInHouses[houseType[j]][`${i}`] || []
                    let cellsProcessedAlready = houseCellsProcessed.length === selectedCellsNum.length
                    // run loop and check one by one
                    for (let idx = 0; idx < selectedCellsNum.length && cellsProcessedAlready; idx++)
                        cellsProcessedAlready = houseCellsProcessed[idx] === selectedCellsNum[idx]
                    if (cellsProcessedAlready) continue
                }

                const eachVisibleNotesInfo = {} // will store the visible notes info from all the selected boxes
                for (let x = 0; x < selectedBoxes.length; x++) {
                    const { row, col } = selectedBoxes[x]
                    for (let note = 1; note <= 9; note++) {
                        if (notesData[row][col][note - 1].show) {
                            if (!eachVisibleNotesInfo[note]) eachVisibleNotesInfo[note] = 1
                            else eachVisibleNotesInfo[note]++
                        }
                    }
                }

                const groupCandidates = Object.keys(eachVisibleNotesInfo)
                let shouldAbort = groupCandidates.length !== noOfInstances
                for (let x = 0; x < groupCandidates.length; x++) {
                    const count = eachVisibleNotesInfo[groupCandidates[x]]
                    if (!(count >= 2 && count <= noOfInstances)) {
                        // TODO: this needs to be checked again
                        shouldAbort = true
                        break
                    }
                }

                if (shouldAbort) continue // analyze some other combination of cells

                // if house is row or col
                if ((houseType[j] === 'row' || houseType[j] === 'col') && areSameBlockCells(selectedBoxes)) {
                    const { blockNum } = getBlockAndBoxNum(selectedBoxes[0])
                    for (let boxNum = 0; boxNum < 9; boxNum++) {
                        const { row, col } = getRowAndCol(blockNum, boxNum)
                        if (
                            (houseType[j] === 'row' && row !== houseNum[houseType[j]]) ||
                            (houseType[j] === 'col' && col !== houseNum[houseType[j]])
                        )
                            houseAllBoxes.push({ row, col })
                    }
                } else {
                    if (areSameRowCells(selectedBoxes)) {
                        const { row } = selectedBoxes[0]
                        for (let col = 0; col < 9; col++) {
                            const { blockNum } = getBlockAndBoxNum({ row, col })
                            if (houseNum[houseType[j]] !== blockNum) houseAllBoxes.push({ row, col })
                        }
                    } else if (areSameColCells(selectedBoxes)) {
                        const { col } = selectedBoxes[0]
                        for (let row = 0; row < 9; row++) {
                            const { blockNum } = getBlockAndBoxNum({ row, col })
                            if (houseNum[houseType[j]] !== blockNum) houseAllBoxes.push({ row, col })
                        }
                    }
                }

                const groupWillRemoveCandidates = houseAllBoxes.some(cell => {
                    const isSelectedCell = selectedBoxes.some(selectedCell => {
                        return areSameCells(cell, selectedCell)
                    })
                    return (
                        !isSelectedCell &&
                        groupCandidates.some(groupCandidate => {
                            const groupCandidateNum = parseInt(groupCandidate, 10)
                            return notesData[cell.row][cell.col][groupCandidateNum - 1].show
                        })
                    )
                })

                if (!groupWillRemoveCandidates) continue

                // Note: the correctness of this DS depends on entries order in "houseType"
                groupsFoundInHouses[houseType[j]][`${i}`] = getHouseCellsNum(selectedBoxes, houseType[j])
                if (houseAllBoxes.length === 15) {
                    // group cells belong to 2 houses, one is block for sure and another one can be either row or col
                    if (areSameRowCells(selectedBoxes)) {
                        const { row } = selectedBoxes[0]
                        groupsFoundInHouses['row'][`${row}`] = getHouseCellsNum(selectedBoxes, 'row')
                    } else {
                        const { col } = selectedBoxes[0]
                        groupsFoundInHouses['col'][`${col}`] = getHouseCellsNum(selectedBoxes, 'col')
                    }
                }

                __DEV__ && console.log('@@@@ naked double', houseAllBoxes, selectedBoxes, groupCandidates)
                const getHintData = prepareNakedDublesOrTriplesHintData(
                    noOfInstances,
                    houseAllBoxes,
                    selectedBoxes,
                    groupCandidates,
                    notesData,
                )

                hints.push(getHintData)
            }
        }
    }

    return {
        present: hints.length > 0,
        returnData: hints,
    }
}

// naked doubles or triples ends here

// write this in JS and if performance is not good then shift to native side
const getSmartHint = async ({ row, col }, originalMainNumbers, notesData) => {
    // why are we copying it ?? is it getting modified somewhere ??
    // TODO: write a test case for it, so that it doesn't modifiy the inputs at all
    const boardMainNumbersCopy = copyBoardMainNumbers(originalMainNumbers)

    const cellFilled = !!originalMainNumbers[row][col].value

    // we don't need this DS to know if aked single is present or not in this cell
    // const nakedSinglesNotesInfo = getCellsNotesInfo(boardMainNumbersCopy)

    if (!cellFilled) {
        const { present: nakedSinglePresent, type: nakedSingleType } = checkNakedSingle(row, col, boardMainNumbersCopy)
        if (nakedSinglePresent) {
            return getNakedSingleTechniqueToFocus(row, col, nakedSingleType, originalMainNumbers)
        }
        const { present: hiddenSinglePresent, type: hiddenSingleType } = checkHiddenSingle(
            row,
            col,
            boardMainNumbersCopy,
        )
        if (hiddenSinglePresent) {
            return getHiddenSingleTechniqueInfo(row, col, hiddenSingleType, boardMainNumbersCopy)
        }
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
            __DEV__ && console.log('@@@@@ naked multiple hint data', returnData)
            return returnData
        }
    }

    return null
}

export { getSmartHint }
