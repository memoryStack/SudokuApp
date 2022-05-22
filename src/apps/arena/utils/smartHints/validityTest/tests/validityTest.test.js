import { isValidNakedSingle } from '../nakedSingle'
import { isValidHiddenSingle } from '../hiddenSingle'
import { isValidNakedGroup } from '../nakedGroup'
// import { isValidNakedSingle } from '../nakedSingle'
// import { isValidNakedSingle } from '../nakedSingle'
import { HOUSE_TYPE } from '../../constants'

jest.mock('../../../../../../redux/dispatch.helpers')
jest.mock('../../../../store/selectors/board.selectors')

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
        const { notesInfo } = require('./testData')
        expect(isValidNakedSingle({ cell: { row: 8, col: 2 } }, notesInfo, notesInfo)).toBe(true)
    })

    test('returns false for multiple possible notes in given cell but user input only one of the notes', () => {
        const { notesInfo } = require('./testData')
        expect(isValidNakedSingle({ cell: { row: 5, col: 3 } }, notesInfo, notesInfo)).toBe(false)
    })
})

describe('isValidHiddenSingle()', () => {

    test('returns true for valid hidden single in block', () => {
        const { notesInfo } = require('./testData')
        const detectedHiddenSingle = { type: HOUSE_TYPE.BLOCK, cell: { row: 0, col: 2 }, candidate: 9 }
        expect(isValidHiddenSingle(detectedHiddenSingle, notesInfo, notesInfo)).toBe(true)
    })

    test('returns true for valid hidden single in column', () => {
        const { notesInfo } = require('./testData')
        const detectedHiddenSingle = { type: HOUSE_TYPE.COL, cell: { row: 1, col: 6 }, candidate: 3 }
        expect(isValidHiddenSingle(detectedHiddenSingle, notesInfo, notesInfo)).toBe(true)
    })

    test('returns false for candidate which appears multiple times in house', () => {
        const { notesInfo } = require('./testData')
        const detectedHiddenSingle = { type: HOUSE_TYPE.COL, cell: { row: 0, col: 1 }, candidate: 1 }
        expect(isValidHiddenSingle(detectedHiddenSingle, notesInfo, notesInfo)).toBe(false)
    })

})

describe('isValidNakedGroup()', () => {
    // one more instance of writing test-cases. in the "isValidNakedGroup" func, till now groupCandidates
    // were received in an array of strings and it was undetected for 4 months and was working in prod.
    // correct implementation is that is should have been an array of numbers
    test('returns true for only two same candidates possible in two cells of a house', () => {
        const { notesInfo } = require('./testData')
        const nakedDouble = {
            groupCandidates: [4, 8],
            hostCells: [{ row: 3, col: 5 }, { row: 4, col: 5 }],
        }
        expect(isValidNakedGroup(nakedDouble, notesInfo, notesInfo)).toBe(true)
    })

    test('returns false for when user input only two same candidates in two cells but one of the cell cell has an extra possible candidate', () => {
        const { notesInfo } = require('./testData')
        const nakedDouble = {
            groupCandidates: [5, 7],
            hostCells: [{ row: 0, col: 1 }, { row: 0, col: 3 }],
        }
        expect(isValidNakedGroup(nakedDouble, notesInfo, notesInfo)).toBe(false)
    })

})
