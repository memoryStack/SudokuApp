import { HOUSES_COUNT_OF_A_TYPE } from "../board.constants"

const blockCellToBoardCell = ({ blockNum, boxNum }: BlockCell) => {
    const addToRow = (boxNum - (boxNum % 3)) / 3
    const row = blockNum - (blockNum % 3) + addToRow
    const col = (blockNum % 3) * 3 + (boxNum % 3)
    return { row, col }
}

const boardCellToBlockCell = (cell: Cell) => {
    const { row, col } = cell
    const blockNum = row - (row % 3) + (col - (col % 3)) / 3
    const boxNum = (row % 3) * 3 + (col % 3)
    return { blockNum, boxNum }
}

const getBlockAndBoxNum = (cell: Cell) => boardCellToBlockCell(cell)

const boardCellToCellNum = ({ row, col }: Cell) => row * HOUSES_COUNT_OF_A_TYPE + col

const convertBoardCellToNum = (cell: Cell) => boardCellToCellNum(cell)

const cellNumToBoardCell = (cellNum: number): Cell => ({
    row: Math.floor(cellNum / HOUSES_COUNT_OF_A_TYPE),
    col: cellNum % HOUSES_COUNT_OF_A_TYPE,
})

const convertBoardCellNumToCell = (cellNum: number): Cell => cellNumToBoardCell(cellNum)

export {
    blockCellToBoardCell,
    getBlockAndBoxNum,
    convertBoardCellToNum,
    convertBoardCellNumToCell
}
