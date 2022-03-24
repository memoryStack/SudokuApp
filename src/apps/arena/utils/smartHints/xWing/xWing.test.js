// how to name the file so that xWing prefix doesn't need to be there ??

import { areXWingCells, getAllXWings, getCrossHouseType } from '.'
import { HOUSE_TYPE } from '../constants'

test('perfect xWing', () => {
    const { mainNumbers, notesData } = require('./testData')

    const expectedXWings = [
        {
            cells: [
                [
                    { row: 0, col: 1 },
                    { row: 7, col: 1 },
                ],
                [
                    { row: 0, col: 6 },
                    { row: 7, col: 6 },
                ],
            ],
            candidate: 8,
            type: HOUSE_TYPE.COL,
        },
        {
            cells: [
                [
                    { row: 1, col: 2 },
                    { row: 1, col: 7 },
                ],
                [
                    { row: 8, col: 2 },
                    { row: 8, col: 7 },
                ],
            ],
            candidate: 8,
            type: HOUSE_TYPE.ROW,
        },
    ]
    expect(getAllXWings(mainNumbers, notesData)).toStrictEqual(expectedXWings)
})

test('xWing getCrossHouseType', () => {
    expect(getCrossHouseType(HOUSE_TYPE.COL)).toEqual(HOUSE_TYPE.ROW)
    expect(getCrossHouseType(HOUSE_TYPE.ROW)).toEqual(HOUSE_TYPE.COL)
})

describe('xWing areXWingCells', () => {
    test('test 1', () => {
        const firstHouseCells = [
            { row: 0, col: 0 },
            { row: 0, col: 8 },
        ]
        const secondHouseCells = [
            { row: 8, col: 0 },
            { row: 8, col: 8 },
        ]
        expect(areXWingCells(firstHouseCells, secondHouseCells)).toEqual(true)
    })

    test('test 2', () => {
        const firstHouseCells = [
            { row: 1, col: 3 },
            { row: 4, col: 3 },
        ]
        const secondHouseCells = [
            { row: 1, col: 5 },
            { row: 4, col: 5 },
        ]
        expect(areXWingCells(firstHouseCells, secondHouseCells)).toEqual(true)
    })

    test('test 3', () => {
        const firstHouseCells = [
            { row: 4, col: 4 },
            { row: 2, col: 4 },
        ]
        const secondHouseCells = [
            { row: 4, col: 7 },
            { row: 7, col: 7 },
        ]
        expect(areXWingCells(firstHouseCells, secondHouseCells)).toEqual(false)
    })

    test('test 4', () => {
        const firstHouseCells = [
            { row: 4, col: 1 },
            { row: 4, col: 4 },
        ]
        const secondHouseCells = [
            { row: 7, col: 1 },
            { row: 7, col: 3 },
        ]
        expect(areXWingCells(firstHouseCells, secondHouseCells)).toEqual(false)
    })
})
