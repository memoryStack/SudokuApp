const { HOUSE_TYPE } = require('../constants')
const { mainNumbers, notes, possibleNotes } = require('./testData')
const {
    getCandidateAllStrongLinks,
    getNoteHostCellsInHouse,
    getAllStrongLinks,
    getNoteWeakLinks,
} = require('./xChain')

describe('getAllStrongLinks()', () => {
    test('returns all the strong links in board', () => {
        const expectedResult = {
            1: {
                [HOUSE_TYPE.ROW]: {
                    7: [{ row: 7, col: 6 }, { row: 7, col: 8 }],
                },
                [HOUSE_TYPE.BLOCK]: {
                    8: [{ row: 7, col: 6 }, { row: 7, col: 8 }],
                },
            },
            3: {
                [HOUSE_TYPE.ROW]: {
                    1: [{ row: 1, col: 3 }, { row: 1, col: 5 }],
                    6: [{ row: 6, col: 5 }, { row: 6, col: 7 }],
                    8: [{ row: 8, col: 1 }, { row: 8, col: 7 }],
                },
                [HOUSE_TYPE.COL]: {
                    1: [{ row: 7, col: 1 }, { row: 8, col: 1 }],
                    3: [{ row: 1, col: 3 }, { row: 7, col: 3 }],
                    7: [{ row: 6, col: 7 }, { row: 8, col: 7 }],
                },
                [HOUSE_TYPE.BLOCK]: {
                    1: [{ row: 1, col: 3 }, { row: 1, col: 5 }],
                    6: [{ row: 7, col: 1 }, { row: 8, col: 1 }],
                    8: [{ row: 6, col: 7 }, { row: 8, col: 7 }],
                },
            },
            4: {
                [HOUSE_TYPE.COL]: {
                    1: [{ row: 3, col: 1 }, { row: 8, col: 1 }],
                    3: [{ row: 1, col: 3 }, { row: 2, col: 3 }],
                },
                [HOUSE_TYPE.BLOCK]: {
                    1: [{ row: 1, col: 3 }, { row: 2, col: 3 }],
                    6: [{ row: 6, col: 0 }, { row: 8, col: 1 }],
                },
            },
            5: {
                [HOUSE_TYPE.ROW]: {
                    1: [{ row: 1, col: 6 }, { row: 1, col: 7 }],
                    7: [{ row: 7, col: 0 }, { row: 7, col: 5 }],
                },
                [HOUSE_TYPE.COL]: {
                    5: [{ row: 6, col: 5 }, { row: 7, col: 5 }],
                    7: [{ row: 1, col: 7 }, { row: 4, col: 7 }],
                },
                [HOUSE_TYPE.BLOCK]: {
                    2: [{ row: 1, col: 6 }, { row: 1, col: 7 }],
                    7: [{ row: 6, col: 5 }, { row: 7, col: 5 }],
                },
            },
            6: {
                [HOUSE_TYPE.ROW]: {
                    2: [{ row: 2, col: 5 }, { row: 2, col: 8 }],
                    4: [{ row: 4, col: 6 }, { row: 4, col: 8 }],
                },
                [HOUSE_TYPE.COL]: {
                    5: [{ row: 0, col: 5 }, { row: 2, col: 5 }],
                    6: [{ row: 0, col: 6 }, { row: 4, col: 6 }],
                },
                [HOUSE_TYPE.BLOCK]: {
                    1: [{ row: 0, col: 5 }, { row: 2, col: 5 }],
                    5: [{ row: 4, col: 6 }, { row: 4, col: 8 }],
                },
            },
            7: {
                [HOUSE_TYPE.ROW]: {
                    0: [{ row: 0, col: 1 }, { row: 0, col: 8 }],
                },
                [HOUSE_TYPE.COL]: {
                    2: [{ row: 3, col: 2 }, { row: 6, col: 2 }],
                    7: [{ row: 1, col: 7 }, { row: 6, col: 7 }],
                },
            },
            8: {
                [HOUSE_TYPE.ROW]: {
                    5: [{ row: 5, col: 0 }, { row: 5, col: 8 }],
                },
                [HOUSE_TYPE.COL]: {
                    1: [{ row: 1, col: 1 }, { row: 4, col: 1 }],
                },
            },
            9: {
                [HOUSE_TYPE.ROW]: {
                    8: [{ row: 8, col: 6 }, { row: 8, col: 7 }],
                },
                [HOUSE_TYPE.COL]: {
                    1: [{ row: 0, col: 1 }, { row: 4, col: 1 }],
                },
                [HOUSE_TYPE.BLOCK]: {
                    0: [{ row: 0, col: 1 }, { row: 2, col: 0 }],
                    8: [{ row: 8, col: 6 }, { row: 8, col: 7 }],
                },
            },
        }
        expect(getAllStrongLinks(notes, possibleNotes)).toEqual(expectedResult)
    })
})

