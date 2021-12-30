import { getRowAndCol, getBlockAndBoxNum } from '../util'

// tests for converting block's cell to board's cell i.e get row, col from blockNum and boxNum
test('getRowAndCol test 1', () => {
    const output = { row: 2, col: 1 }
    expect(getRowAndCol(0, 7)).toStrictEqual(output)
})

test('getRowAndCol test 2', () => {
    const output = { row: 3, col: 4 }
    expect(getRowAndCol(4, 1)).toStrictEqual(output)
})

test('getRowAndCol test 3', () => {
    const output = { row: 8, col: 8 }
    expect(getRowAndCol(8, 8)).toStrictEqual(output)
})

// tests for converting board's cell to block's cell i.e get blockNum and boxNum from row, col
test('getBlockAndBoxNum test 1', () => {
    const cell = { row: 2, col: 7 }
    const output = { blockNum: 2, boxNum: 7 }
    expect(getBlockAndBoxNum(2, 7, cell)).toStrictEqual(output)
})

test('getBlockAndBoxNum test 2', () => {
    const cell = { row: 4, col: 4 }
    const output = { blockNum: 4, boxNum: 4 }
    expect(getBlockAndBoxNum(4, 4, cell)).toStrictEqual(output)
})

test('getBlockAndBoxNum test 3', () => {
    const cell = { row: 4, col: 6 }
    const output = { blockNum: 5, boxNum: 3 }
    expect(getBlockAndBoxNum(4, 6, cell)).toStrictEqual(output)
})
