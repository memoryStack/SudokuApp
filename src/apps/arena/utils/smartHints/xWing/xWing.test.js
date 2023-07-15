/* eslint-disable global-require */
import {
    isPerfectXWing,
    getXWingRawHints,
    getHouseXWingLegs,
    isFinnedLeg,
    isFinnedXWing,
    isFinnedXWingRemovesNotes,
    isSashimiFinnedXWing,
    getAlignedCellInPerfectLeg,
    transformSashimiXWingLeg,
    getXWingType,
} from './index' // TODO: find why jest tests fail when this import is like '.' instead of './index'
import { HOUSE_TYPE } from '../constants'
import { LEG_TYPES, XWING_TYPES } from './constants'
import {
    categorizeFinnedLegCells,
    getFinnedXWingRemovableNotesHostCells,
    getCrossHouseType,
    addCellInXWingLeg,
    getPerfectCellsInFinnedBlock,
    getXWingHosuesInOrder,
    categorizeSashimiXWingPerfectLegCells,
    getSashimiCell,
} from './utils'

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
    const { mainNumbers, notesData } = require('./testData/perfectXWing')
    mockBoardSelectors(notesData)

    const expectedXWings = [
        {
            houseType: HOUSE_TYPE.COL,
            type: XWING_TYPES.PERFECT,
            legs: [
                {
                    candidate: 8,
                    cells: [
                        { row: 0, col: 1 },
                        { row: 7, col: 1 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 8,
                    cells: [
                        { row: 0, col: 6 },
                        { row: 7, col: 6 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        },
        {
            houseType: HOUSE_TYPE.ROW,
            type: XWING_TYPES.PERFECT,
            legs: [
                {
                    candidate: 8,
                    cells: [
                        { row: 1, col: 2 },
                        { row: 1, col: 7 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 8,
                    cells: [
                        { row: 8, col: 2 },
                        { row: 8, col: 7 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        },
    ]

    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getXWingRawHints(mainNumbers, notesData, maxHintsThreshold)).toStrictEqual(expectedXWings)
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
    const { mainNumbers, notesData } = require('./testData/perfectXWing')
    mockBoardSelectors(notesData)

    test('test 1', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 0 }
        const expectedXWingLegs = [
            {
                candidate: 1,
                cells: [
                    { row: 0, col: 1 },
                    { row: 0, col: 2 },
                    { row: 0, col: 3 },
                ],
                type: LEG_TYPES.FINNED,
            },
            {
                candidate: 2,
                cells: [
                    { row: 0, col: 3 },
                    { row: 0, col: 6 },
                ],
                type: LEG_TYPES.PERFECT,
            },
            {
                candidate: 4,
                cells: [
                    { row: 0, col: 3 },
                    { row: 0, col: 6 },
                    { row: 0, col: 7 },
                ],
                type: LEG_TYPES.FINNED,
            },
        ]

        expect(getHouseXWingLegs(house, mainNumbers, notesData)).toStrictEqual(expectedXWingLegs)
    })

    test('test 2', () => {
        const house = { type: HOUSE_TYPE.ROW, num: 1 }
        const expectedXWingLegs = [
            {
                candidate: 2,
                cells: [
                    { row: 1, col: 3 },
                    { row: 1, col: 4 },
                    { row: 1, col: 8 },
                ],
                type: LEG_TYPES.FINNED,
            },
            {
                candidate: 8,
                cells: [
                    { row: 1, col: 2 },
                    { row: 1, col: 7 },
                ],
                type: LEG_TYPES.PERFECT,
            },
            {
                candidate: 9,
                cells: [
                    { row: 1, col: 2 },
                    { row: 1, col: 8 },
                ],
                type: LEG_TYPES.PERFECT,
            },
        ]

        expect(getHouseXWingLegs(house, mainNumbers, notesData)).toStrictEqual(expectedXWingLegs)
    })

    test('test 4', () => {
        const house = { type: HOUSE_TYPE.COL, num: 0 }
        const expectedXWingLegs = [
            {
                candidate: 2,
                cells: [
                    { row: 4, col: 0 },
                    { row: 5, col: 0 },
                ],
                type: LEG_TYPES.PERFECT,
            },
            {
                candidate: 4,
                cells: [
                    { row: 4, col: 0 },
                    { row: 5, col: 0 },
                ],
                type: LEG_TYPES.PERFECT,
            },
        ]

        expect(getHouseXWingLegs(house, mainNumbers, notesData)).toStrictEqual(expectedXWingLegs)
    })
})

describe('is finned X-Wing legs ', () => {
    // TODO: remove house info from all of these tests
    test('test 1', () => {
        const hostCells = [
            { row: 3, col: 1 },
            { row: 4, col: 1 },
            { row: 7, col: 1 },
        ]

        expect(isFinnedLeg(hostCells)).toBe(true)
    })

    // more than 4 cells
    test('test 2', () => {
        const hostCells = [
            { row: 3, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 2 },
            { row: 6, col: 2 },
            { row: 8, col: 2 },
        ]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // one host cell only
    test('test 3', () => {
        const hostCells = [{ row: 3, col: 2 }]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // perfect X-Wing leg
    test('test 4', () => {
        const hostCells = [
            { row: 3, col: 2 },
            { row: 4, col: 2 },
        ]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // all cells belong to 1 block only
    test('test 4', () => {
        const hostCells = [
            { row: 5, col: 3 },
            { row: 5, col: 4 },
            { row: 5, col: 5 },
        ]

        expect(isFinnedLeg(hostCells)).toBe(true)
    })

    // 3 cells but belong to 3 different blocks
    test('test 6', () => {
        const hostCells = [
            { row: 8, col: 0 },
            { row: 8, col: 3 },
            { row: 8, col: 7 },
        ]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // 4 cells but belong to 2 different blocks evenly {2, 2} distribution
    test('test 7', () => {
        const hostCells = [
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 7 },
            { row: 8, col: 8 },
        ]

        expect(isFinnedLeg(hostCells)).toBe(false)
    })

    // 4 cells but belong to 2 different blocks un-evenly {1, 3} distribution
    test('test 8', () => {
        const hostCells = [
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 8 },
        ]

        expect(isFinnedLeg(hostCells)).toBe(true)
    })
})

describe('isFinnedXWing()', () => {
    // Note: in order for "isFinnedXWing" to work properly, the
    // otherLegHostCells must return true from isFinnedLeg func
    test('returns true when all perfectLeg cells are aligned with the otherLeg and finns share block with exactly one plerfectly aligned cell of otherLeg', () => {
        const perfectLegHostCells = [
            { row: 2, col: 5 },
            { row: 2, col: 8 },
        ]
        const otherLegHostCells = [
            { row: 3, col: 3 },
            { row: 3, col: 5 },
            { row: 3, col: 8 },
        ]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(true)
    })

    test('returns false when all perfectLeg cells are not aligned with the otherLeg cells', () => {
        const perfectLegHostCells = [
            { row: 6, col: 3 },
            { row: 6, col: 8 },
        ]
        const otherLegHostCells = [
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 8 },
        ]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })

    test('returns false when all perfectLeg cells are aligned but the finns doesn\'t share a common block with any otherLeg cell which are aligned with perfectLeg cells', () => {
        const perfectLegHostCells = [
            { row: 4, col: 3 },
            { row: 5, col: 3 },
        ]
        const otherLegHostCells = [
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 4, col: 2 },
            { row: 5, col: 2 },
        ]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })

    test('returns false when all perfectLeg cells are aligned but the finns doesn\'t share a common block with any otherLeg cell which are aligned with perfectLeg cells', () => {
        const perfectLegHostCells = [
            { row: 4, col: 3 },
            { row: 4, col: 6 },
        ]
        const otherLegHostCells = [
            { row: 6, col: 2 },
            { row: 6, col: 3 },
            { row: 6, col: 6 },
        ]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })

    test('returns true when all perfectLeg cells are aligned with the otherLeg and finns share block with exactly one plerfectly aligned cell of otherLeg', () => {
        const perfectLegHostCells = [
            { row: 4, col: 3 },
            { row: 4, col: 6 },
        ]
        const otherLegHostCells = [
            { row: 6, col: 3 },
            { row: 6, col: 6 },
            { row: 6, col: 4 },
            { row: 6, col: 5 },
        ]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(true)
    })

    test('returns false when perfectLeg cells are aligned and only one finn shares block with the otherLeg cell which is aligned with the perfectLeg cells', () => {
        const perfectLegHostCells = [
            { row: 4, col: 3 },
            { row: 4, col: 5 },
        ]
        const otherLegHostCells = [
            { row: 6, col: 3 },
            { row: 6, col: 5 },
            { row: 6, col: 4 },
            { row: 6, col: 6 },
        ]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })

    test('returns false when in finned leg there is only one cell which is aligned with the perfect leg cells', () => {
        const perfectLegHostCells = [
            { row: 3, col: 2 },
            { row: 3, col: 4 },
        ]
        const otherLegHostCells = [
            { row: 6, col: 3 },
            { row: 6, col: 4 },
            { row: 6, col: 5 },
        ]
        expect(isFinnedXWing(perfectLegHostCells, otherLegHostCells)).toBe(false)
    })
})

describe('categorize finned leg cells for X-Wing where perfect leg cells are aligned with non-perfect X-Wing legs', () => {
    test('test 1', () => {
        const perfectLegHostCells = [
            { row: 2, col: 5 },
            { row: 2, col: 8 },
        ]
        const otherLegHostCells = [
            { row: 3, col: 3 },
            { row: 3, col: 5 },
            { row: 3, col: 8 },
        ]

        const expectedResult = {
            perfect: [
                { row: 3, col: 5 },
                { row: 3, col: 8 },
            ],
            finns: [{ row: 3, col: 3 }],
        }
        expect(categorizeFinnedLegCells(perfectLegHostCells, otherLegHostCells)).toStrictEqual(expectedResult)
    })

    test('test 2', () => {
        const perfectLegHostCells = [
            { col: 0, row: 4 },
            { col: 0, row: 5 },
        ]

        const otherLegHostCells = [
            { col: 6, row: 0 },
            { col: 6, row: 3 },
            { col: 6, row: 4 },
            { col: 6, row: 5 },
        ]

        const expectedResult = {
            perfect: [
                { col: 6, row: 4 },
                { col: 6, row: 5 },
            ],
            finns: [
                { col: 6, row: 0 },
                { col: 6, row: 3 },
            ],
        }
        expect(categorizeFinnedLegCells(perfectLegHostCells, otherLegHostCells)).toStrictEqual(expectedResult)
    })
})

// TODO: these test-cases are failing, accomodate these
describe(' check if finned X-Wing removes notes or not ', () => {
    test('test 1', () => {
        const { notesData } = require('./testData/perfectXWing')
        mockBoardSelectors(notesData)

        const data = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 3,
                    cells: [
                        { row: 2, col: 5 },
                        { row: 2, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 3,
                    cells: [
                        { row: 3, col: 3 },
                        { row: 3, col: 5 },
                        { row: 3, col: 8 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
            ],
        }
        expect(isFinnedXWingRemovesNotes(data, notesData)).toBe(false)
    })

    test('test 2', () => {
        const { notesData } = require('./testData/perfectXWing')
        // test cases i have doesn't have Finned X-Wing which will remove some notes.
        // so artificially creating one

        // CHECK: will it create some side-effect ??
        notesData[4][1][6].show = true

        /** */

        mockBoardSelectors(notesData)

        const data = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 7,
                    cells: [
                        { row: 3, col: 1 },
                        { row: 3, col: 2 },
                        { row: 3, col: 6 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 7,
                    cells: [
                        { row: 7, col: 1 },
                        { row: 7, col: 6 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }
        expect(isFinnedXWingRemovesNotes(data, notesData)).toBe(true)
    })

    test('returns false for sashimi-finned x-wing when no notes to remove', () => {
        const { notesData } = require('./testData/perfectXWing')
        // test cases i have doesn't have Sashimi-Finned X-Wing which will remove some notes.
        // so artificially creating one

        notesData[3][5][4].show = true

        /** */

        mockBoardSelectors(notesData)

        const data = {
            houseType: HOUSE_TYPE.COL,
            type: XWING_TYPES.SASHIMI_FINNED,
            legs: [
                {
                    candidate: 5,
                    cells: [
                        { row: 3, col: 4 },
                        { row: 4, col: 4 },
                        { row: 5, col: 4 },
                    ],
                    type: LEG_TYPES.SASHIMI_FINNED,
                },
                {
                    candidate: 5,
                    cells: [
                        { row: 3, col: 8 },
                        { row: 4, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }
        expect(isFinnedXWingRemovesNotes(data, notesData)).toBe(true)
    })
})

describe(' removable notes host cells for finned X-Wing ', () => {
    test('returns cells from cross house which have candidate present in them and shares same block with finn cells', () => {
        const { notesData } = require('./testData/finnedXWing')

        const data = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 7,
                    cells: [
                        { row: 2, col: 5 },
                        { row: 2, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 7,
                    cells: [
                        { row: 6, col: 5 },
                        { row: 6, col: 6 },
                        { row: 6, col: 7 },
                        { row: 6, col: 8 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
            ],
        }

        const expectedResult = [{ row: 7, col: 8 }]
        expect(getFinnedXWingRemovableNotesHostCells(data, notesData)).toStrictEqual(expectedResult)
    })
})

describe('isSashimiFinnedXWing()', () => {
    test('returns true for 1 perfect leg and 1 finned leg for row houseType with valid finned leg and sashimi cell with finns', () => {
        const xWing = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 3, col: 3 },
                        { row: 3, col: 4 },
                        { row: 3, col: 8 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 7, col: 5 },
                        { row: 7, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(isSashimiFinnedXWing(xWing)).toBe(true)
    })

    test('returns true for 1 perfect leg and 1 finned leg for column houseType with valid finned leg and sashimi cell with finns', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 4, col: 5 },
                        { row: 7, col: 5 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 3, col: 6 },
                        { row: 5, col: 6 },
                        { row: 7, col: 6 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
            ],
        }

        expect(isSashimiFinnedXWing(xWing)).toBe(true)
    })

    test('returns false for 1 perfect leg and 1 finned leg for column houseType with invalid finned leg', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 3, col: 6 },
                        { row: 7, col: 6 },
                        { row: 8, col: 6 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 4, col: 5 },
                        { row: 7, col: 5 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(isSashimiFinnedXWing(xWing)).toBe(false)
    })

    test('returns false for 1 perfect leg and 1 finned leg for column houseType with valid finned leg but sashimi cell will be without finns', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 6, col: 6 },
                        { row: 7, col: 6 },
                        { row: 8, col: 6 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 4, col: 5 },
                        { row: 8, col: 5 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(isSashimiFinnedXWing(xWing)).toBe(false)
    })

    test('returns true for both perfect legs', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 4, col: 5 },
                        { row: 7, col: 5 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 3, col: 6 },
                        { row: 7, col: 6 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(isSashimiFinnedXWing(xWing)).toBe(true)
    })

    test('returns false for both perfect legs when artificial sashimi-finned leg will have host cells spread over three blocks', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 2, col: 6 },
                        { row: 7, col: 6 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 4, col: 5 },
                        { row: 7, col: 5 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(isSashimiFinnedXWing(xWing)).toBe(false)
    })

    test('returns false for both perfect legs when artificial sashimi-finned leg have host cells spread over two blocks but sashimi cell will be without finns', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 4, col: 5 },
                        { row: 7, col: 5 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 6, col: 6 },
                        { row: 7, col: 6 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(isSashimiFinnedXWing(xWing)).toBe(false)
    })

    // surprisingly this test fixed the argument issue in implementation
    test('fixed arguments issue in implementation', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 9,
                    cells: [
                        { row: 4, col: 3 },
                        { row: 5, col: 3 },
                        { row: 6, col: 3 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 9,
                    cells: [
                        { row: 5, col: 5 },
                        { row: 7, col: 5 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(isSashimiFinnedXWing(xWing)).toBe(false)
    })
})

// mainly will use it for sashimi only. will make it more
// general if other use cases occurs
describe('getAlignedCellInPerfectLeg()', () => {
    test('returns aligned cell 1 aligned cell present', () => {
        const perfectLegCells = [
            { row: 7, col: 5 },
            { row: 7, col: 8 },
        ]
        const otherLegCells = [
            { row: 3, col: 3 },
            { row: 3, col: 4 },
            { row: 3, col: 8 },
        ]
        const expectedResult = { row: 7, col: 8 }
        expect(getAlignedCellInPerfectLeg(perfectLegCells, otherLegCells)).toStrictEqual(expectedResult)
    })

    test('returns first cell for both aligned cell present (basically perfect x-wing cells)', () => {
        const perfectLegCells = [
            { row: 7, col: 5 },
            { row: 7, col: 8 },
        ]
        const otherLegCells = [
            { row: 3, col: 5 },
            { row: 3, col: 8 },
        ]
        const expectedResult = { row: 7, col: 5 }
        expect(getAlignedCellInPerfectLeg(perfectLegCells, otherLegCells)).toStrictEqual(expectedResult)
    })

    test('returns undefined for no aligned cells', () => {
        const perfectLegCells = [
            { row: 7, col: 1 },
            { row: 7, col: 3 },
        ]
        const otherLegCells = [
            { row: 3, col: 2 },
            { row: 3, col: 6 },
        ]
        expect(getAlignedCellInPerfectLeg(perfectLegCells, otherLegCells)).toBeUndefined()
    })
})

describe('categorizeSashimiXWingPerfectLegCells()', () => {
    test('sepertes sashimi aligned cell and cell aligned with perfect part of finned-sashimi', () => {
        const perfectLegCells = [
            { row: 7, col: 5 },
            { row: 7, col: 8 },
        ]
        const otherLegCells = [
            { row: 3, col: 3 },
            { row: 3, col: 4 },
            { row: 3, col: 8 },
        ]
        const expectedResult = {
            perfectAligned: { row: 7, col: 8 },
            sashimiAligned: { row: 7, col: 5 },
        }
        expect(categorizeSashimiXWingPerfectLegCells(perfectLegCells, otherLegCells)).toStrictEqual(expectedResult)
    })
})

describe('getSashimiCell()', () => {
    // note don't pass sashimi cell already in the cells array for the SASHIMI_FINNED leg
    // only send sashimi finned x-wing here
    test('returns sashimi cell for row house type sashimi-finned XWing', () => {
        const xWing = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 2,
                    cells: [
                        { row: 3, col: 3 },
                        { row: 3, col: 4 },
                        { row: 3, col: 8 },
                    ],
                    type: LEG_TYPES.SASHIMI_FINNED,
                },
                {
                    candidate: 2,
                    cells: [
                        { row: 7, col: 5 },
                        { row: 7, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        const expectedResult = { row: 3, col: 5 }
        expect(getSashimiCell(xWing)).toStrictEqual(expectedResult)
    })

    test('returns sashimi cell for col house type sashimi-finned XWing', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 2,
                    cells: [
                        { row: 3, col: 8 },
                        { row: 6, col: 8 },
                        { row: 8, col: 8 },
                    ],
                    type: LEG_TYPES.SASHIMI_FINNED,
                },
                {
                    candidate: 2,
                    cells: [
                        { row: 3, col: 5 },
                        { row: 7, col: 5 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        const expectedResult = { row: 7, col: 8 }
        expect(getSashimiCell(xWing)).toStrictEqual(expectedResult)
    })
})

describe('addCellInXWingLeg()', () => {
    test('adds new cell in front in row type X-Wing in sorted order', () => {
        const xWingHouseType = HOUSE_TYPE.ROW
        const cellToInsert = { row: 3, col: 2 }
        const legCells = [
            { row: 3, col: 3 },
            { row: 3, col: 4 },
            { row: 3, col: 8 },
        ]
        const expectedResult = [
            { row: 3, col: 2 },
            { row: 3, col: 3 },
            { row: 3, col: 4 },
            { row: 3, col: 8 },
        ]
        addCellInXWingLeg(cellToInsert, legCells, xWingHouseType)
        expect(legCells).toStrictEqual(expectedResult)
    })

    test('adds new cell in last in column type X-Wing in sorted order', () => {
        const xWingHouseType = HOUSE_TYPE.COL
        const cellToInsert = { row: 6, col: 2 }
        const legCells = [
            { row: 1, col: 2 },
            { row: 3, col: 2 },
            { row: 4, col: 2 },
        ]
        const expectedResult = [
            { row: 1, col: 2 },
            { row: 3, col: 2 },
            { row: 4, col: 2 },
            { row: 6, col: 2 },
        ]
        addCellInXWingLeg(cellToInsert, legCells, xWingHouseType)
        expect(legCells).toStrictEqual(expectedResult)
    })

    test('adds new cell in middle in column type X-Wing in sorted order', () => {
        const xWingHouseType = HOUSE_TYPE.COL
        const cellToInsert = { row: 4, col: 2 }
        const legCells = [
            { row: 1, col: 2 },
            { row: 3, col: 2 },
            { row: 6, col: 2 },
        ]
        const expectedResult = [
            { row: 1, col: 2 },
            { row: 3, col: 2 },
            { row: 4, col: 2 },
            { row: 6, col: 2 },
        ]
        addCellInXWingLeg(cellToInsert, legCells, xWingHouseType)
        expect(legCells).toStrictEqual(expectedResult)
    })
})

describe('transformSashimiXWingLeg()', () => {
    test('adds sashimi cell in already finned leg and changes the leg type to SASHIMI_FINNED', () => {
        const legA = {
            candidate: 4,
            cells: [
                { row: 7, col: 5 },
                { row: 7, col: 8 },
            ],
            type: LEG_TYPES.PERFECT,
        }
        const legB = {
            candidate: 4,
            cells: [
                { row: 3, col: 3 },
                { row: 3, col: 4 },
                { row: 3, col: 8 },
            ],
            type: LEG_TYPES.FINNED,
        }
        const houseType = HOUSE_TYPE.ROW

        const expectedResult = [
            legA,
            {
                candidate: 4,
                cells: [
                    { row: 3, col: 3 },
                    { row: 3, col: 4 },
                    { row: 3, col: 5 },
                    { row: 3, col: 8 },
                ],
                type: LEG_TYPES.SASHIMI_FINNED,
            },
        ]

        expect(transformSashimiXWingLeg({ houseType, legs: [legA, legB] })).toStrictEqual(expectedResult)
    })
})

// TODO: add more test-cses for this func
describe('getXWingType()', () => {
    beforeEach(() => {
        const { notes } = require('./testData/sashimiFinnedXWing')
        mockBoardSelectors(notes)
    })

    test('returns XWING_TYPES.FINNED for 1 perfect leg and 1 finned leg and perfect host cells are aligned for perfect leg', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 3, col: 4 },
                        { row: 5, col: 4 },
                        { row: 6, col: 4 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 5, col: 7 },
                        { row: 6, col: 7 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(getXWingType(xWing)).toBe(XWING_TYPES.FINNED)
    })

    test('returns XWING_TYPES.SASHIMI_FINNED for 1 perfect leg and 1 finned leg but only one cells pair between these legs is aligned', () => {
        const xWing = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 4,
                    cells: [
                        { row: 3, col: 3 },
                        { row: 3, col: 4 },
                        { row: 3, col: 8 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 4,
                    cells: [
                        { row: 7, col: 5 },
                        { row: 7, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(getXWingType(xWing)).toBe(XWING_TYPES.SASHIMI_FINNED)
    })
})

describe('getPerfectCellsInFinnedBlock()', () => {
    test('returns all the perfect cells from finned legs which shares its block with finn cells', () => {
        const xWing = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 7,
                    cells: [
                        { row: 2, col: 5 },
                        { row: 2, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 7,
                    cells: [
                        { row: 6, col: 5 },
                        { row: 6, col: 6 },
                        { row: 6, col: 7 },
                        { row: 6, col: 8 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
            ],
        }

        const expectedResult = [{ row: 6, col: 8 }]
        expect(getPerfectCellsInFinnedBlock(xWing.legs)).toStrictEqual(expectedResult)
    })

    test('returns all the perfect cells from finned legs which shares its block with finn cells', () => {
        const xWing = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 7,
                    cells: [
                        { row: 2, col: 6 },
                        { row: 2, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 7,
                    cells: [
                        { row: 6, col: 6 },
                        { row: 6, col: 7 },
                        { row: 6, col: 8 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
            ],
        }

        const expectedResult = [
            { row: 6, col: 6 },
            { row: 6, col: 8 },
        ]
        expect(getPerfectCellsInFinnedBlock(xWing.legs)).toStrictEqual(expectedResult)
    })
})

describe('getXWingHosuesInOrder()', () => {
    test('returns X-Wing houses info sorted in first come order in board', () => {
        const xWing = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 7,
                    cells: [
                        { row: 2, col: 5 },
                        { row: 2, col: 8 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 7,
                    cells: [
                        { row: 6, col: 5 },
                        { row: 6, col: 6 },
                        { row: 6, col: 7 },
                        { row: 6, col: 8 },
                    ],
                    type: LEG_TYPES.FINNED,
                },
            ],
        }

        const expectedResult = [
            { type: HOUSE_TYPE.ROW, num: 2 },
            { type: HOUSE_TYPE.ROW, num: 6 },
        ]
        expect(getXWingHosuesInOrder(xWing)).toStrictEqual(expectedResult)
    })
})
