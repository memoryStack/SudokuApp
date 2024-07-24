import { blockCellToBoardCell, getBlockAndBoxNum } from '../cellsTransformers'

describe('blockCellToBoardCell()', () => {
    test('returns cell row and col upon passing block number and box number in the block', () => {
        expect(blockCellToBoardCell({ blockNum: 0, boxNum: 7 })).toStrictEqual({ row: 2, col: 1 })
        expect(blockCellToBoardCell({ blockNum: 4, boxNum: 1 })).toStrictEqual({ row: 3, col: 4 })
        expect(blockCellToBoardCell({ blockNum: 8, boxNum: 8 })).toStrictEqual({ row: 8, col: 8 })
    })
})

describe('getBlockAndBoxNum()', () => {
    test('returns cell block and box number upon passing cell row and col numbers', () => {
        expect(getBlockAndBoxNum({ row: 2, col: 7 })).toStrictEqual({ blockNum: 2, boxNum: 7 })
        expect(getBlockAndBoxNum({ row: 4, col: 4 })).toStrictEqual({ blockNum: 4, boxNum: 4 })
        expect(getBlockAndBoxNum({ row: 4, col: 6 })).toStrictEqual({ blockNum: 5, boxNum: 3 })
    })
})
