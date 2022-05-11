import { isPerfectXWing, getAllXWings, getHouseXWingLegs, isFinnedLeg, isFinnedXWing, isFinnedXWingRemovesNotes } from '.'
import { HOUSE_TYPE } from '../constants'
import { LEG_TYPES } from './constants'
import { categorizeFinnedLegCells, getFinnedXWingRemovableNotesHostCells, getCrossHouseType } from './utils'

jest.mock('../../../../../redux/dispatch.helpers')
jest.mock('../../../store/selectors/board.selectors')

const mockBoardSelectors = mockedNotes => {
    const { getPossibleNotes, getNotesInfo } = require('../../../store/selectors/board.selectors')
    const { getStoreState } = require('../../../../../redux/dispatch.helpers')
    // mocked notes will be same for user input and possibles notes as well
    getPossibleNotes.mockReturnValue(mockedNotes)
    getNotesInfo.mockReturnValue(mockedNotes)
    getStoreState.mockReturnValue({})
}

// all the types of X-Wings. whether removes notes or not
test('perfect xWing', () => {
    const { mainNumbers, notesData } = require('./testData')
    mockBoardSelectors(notesData)

    const expectedXWings = [

        {
            type: LEG_TYPES.FINNED,
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 3,
                    cells: [{ row: 2, col: 5 }, { row: 2, col: 8 }],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 3,
                    cells: [{ row: 3, col: 3 }, { row: 3, col: 5 }, { row: 3, col: 8 }],
                    type: LEG_TYPES.FINNED,
                }
            ]
        },

        {
            type: LEG_TYPES.FINNED,
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 5,
                    cells: [{ row: 3, col: 2 }, { row: 4, col: 2 }, { row: 5, col: 2 }],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 5,
                    cells: [{ row: 3, col: 4 }, { row: 5, col: 4 }],
                    type: LEG_TYPES.PERFECT,
                }
            ],
        },

        {
            type: LEG_TYPES.FINNED,
            houseType: HOUSE_TYPE.COL,
            legs: [{
                candidate: 5,
                cells: [{ row: 3, col: 2 }, { row: 4, col: 2 }, { row: 5, col: 2 }],
                type: LEG_TYPES.FINNED
            },
            {
                candidate: 5,
                cells: [{ row: 3, col: 8 }, { row: 4, col: 8 }],
                type: LEG_TYPES.PERFECT
            }
            ]
        },
        {
            type: LEG_TYPES.FINNED,
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 7,
                    cells: [{ row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 6 }],
                    type: LEG_TYPES.FINNED
                },
                {
                    candidate: 7,
                    cells: [{ row: 7, col: 1 }, { row: 7, col: 6 }],
                    type: LEG_TYPES.PERFECT
                }
            ],
        },
        {
            type: LEG_TYPES.PERFECT,
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 8,
                    cells: [{ row: 0, col: 1 }, { row: 7, col: 1 }],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 8,
                    cells: [{ row: 0, col: 6 }, { row: 7, col: 6 }],
                    type: LEG_TYPES.PERFECT,
                }
            ],
        },
        {
            houseType: HOUSE_TYPE.ROW,
            type: LEG_TYPES.PERFECT,
            legs: [
                {
                    candidate: 8,
                    cells: [{ row: 1, col: 2 }, { row: 1, col: 7 }],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 8,
                    cells: [{ row: 8, col: 2 }, { row: 8, col: 7 }],
                    type: LEG_TYPES.PERFECT,
                }
            ],
        }

    ]
    expect(getAllXWings(mainNumbers, notesData)).toStrictEqual(expectedXWings)
})

test('xWing getCrossHouseType', () => {
    expect(getCrossHouseType(HOUSE_TYPE.COL)).toEqual(HOUSE_TYPE.ROW)
    expect(getCrossHouseType(HOUSE_TYPE.ROW)).toEqual(HOUSE_TYPE.COL)
})

describe('xWing isPerfectXWing', () => {
    test('test 1', () => {
        const firstHouseCells = [
            { row: 0, col: 0 },
            { row: 0, col: 8 },
        ]
        const secondHouseCells = [
            { row: 8, col: 0 },
            { row: 8, col: 8 },
        ]
        expect(isPerfectXWing(firstHouseCells, secondHouseCells)).toEqual(true)
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
        expect(isPerfectXWing(firstHouseCells, secondHouseCells)).toEqual(true)
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
        expect(isPerfectXWing(firstHouseCells, secondHouseCells)).toEqual(false)
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
        expect(isPerfectXWing(firstHouseCells, secondHouseCells)).toEqual(false)
    })
})