// TODO: write a test case for filtering out the notes, possibleNotes difference as well
describe('getCandidateAllStrongLinks()', () => {
    test('returns all the strong links for a candidate grouped by houses, returned DS will contain each strong link house info as keys and will contain in which cells that note is present', () => {
        const expectedResult = {
            [HOUSE_TYPE.ROW]: {
                0: [{ row: 0, col: 1 }, { row: 0, col: 8 }],
            },
            [HOUSE_TYPE.COL]: {
                2: [{ row: 3, col: 2 }, { row: 6, col: 2 }],
                7: [{ row: 1, col: 7 }, { row: 6, col: 7 }],
            },
        }
        expect(getCandidateAllStrongLinks(7, notes, possibleNotes)).toEqual(expectedResult)
    })

    test('returns empty object if no strong links are found for a note in any house', () => {
        expect(getCandidateAllStrongLinks(2, notes, possibleNotes)).toEqual({})
    })
})

describe('getNoteHostCellsInHouse()', () => {
    test('returns the list of cells from a house in which a note is visible', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 0 }
        const expectedResult = [{ row: 0, col: 1 }, { row: 0, col: 8 }]
        expect(getNoteHostCellsInHouse(7, house, notes)).toEqual(expectedResult)
    })

    test('returns empty array if note is not present anywhere in house', () => {
        const house = { type: HOUSE_TYPE.BLOCK, num: 0 }
        expect(getNoteHostCellsInHouse(3, house, notes)).toEqual([])
    })
})

