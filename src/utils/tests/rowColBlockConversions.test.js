import { getBlockAndBoxNum } from '../util'

// tests for converting board's cell to block's cell i.e get blockNum and boxNum from row, col
test('getBlockAndBoxNum test 1', () => {
    const cell = { row: 2, col: 7 }
    const output = { blockNum: 2, boxNum: 7 }
    expect(getBlockAndBoxNum(cell)).toStrictEqual(output)
})

test('getBlockAndBoxNum test 2', () => {
    const cell = { row: 4, col: 4 }
    const output = { blockNum: 4, boxNum: 4 }
    expect(getBlockAndBoxNum(cell)).toStrictEqual(output)
})

test('getBlockAndBoxNum test 3', () => {
    const cell = { row: 4, col: 6 }
    const output = { blockNum: 5, boxNum: 3 }
    expect(getBlockAndBoxNum(cell)).toStrictEqual(output)
})