// change this test for supporting finned and sashimis as well
// after fixing this. fix X-Wings test on top
describe('house XWing perfect Legs', () => {

    const { mainNumbers, notesData } = require('./testData')
    mockBoardSelectors(notesData)

    test('test 1', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 0 }
        const expectedXWingLegs = [
            {
                candidate: 1,
                cells: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }],
                type: LEG_TYPES.FINNED,
            },
            {
                candidate: 2,
                cells: [{ row: 0, col: 3 }, { row: 0, col: 6 }],
                type: LEG_TYPES.PERFECT,
            },
            {
                candidate: 4,
                cells: [{ row: 0, col: 3 }, { row: 0, col: 6 }, { row: 0, col: 7 }],
                type: LEG_TYPES.FINNED,
            }
        ]

        expect(getHouseXWingLegs(house, mainNumbers, notesData)).toStrictEqual(expectedXWingLegs)
    })

    test('test 2', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 1 }
        const expectedXWingLegs = [
            {
                candidate: 2,
                cells: [{ row: 1, col: 3 }, { row: 1, col: 4 }, { row: 1, col: 8 }],
                type: LEG_TYPES.FINNED,
            },
            {
                candidate: 8,
                cells: [{ row: 1, col: 2 }, { row: 1, col: 7 }],
                type: LEG_TYPES.PERFECT,
            },
            {
                candidate: 9,
                cells: [{ row: 1, col: 2 }, { row: 1, col: 8 }],
                type: LEG_TYPES.PERFECT,
            }
        ]

        expect(getHouseXWingLegs(house, mainNumbers, notesData)).toStrictEqual(expectedXWingLegs)
    })

    test('test 4', () => {
        const house = { type: HOUSE_TYPE.COL, num: 0 }
        const expectedXWingLegs = [
            {
                candidate: 2,
                cells: [{ row: 4, col: 0 }, { row: 5, col: 0 }],
                type: LEG_TYPES.PERFECT,
            },
            {
                candidate: 4,
                cells: [{ row: 4, col: 0 }, { row: 5, col: 0 }],
                type: LEG_TYPES.PERFECT,
            }
        ]

        expect(getHouseXWingLegs(house, mainNumbers, notesData)).toStrictEqual(expectedXWingLegs)
    })

})