describe('getNoteWeakLinks()', () => {
    test('returns weak links for a note in all houses', () => {
        const expectedResult = {
            [HOUSE_TYPE.ROW]: {
                1: [[{ row: 1, col: 0 }, { row: 1, col: 1 }], [{ row: 1, col: 0 }, { row: 1, col: 6 }], [{ row: 1, col: 0 }, { row: 1, col: 8 }], [{ row: 1, col: 1 }, { row: 1, col: 6 }], [{ row: 1, col: 1 }, { row: 1, col: 8 }], [{ row: 1, col: 6 }, { row: 1, col: 8 }]],
                2: [[{ row: 2, col: 0 }, { row: 2, col: 2 }], [{ row: 2, col: 0 }, { row: 2, col: 8 }], [{ row: 2, col: 2 }, { row: 2, col: 8 }]],
                4: [[{ row: 4, col: 0 }, { row: 4, col: 1 }], [{ row: 4, col: 0 }, { row: 4, col: 2 }], [{ row: 4, col: 1 }, { row: 4, col: 2 }]],
                6: [[{ row: 6, col: 0 }, { row: 6, col: 2 }], [{ row: 6, col: 0 }, { row: 6, col: 6 }], [{ row: 6, col: 0 }, { row: 6, col: 8 }], [{ row: 6, col: 2 }, { row: 6, col: 6 }], [{ row: 6, col: 2 }, { row: 6, col: 8 }], [{ row: 6, col: 6 }, { row: 6, col: 8 }]],
                7: [[{ row: 7, col: 0 }, { row: 7, col: 1 }], [{ row: 7, col: 0 }, { row: 7, col: 6 }], [{ row: 7, col: 0 }, { row: 7, col: 8 }], [{ row: 7, col: 1 }, { row: 7, col: 6 }], [{ row: 7, col: 1 }, { row: 7, col: 8 }], [{ row: 7, col: 6 }, { row: 7, col: 8 }]],
            },
            [HOUSE_TYPE.COL]: {
                0: [[{ row: 1, col: 0 }, { row: 2, col: 0 }], [{ row: 1, col: 0 }, { row: 4, col: 0 }], [{ row: 1, col: 0 }, { row: 6, col: 0 }], [{ row: 1, col: 0 }, { row: 7, col: 0 }], [{ row: 2, col: 0 }, { row: 4, col: 0 }], [{ row: 2, col: 0 }, { row: 6, col: 0 }], [{ row: 2, col: 0 }, { row: 7, col: 0 }], [{ row: 4, col: 0 }, { row: 6, col: 0 }], [{ row: 4, col: 0 }, { row: 7, col: 0 }], [{ row: 6, col: 0 }, { row: 7, col: 0 }]],
                1: [[{ row: 1, col: 1 }, { row: 4, col: 1 }], [{ row: 1, col: 1 }, { row: 7, col: 1 }], [{ row: 4, col: 1 }, { row: 7, col: 1 }]],
                2: [[{ row: 2, col: 2 }, { row: 4, col: 2 }], [{ row: 2, col: 2 }, { row: 6, col: 2 }], [{ row: 4, col: 2 }, { row: 6, col: 2 }]],
                6: [[{ row: 1, col: 6 }, { row: 6, col: 6 }], [{ row: 1, col: 6 }, { row: 7, col: 6 }], [{ row: 6, col: 6 }, { row: 7, col: 6 }]],
                8: [[{ row: 1, col: 8 }, { row: 2, col: 8 }], [{ row: 1, col: 8 }, { row: 6, col: 8 }], [{ row: 1, col: 8 }, { row: 7, col: 8 }], [{ row: 2, col: 8 }, { row: 6, col: 8 }], [{ row: 2, col: 8 }, { row: 7, col: 8 }], [{ row: 6, col: 8 }, { row: 7, col: 8 }]],
            },
            [HOUSE_TYPE.BLOCK]: {
                0: [[{ row: 1, col: 0 }, { row: 1, col: 1 }], [{ row: 1, col: 0 }, { row: 2, col: 0 }], [{ row: 1, col: 0 }, { row: 2, col: 2 }], [{ row: 1, col: 1 }, { row: 2, col: 0 }], [{ row: 1, col: 1 }, { row: 2, col: 2 }], [{ row: 2, col: 0 }, { row: 2, col: 2 }]],
                2: [[{ row: 1, col: 6 }, { row: 1, col: 8 }], [{ row: 1, col: 6 }, { row: 2, col: 8 }], [{ row: 1, col: 8 }, { row: 2, col: 8 }]],
                3: [[{ row: 4, col: 0 }, { row: 4, col: 1 }], [{ row: 4, col: 0 }, { row: 4, col: 2 }], [{ row: 4, col: 1 }, { row: 4, col: 2 }]],
                6: [[{ row: 6, col: 0 }, { row: 6, col: 2 }], [{ row: 6, col: 0 }, { row: 7, col: 0 }], [{ row: 6, col: 0 }, { row: 7, col: 1 }], [{ row: 6, col: 2 }, { row: 7, col: 0 }], [{ row: 6, col: 2 }, { row: 7, col: 1 }], [{ row: 7, col: 0 }, { row: 7, col: 1 }]],
                8: [[{ row: 6, col: 6 }, { row: 6, col: 8 }], [{ row: 6, col: 6 }, { row: 7, col: 6 }], [{ row: 6, col: 6 }, { row: 7, col: 8 }], [{ row: 6, col: 8 }, { row: 7, col: 6 }], [{ row: 6, col: 8 }, { row: 7, col: 8 }], [{ row: 7, col: 6 }, { row: 7, col: 8 }]],
            },
        }

        expect(getNoteWeakLinks(2, notes, possibleNotes)).toEqual(expectedResult)
    })
})
