import { HOUSES_COUNT } from '../constants'

const blockCellToBoardCell = (blockNum, boxNum) => {
    const addToRow = (boxNum - (boxNum % 3)) / 3
    const row = blockNum - (blockNum % 3) + addToRow
    const col = (blockNum % 3) * 3 + (boxNum % 3)
    return { row, col }
}

export const getRowAndCol = (blockNum, boxNum) => blockCellToBoardCell(blockNum, boxNum)

const boardCellToBlockCell = cell => {
    const { row, col } = cell
    const blockNum = row - (row % 3) + (col - (col % 3)) / 3
    const boxNum = (row % 3) * 3 + (col % 3)
    return { blockNum, boxNum }
}

export const getBlockAndBoxNum = cell => boardCellToBlockCell(cell)

const boardCellToCellNum = ({ row, col }) => row * HOUSES_COUNT + col

export const convertBoardCellToNum = cell => boardCellToCellNum(cell)

const cellNumToBoardCell = cellNum => ({
    row: Math.floor(cellNum / HOUSES_COUNT),
    col: cellNum % HOUSES_COUNT,
})

export const convertBoardCellNumToCell = cellNum => cellNumToBoardCell(cellNum)