describe('is finned X-Wing legs ', () => {

    // TODO: remove house info from all of these tests
    test('test 1', () => {
        const hostCells = [{ row: 3, col: 1 }, { row: 4, col: 1 }, { row: 7, col: 1 }]

        expect(isFinnedLeg(hostCells)).toBe(true)
    })

    // more than 4 cells
    test('test 2', () => {
        const hostCells = [{ row: 3, col: 2 }, { row: 4, col: 2 }, { row: 5, col: 2 }, { row: 6, col: 2 }, { row: 8, col: 2 }]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // one host cell only
    test('test 3', () => {
        const hostCells = [{ row: 3, col: 2 }]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // perfect X-Wing leg
    test('test 4', () => {
        const hostCells = [{ row: 3, col: 2 }, { row: 4, col: 2 }]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // all cells belong to 1 block only
    test('test 4', () => {
        const hostCells = [{ row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }]

        expect(isFinnedLeg(hostCells)).toBe(true)
    })

    // 3 cells but belong to 3 different blocks
    test('test 6', () => {
        const hostCells = [{ row: 8, col: 0 }, { row: 8, col: 3 }, { row: 8, col: 7 }]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // 4 cells but belong to 2 different blocks evenly {2, 2} distribution
    test('test 7', () => {
        const hostCells = [{ row: 8, col: 0 }, { row: 8, col: 1 }, { row: 8, col: 7 }, { row: 8, col: 8 }]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // 4 cells but belong to 2 different blocks un-evenly {1, 3} distribution
    test('test 8', () => {
        const hostCells = [{ row: 8, col: 0 }, { row: 8, col: 1 }, { row: 8, col: 2 }, { row: 8, col: 8 }]

        expect(isFinnedLeg(hostCells)).toBe(true)
    })

})

describe('are finned X-Wing cells', () => {
    test('test 1', () => {
        const perfectLegHostCells = [{ row: 2, col: 5 }, { row: 2, col: 8 }]
        const otherLegHostCells = [{ row: 3, col: 3 }, { row: 3, col: 5 }, { row: 3, col: 8 }]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(true)
    })

    // perfect cells don't match at all
    test('test 2', () => {
        const perfectLegHostCells = [{ row: 6, col: 3 }, { row: 6, col: 8 }]
        const otherLegHostCells = [{ row: 7, col: 5 }, { row: 7, col: 6 }, { row: 7, col: 8 }]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })

    // perfect leg cells are aligned but all finned cells are in another block
    test('test 3', () => {
        const perfectLegHostCells = [{ row: 4, col: 3 }, { row: 5, col: 3 }]
        const otherLegHostCells = [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 4, col: 2 }, { row: 5, col: 2 }]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })

    test('test 4', () => {
        const perfectLegHostCells = [{ row: 4, col: 3 }, { row: 4, col: 6 }]
        const otherLegHostCells = [{ row: 6, col: 3 }, { row: 6, col: 6 }, { row: 6, col: 2 }]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })

    test('test 5', () => {
        const perfectLegHostCells = [{ row: 4, col: 3 }, { row: 4, col: 6 }]
        const otherLegHostCells = [{ row: 6, col: 3 }, { row: 6, col: 6 }, { row: 6, col: 4 }, { row: 6, col: 5 }]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(true)
    })

    // where one finn is in perfect cells block but another in whole different block
    test('test 6', () => {
        const perfectLegHostCells = [{ row: 4, col: 3 }, { row: 4, col: 5 }]
        const otherLegHostCells = [{ row: 6, col: 3 }, { row: 6, col: 5 }, { row: 6, col: 4 }, { row: 6, col: 6 }]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })
})

describe('categorize finned leg cells for X-Wing where perfect leg cells are aligned with non-perfect X-Wing legs', () => {
    test('test 1', () => {
        const perfectLegHostCells = [{ row: 2, col: 5 }, { row: 2, col: 8 }]
        const otherLegHostCells = [{ row: 3, col: 3 }, { row: 3, col: 5 }, { row: 3, col: 8 }]

        const expectedResult = {
            perfect: [{ row: 3, col: 5 }, { row: 3, col: 8 }],
            finns: [{ row: 3, col: 3 }],
        }
        expect(categorizeFinnedLegCells(perfectLegHostCells, otherLegHostCells)).toStrictEqual(expectedResult)
    })

    test('test 2', () => {

        const perfectLegHostCells = [{ col: 0, row: 4, }, { col: 0, row: 5, }]

        const otherLegHostCells = [{ col: 6, row: 0, }, { col: 6, row: 3, }, { col: 6, row: 4, }, { col: 6, row: 5, }]

        const expectedResult = {
            perfect: [{ col: 6, row: 4, }, { col: 6, row: 5, }],
            finns: [{ col: 6, row: 0, }, { col: 6, row: 3, }],
        }
        expect(categorizeFinnedLegCells(perfectLegHostCells, otherLegHostCells)).toStrictEqual(expectedResult)
    })

})

describe(' check if finned X-Wing removes notes or not ', () => {

    test('test 1', () => {
        const { notesData } = require('./testData')
        mockBoardSelectors(notesData)

        const data = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 3,
                    cells: [{ row: 2, col: 5 }, { row: 2, col: 8 }],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 3,
                    cells: [{ row: 3, col: 3 }, { row: 3, col: 5 }, { row: 3, col: 8 }],
                    type: LEG_TYPES.FINNED,
                }
            ]
        }
        expect(isFinnedXWingRemovesNotes(data, notesData)).toBe(false)
    })

    test('test 2', () => {
        const { notesData } = require('./testData')
        // test cases i have doesn't have Finned X-Wing which will remove some notes. 
        // so artificially creating one

        notesData[4][1][6].show = true

        /** */

        mockBoardSelectors(notesData)

        const data = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 7,
                    cells: [{ row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 6 }],
                    type: LEG_TYPES.FINNED
                },
                {
                    candidate: 7,
                    cells: [{ row: 7, col: 1 }, { row: 7, col: 6 }],
                    type: LEG_TYPES.PERFECT
                }
            ],
        }
        expect(isFinnedXWingRemovesNotes(data, notesData)).toBe(true)
    })

})

describe(' removable notes host cells for finned X-Wing ', () => {

    // perfect cells of finned leg are in seperate blocks
    test('test 1', () => {
        const data = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 3,
                    cells: [{ row: 2, col: 5 }, { row: 2, col: 8 }],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 3,
                    cells: [{ row: 3, col: 3 }, { row: 3, col: 5 }, { row: 3, col: 8 }],
                    type: LEG_TYPES.FINNED,
                }
            ]
        }

        const expectedResult = [{ row: 4, col: 5 }, { row: 5, col: 5 }]
        expect(getFinnedXWingRemovableNotesHostCells(data)).toStrictEqual(expectedResult)
    })

    // perfect and finn legs are in same block
    test('test 2', () => {
        const data = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 3,
                    cells: [{ row: 3, col: 3 }, { row: 4, col: 3 }, { row: 5, col: 3 }],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 3,
                    cells: [{ row: 3, col: 6 }, { row: 5, col: 6 }],
                    type: LEG_TYPES.PERFECT,
                }
            ]
        }

        const expectedResult = [{ row: 3, col: 4 }, { row: 3, col: 5 }, { row: 5, col: 4 }, { row: 5, col: 5 }]
        expect(getFinnedXWingRemovableNotesHostCells(data)).toStrictEqual(expectedResult)
    })

    // was added after finding a bug
    test('test 3', () => {
        const data = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 3,
                    cells: [{ row: 1, col: 5 }, { row: 3, col: 5 }, { row: 4, col: 5 }, { row: 5, col: 5 }],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 3,
                    cells: [{ row: 1, col: 3 }, { row: 5, col: 3 }],
                    type: LEG_TYPES.PERFECT,
                }
            ]
        }

        const expectedResult = [{ row: 5, col: 4 }]
        expect(getFinnedXWingRemovableNotesHostCells(data)).toStrictEqual(expectedResult)
    })

})
