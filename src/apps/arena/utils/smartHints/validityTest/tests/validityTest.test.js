/* eslint-disable global-require */
import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { isValidNakedSingle } from '../nakedSingle'
import { isValidHiddenSingle } from '../hiddenSingle'
import { isValidNakedGroup } from '../nakedGroup'
import { isValidHiddenGroup } from '../hiddenGroup'
import { isValidOmission } from '../omission'
import { isValidXWing } from '../xWing'

import { HOUSE_TYPE } from '../../constants'
import { getHouseCells } from '../../../houseCells'
import { LEG_TYPES } from '../../xWing/constants'

jest.mock('../../../../../../redux/dispatch.helpers')
jest.mock('../../../../store/selectors/board.selectors')

const puzzle = '300006002086420009402310006007900520000250107524037000093001240001000003000800670'
const { notes } = getPuzzleDataFromPuzzleString(puzzle)

// eslint-disable-next-line no-unused-vars
const mockBoardSelectors = mockedNotes => {
    const { getPossibleNotes, getNotesInfo } = require('../../../../store/selectors/board.selectors')
    const { getStoreState } = require('../../../../../../redux/dispatch.helpers')
    // mocked notes will be same for user input and possibles notes as well
    getPossibleNotes.mockReturnValue(mockedNotes)
    getNotesInfo.mockReturnValue(mockedNotes)
    getStoreState.mockReturnValue({})
}

describe('isValidNakedSingle()', () => {
    test('returns true for only one possible note in given cell and user also input one note in cell', () => {
        expect(isValidNakedSingle({ cell: { row: 8, col: 2 } }, notes)).toBe(true)
    })

    test('returns false for multiple possible notes in given cell but user input only one of the notes', () => {
        expect(isValidNakedSingle({ cell: { row: 5, col: 3 } }, notes)).toBe(false)
    })
})

describe('isValidHiddenSingle()', () => {
    test('returns true for valid hidden single in block', () => {
        const detectedHiddenSingle = { type: HOUSE_TYPE.BLOCK, cell: { row: 0, col: 2 }, candidate: 9 }
        expect(isValidHiddenSingle(detectedHiddenSingle, notes)).toBe(true)
    })

    test('returns true for valid hidden single in column', () => {
        const detectedHiddenSingle = { type: HOUSE_TYPE.COL, cell: { row: 1, col: 6 }, candidate: 3 }
        expect(isValidHiddenSingle(detectedHiddenSingle, notes)).toBe(true)
    })

    test('returns false for candidate which appears multiple times in house', () => {
        const detectedHiddenSingle = { type: HOUSE_TYPE.COL, cell: { row: 0, col: 1 }, candidate: 1 }
        expect(isValidHiddenSingle(detectedHiddenSingle, notes)).toBe(false)
    })
})

describe('isValidNakedGroup(), naked double', () => {
    // one more instance of writing test-cases. in the "isValidNakedGroup" func, till now groupCandidates
    // were received in an array of strings and it was undetected for 4 months and was working in prod.
    // correct implementation is that is should have been an array of numbers
    test('returns true for only two same candidates possible in two cells of a house', () => {
        const nakedDouble = {
            groupCandidates: [4, 8],
            hostCells: [
                { row: 3, col: 5 },
                { row: 4, col: 5 },
            ],
        }
        expect(isValidNakedGroup(nakedDouble, notes)).toBe(true)
    })

    test('returns false for when user input only two same candidates in two cells but one of the cell cell has an extra possible candidate', () => {
        const nakedDouble = {
            groupCandidates: [5, 7],
            hostCells: [
                { row: 0, col: 1 },
                { row: 0, col: 3 },
            ],
        }
        expect(isValidNakedGroup(nakedDouble, notes)).toBe(false)
    })
})

