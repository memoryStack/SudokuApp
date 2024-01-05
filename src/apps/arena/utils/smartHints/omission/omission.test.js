import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import {
    getOmissionRawHints,
    getHouseOmissions,
    analyzeOmissionInHouse,
    areValidOmissionHostCells,
    removesNotes as omissionRemovesNotes,
} from './omission'
import { HOUSE_TYPE } from '../constants'

test('all omissions', () => {
    const puzzle = '400005608370806490008402370940257006200000900086900000000009060039001020800720500'
    const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

    const expectedOmissions = [
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 2 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 8 },
            note: 5,
            hostCells: [
                { row: 1, col: 8 },
                { row: 2, col: 8 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 4 },
            removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 4 },
            note: 8,
            hostCells: [
                { row: 4, col: 4 },
                { row: 4, col: 5 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 7 },
            removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 7 },
            note: 6,
            hostCells: [
                { row: 7, col: 3 },
                { row: 7, col: 4 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 7 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 4 },
            note: 8,
            hostCells: [
                { row: 6, col: 4 },
                { row: 7, col: 4 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 8 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 6 },
            note: 8,
            hostCells: [
                { row: 6, col: 6 },
                { row: 7, col: 6 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.ROW, num: 0 },
            removableNotesHostHouse: { type: HOUSE_TYPE.BLOCK, num: 0 },
            note: 2,
            hostCells: [
                { row: 0, col: 1 },
                { row: 0, col: 2 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.ROW, num: 3 },
            removableNotesHostHouse: { type: HOUSE_TYPE.BLOCK, num: 5 },
            note: 8,
            hostCells: [
                { row: 3, col: 6 },
                { row: 3, col: 7 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.COL, num: 7 },
            removableNotesHostHouse: { type: HOUSE_TYPE.BLOCK, num: 5 },
            note: 5,
            hostCells: [
                { row: 4, col: 7 },
                { row: 5, col: 7 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.COL, num: 7 },
            removableNotesHostHouse: { type: HOUSE_TYPE.BLOCK, num: 5 },
            note: 8,
            hostCells: [
                { row: 3, col: 7 },
                { row: 4, col: 7 },
            ],
        },
    ]

    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getOmissionRawHints(mainNumbers, notes, possibleNotes, maxHintsThreshold)).toStrictEqual(expectedOmissions)
})

test('all Row 1 omissions', () => {
    const puzzle = '400005608370806490008402370940257006200000900086900000000009060039001020800720500'
    const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

    const singles = {
        nakedSingles: { 7: 1, 13: 1 },
        hiddenSingles: {
            4: 7, 17: 2, 41: 8, 51: 2, 73: 6, 80: 9,
        },
    }

    const house = { type: HOUSE_TYPE.ROW, num: 0 }
    const expectedOmissions = [
        {
            hostHouse: house,
            removableNotesHostHouse: { type: HOUSE_TYPE.BLOCK, num: 0 },
            note: 2,
            hostCells: [
                { row: 0, col: 1 },
                { row: 0, col: 2 },
            ],
        },
        {
            hostHouse: house,
            removableNotesHostHouse: { type: HOUSE_TYPE.BLOCK, num: 1 },
            note: 3,
            hostCells: [
                { row: 0, col: 3 },
                { row: 0, col: 4 },
            ],
        },
    ]

    expect(getHouseOmissions({ type: HOUSE_TYPE.ROW, num: 0 }, mainNumbers, notes, possibleNotes, singles)).toStrictEqual(expectedOmissions)
})

test('all Block 2 omissions', () => {
    const puzzle = '400005608370806490008402370940257006200000900086900000000009060039001020800720500'
    const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

    const house = { type: HOUSE_TYPE.BLOCK, num: 2 }
    const expectedOmissions = [
        {
            hostHouse: house,
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 8 },
            note: 5,
            hostCells: [
                { row: 1, col: 8 },
                { row: 2, col: 8 },
            ],
        },
    ]

    expect(getHouseOmissions(house, mainNumbers, notes, possibleNotes)).toStrictEqual(expectedOmissions)
})

test('does a note form omission in house', () => {
    const puzzle = '400005608370806490008402370940257006200000900086900000000009060039001020800720500'
    const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)
    const singles = {
        nakedSingles: { 7: 1, 13: 1 },
        hiddenSingles: {
            4: 7, 17: 2, 41: 8, 51: 2, 73: 6, 80: 9,
        },
    }

    const expectedResultOne = {
        present: true,
        hostCells: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
        ],
    }

    expect(analyzeOmissionInHouse(2, { type: HOUSE_TYPE.ROW, num: 0 }, mainNumbers, notes, possibleNotes, singles)).toStrictEqual(expectedResultOne)

    const expectedResultTwo = {
        present: false,
        hostCells: [
            { row: 0, col: 1 },
            { row: 0, col: 4 },
        ],
    }

    expect(analyzeOmissionInHouse(9, { type: HOUSE_TYPE.ROW, num: 0 }, mainNumbers, notes, possibleNotes, singles)).toStrictEqual(expectedResultTwo)

    const expectedResultThree = {
        present: true,
        hostCells: [
            { row: 1, col: 8 },
            { row: 2, col: 8 },
        ],
    }

    expect(analyzeOmissionInHouse(5, { type: HOUSE_TYPE.BLOCK, num: 2 }, mainNumbers, notes, possibleNotes, singles)).toStrictEqual(expectedResultThree)

    const expectedResultFour = {
        present: true,
        hostCells: [
            { row: 3, col: 7 },
            { row: 4, col: 7 },
        ],
    }

    expect(analyzeOmissionInHouse(8, { type: HOUSE_TYPE.COL, num: 7 }, mainNumbers, notes, possibleNotes, singles)).toStrictEqual(expectedResultFour)

    const expectedResultFive = {
        present: false,
        hostCells: [
            { row: 3, col: 6 },
            { row: 3, col: 7 },
            { row: 4, col: 7 },
        ],
    }

    expect(analyzeOmissionInHouse(8, { type: HOUSE_TYPE.BLOCK, num: 5 }, mainNumbers, notes, possibleNotes, singles)).toStrictEqual(expectedResultFive)
})

