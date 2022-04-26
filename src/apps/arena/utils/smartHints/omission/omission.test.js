import {
    getAllOmissions,
    getHouseOmissions,
    isNoteHaveOmissionInHouse,
    areValidOmissionHostCells,
    removesNotes as omissionRemovesNotes,
} from './omission'
import { HOUSE_TYPE } from '../constants'

jest.mock('../../../../../redux/dispatch.helpers')
jest.mock('../../../store/selectors/board.selectors')

const mockBoardSelectors = mockedNotes => {
    const { getPossibleNotes, getNotesInfo } = require('../../../store/selectors/board.selectors')
    const { getStoreState } = require('../../../../../redux/dispatch.helpers')

    getPossibleNotes.mockReturnValue(mockedNotes)
    getNotesInfo.mockReturnValue(mockedNotes)
    getStoreState.mockReturnValue({})
}

test('all omissions', () => {
    const { mainNumbers, notesData } = require('./testData')

    mockBoardSelectors(notesData)

    const expectedOmissions = [
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 0 },
            removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 2 },
            note: 6,
            hostCells: [
                { row: 2, col: 0 },
                { row: 2, col: 1 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 0 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 1 },
            note: 9,
            hostCells: [
                { row: 0, col: 1 },
                { row: 2, col: 1 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 1 },
            removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 0 },
            note: 3,
            hostCells: [
                { row: 0, col: 3 },
                { row: 0, col: 4 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 1 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 4 },
            note: 9,
            hostCells: [
                { row: 0, col: 4 },
                { row: 2, col: 4 },
            ],
        },
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
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 3 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 2 },
            note: 3,
            hostCells: [
                { row: 3, col: 2 },
                { row: 4, col: 2 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 4 },
            removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 4 },
            note: 6,
            hostCells: [
                { row: 4, col: 3 },
                { row: 4, col: 4 },
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
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 5 },
            removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 5 },
            note: 2,
            hostCells: [
                { row: 5, col: 6 },
                { row: 5, col: 8 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 6 },
            removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 6 },
            note: 2,
            hostCells: [
                { row: 6, col: 1 },
                { row: 6, col: 2 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 6 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 2 },
            note: 4,
            hostCells: [
                { row: 6, col: 2 },
                { row: 8, col: 2 },
            ],
        },
        {
            hostHouse: { type: HOUSE_TYPE.BLOCK, num: 7 },
            removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 3 },
            note: 5,
            hostCells: [
                { row: 6, col: 3 },
                { row: 7, col: 3 },
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

    expect(getAllOmissions(mainNumbers, notesData)).toStrictEqual(expectedOmissions)
})

test('all Row 1 omissions', () => {
    const { mainNumbers, notesData } = require('./testData')

    mockBoardSelectors(notesData)

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

    expect(getHouseOmissions({ type: HOUSE_TYPE.ROW, num: 0 }, mainNumbers, notesData)).toStrictEqual(expectedOmissions)
})

test('all Block 2 omissions', () => {
    const { mainNumbers, notesData } = require('./testData')

    mockBoardSelectors(notesData)

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

    expect(getHouseOmissions(house, mainNumbers, notesData)).toStrictEqual(expectedOmissions)
})

test('does a note form omission in house', () => {
    const { mainNumbers, notesData } = require('./testData')

    mockBoardSelectors(notesData)

    const expectedResultOne = {
        present: true,
        hostCells: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
        ],
    }

    expect(isNoteHaveOmissionInHouse(2, { type: HOUSE_TYPE.ROW, num: 0 }, mainNumbers, notesData)).toStrictEqual(
        expectedResultOne,
    )

    const expectedResultTwo = {
        present: false,
        hostCells: [
            { row: 0, col: 1 },
            { row: 0, col: 4 },
        ],
    }

    expect(isNoteHaveOmissionInHouse(9, { type: HOUSE_TYPE.ROW, num: 0 }, mainNumbers, notesData)).toStrictEqual(
        expectedResultTwo,
    )

    const expectedResultThree = {
        present: true,
        hostCells: [
            { row: 1, col: 8 },
            { row: 2, col: 8 },
        ],
    }

    expect(isNoteHaveOmissionInHouse(5, { type: HOUSE_TYPE.BLOCK, num: 2 }, mainNumbers, notesData)).toStrictEqual(
        expectedResultThree,
    )

    const expectedResultFour = {
        present: true,
        hostCells: [
            { row: 3, col: 7 },
            { row: 4, col: 7 },
        ],
    }

    expect(isNoteHaveOmissionInHouse(8, { type: HOUSE_TYPE.COL, num: 7 }, mainNumbers, notesData)).toStrictEqual(
        expectedResultFour,
    )

    const expectedResultFive = {
        present: false,
        hostCells: [
            { row: 3, col: 6 },
            { row: 3, col: 7 },
            { row: 4, col: 7 },
        ],
    }

    expect(isNoteHaveOmissionInHouse(8, { type: HOUSE_TYPE.BLOCK, num: 5 }, mainNumbers, notesData)).toStrictEqual(
        expectedResultFive,
    )
})

test('note host cells form valid omission', () => {
    expect(areValidOmissionHostCells([])).toBe(false)

    const testFour = [{ row: 0, col: 0 }]
    expect(areValidOmissionHostCells(testFour)).toBe(false)

    const testOne = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
    ]
    expect(areValidOmissionHostCells(testOne)).toBe(true)

    const testTwo = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 2, col: 2 },
    ]
    expect(areValidOmissionHostCells(testTwo)).toBe(false)

    const testThree = [
        { row: 0, col: 0 },
        { row: 0, col: 5 },
        { row: 0, col: 3 },
    ]
    expect(areValidOmissionHostCells(testThree)).toBe(false)

    const testFive = [
        { row: 4, col: 4 },
        { row: 4, col: 5 },
    ]
    expect(areValidOmissionHostCells(testFive)).toBe(true)
})

test('omission removes notes', () => {
    const { mainNumbers, notesData } = require('./testData')
    mockBoardSelectors(notesData)

    const testOneOmission = {
        hostHouse: { type: HOUSE_TYPE.BLOCK, num: 0 },
        removableNotesHostHouse: { type: HOUSE_TYPE.ROW, num: 2 },
        note: 6,
        hostCells: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
        ],
    }
    expect(omissionRemovesNotes(testOneOmission, mainNumbers, notesData)).toBe(false)

    const testTwoOmission = {
        hostHouse: { type: HOUSE_TYPE.BLOCK, num: 3 },
        removableNotesHostHouse: { type: HOUSE_TYPE.COL, num: 2 },
        note: 3,
        hostCells: [
            { row: 3, col: 2 },
            { row: 4, col: 2 },
        ],
    }
    expect(omissionRemovesNotes(testTwoOmission, mainNumbers, notesData)).toBe(false)

    const testThreeOmission = {
        hostHouse: { type: HOUSE_TYPE.ROW, num: 3 },
        removableNotesHostHouse: { type: HOUSE_TYPE.BLOCK, num: 5 },
        note: 8,
        hostCells: [
            { row: 3, col: 6 },
            { row: 3, col: 7 },
        ],
    }
    expect(omissionRemovesNotes(testThreeOmission, mainNumbers, notesData)).toBe(true)
})