describe('isValidNakedGroup(), naked tripple', () => {
    test('returns true for only 3 same candidates in three cells of block house, cells can have two candidates as well from group-set', () => {
        const nakedTripple = {
            groupCandidates: [5, 6, 7],
            hostCells: [
                { row: 6, col: 3 },
                { row: 6, col: 5 },
                { row: 7, col: 3 },
            ],
        }
        expect(isValidNakedGroup(nakedTripple, notes)).toBe(true)
    })

    test('returns false for 3 candidates input by user in 3 cells of block house but one of the cells have extra candidates possible as well', () => {
        const nakedTripple = {
            groupCandidates: [6, 7, 8],
            hostCells: [
                { row: 6, col: 0 },
                { row: 7, col: 0 },
                { row: 7, col: 1 },
            ],
        }
        expect(isValidNakedGroup(nakedTripple, notes)).toBe(false)
    })
})

describe('isValidHiddenGroup(), hidden double', () => {
    test('returns true for only two same possible cells for 2 same candidates in block houseType', () => {
        const hiddenDouble = {
            houseType: HOUSE_TYPE.BLOCK,
            groupCandidates: [8, 9],
            hostCells: [
                { row: 0, col: 4 },
                { row: 2, col: 5 },
            ],
        }
        expect(isValidHiddenGroup(hiddenDouble, notes)).toBe(true)
    })

    test('returns false for 2 same candidates input by user in 2 cells of block house but one of the candidate is also possible in one of other cells of the same house', () => {
        const hiddenDouble = {
            groupCandidates: [7, 8],
            hostCells: [
                { row: 6, col: 0 },
                { row: 7, col: 0 },
            ],
        }
        expect(isValidNakedGroup(hiddenDouble, notes)).toBe(false)
    })
})

describe('isValidOmission()', () => {
    test('returns true when all possible cells of a note were input by user in one house and those cells also happens to be the cells of another house', () => {
        const omission = {
            note: 7,
            houseCells: getHouseCells({ type: HOUSE_TYPE.BLOCK, num: 1 }), // TODO: is it a good thing to pass the required data like this ??
            userNotesHostCells: [
                { row: 0, col: 3 },
                { row: 0, col: 4 },
            ],
        }
        expect(isValidOmission(omission, notes)).toBe(true)
    })

    test('returns false when omission is detected by user input but all the possible cells for note in the house were not filled by user', () => {
        const omission = {
            note: 5,
            houseCells: getHouseCells({ type: HOUSE_TYPE.BLOCK, num: 1 }),
            userNotesHostCells: [
                { row: 1, col: 5 },
                { row: 2, col: 5 },
            ],
        }
        expect(isValidOmission(omission, notes)).toBe(false)
    })
})

describe('isValidXWing()', () => {
    // same validity check logic for all the types of X-Wings
    test('returns true for sashimi-finned x-wing detected where candidate is not possible in the cells other than x-wing host cells', () => {
        const xWing = {
            houseType: HOUSE_TYPE.COL,
            legs: [
                {
                    candidate: 5,
                    cells: [
                        { row: 0, col: 2 },
                        { row: 8, col: 2 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 5,
                    cells: [
                        { row: 0, col: 3 },
                        { row: 6, col: 3 },
                        { row: 7, col: 3 },
                    ],
                    type: LEG_TYPES.SASHIMI_FINNED,
                },
            ],
        }

        expect(isValidXWing(xWing, notes)).toBe(true)
    })

    test('returns false for perfect x-wing detected where candidate is possible in the cells other than x-wing host cells but user didn\'t enter them', () => {
        const xWing = {
            houseType: HOUSE_TYPE.ROW,
            legs: [
                {
                    candidate: 5,
                    cells: [
                        { row: 0, col: 1 },
                        { row: 0, col: 2 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 5,
                    cells: [
                        { row: 8, col: 1 },
                        { row: 8, col: 2 },
                    ],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        expect(isValidXWing(xWing, notes)).toBe(false)
    })
})