describe('areValidOmissionHostCells()', () => {
    describe('host house cells arrangements validation', () => {
        test('note host cells form valid omission', () => {
            const singles = { nakedSingles: {}, hiddenSingles: {} }
            expect(areValidOmissionHostCells(1, [], singles)).toBe(false)

            const testFour = [{ row: 0, col: 0 }]
            expect(areValidOmissionHostCells(1, testFour, singles)).toBe(false)

            const testOne = [
                { row: 0, col: 0 },
                { row: 0, col: 1 },
                { row: 0, col: 2 },
            ]
            expect(areValidOmissionHostCells(1, testOne, singles)).toBe(true)

            const testTwo = [
                { row: 0, col: 0 },
                { row: 0, col: 1 },
                { row: 2, col: 2 },
            ]
            expect(areValidOmissionHostCells(1, testTwo, singles)).toBe(false)

            const testThree = [
                { row: 0, col: 0 },
                { row: 0, col: 5 },
                { row: 0, col: 3 },
            ]
            expect(areValidOmissionHostCells(1, testThree, singles)).toBe(false)

            const testFive = [
                { row: 4, col: 4 },
                { row: 4, col: 5 },
            ]
            expect(areValidOmissionHostCells(1, testFive, singles)).toBe(true)
        })
    })

    test('returns false if cells have valid arrangement but one of host cells have singles in them', () => {
        const singles = { nakedSingles: { 1: 2 }, hiddenSingles: {} }

        const hostCells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
        ]
        expect(areValidOmissionHostCells(2, hostCells, singles)).toBe(false)
    })
})

test('omission removes notes', () => {
    const puzzle = '400005608370806490008402370940257006200000900086900000000009060039001020800720500'
    const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle)

    const testOneOmission = {
        hostHouse: { type: HOUSE_TYPE.BLOCK, num: 0 },
        removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 2 },
        note: 6,
        hostCells: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
        ],
    }
    expect(omissionRemovesNotes(testOneOmission, mainNumbers, notes)).toBe(false)

    const testTwoOmission = {
        hostHouse: { type: HOUSE_TYPE.BLOCK, num: 3 },
        removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 2 },
        note: 3,
        hostCells: [
            { row: 3, col: 2 },
            { row: 4, col: 2 },
        ],
    }
    expect(omissionRemovesNotes(testTwoOmission, mainNumbers, notes)).toBe(false)

    const testThreeOmission = {
        hostHouse: { type: HOUSE_TYPE.ROW, num: 3 },
        removableNotesHostHouse: { type: HOUSE_TYPE.BLOCK, num: 5 },
        note: 8,
        hostCells: [
            { row: 3, col: 6 },
            { row: 3, col: 7 },
        ],
    }
    expect(omissionRemovesNotes(testThreeOmission, mainNumbers, notes)).toBe(true)
})

describe('Enhancements', () => {
    test('should not return omissions with Naked single host cells', () => {
        const puzzle = '000018300510032097002090008900780020780060045020045001100050200850320074006170000'
        const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)
        const maxHintsThreshold = Number.POSITIVE_INFINITY
        const singles = {
            nakedSingles: {
                33: 6, 42: 9, 47: 3, 48: 9, 65: 9,
            },
            hiddenSingles: {
                8: 2, 11: 8, 23: 7, 25: 1, 29: 5, 39: 2, 51: 7, 57: 8, 69: 1, 72: 2,
            },
        }

        const omissionWithNakedSingleHostCell = [{
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 5 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 6 },
            note: 9,
            hostCells: [{ row: 4, col: 6 }, { row: 5, col: 6 }],
        }]

        expect(getOmissionRawHints(mainNumbers, notes, possibleNotes, singles, maxHintsThreshold)).toEqual(
            expect.not.arrayContaining(omissionWithNakedSingleHostCell),
        )
    })

    test('should not return omissions with Hidden Single host cells', () => {
        const puzzle = '400005608370806490008402370940257006250000900086900000000009060539001020800720500'
        const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)
        const maxHintsThreshold = Number.POSITIVE_INFINITY

        const singles = {
            nakedSingles: {
                7: 1, 13: 1, 66: 6,
            },
            hiddenSingles: {
                4: 7, 11: 5, 17: 2, 18: 6, 26: 5, 41: 8, 51: 2, 52: 5, 57: 5, 73: 6, 80: 9,
            },
        }

        const omissionWithHiddenSingleHostCell = [{
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 2 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 8 },
            note: 5,
            hostCells: [
                { row: 1, col: 8 },
                { row: 2, col: 8 },
            ],
        }]

        expect(getOmissionRawHints(mainNumbers, notes, possibleNotes, singles, maxHintsThreshold)).toEqual(
            expect.not.arrayContaining(omissionWithHiddenSingleHostCell),
        )
    })
})
