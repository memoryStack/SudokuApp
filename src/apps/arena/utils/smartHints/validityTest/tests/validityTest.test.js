import { isValidNakedSingle } from '../nakedSingle'
import { isValidHiddenSingle } from '../hiddenSingle'
import { HOUSE_TYPE } from '../../constants'
// import { isValidNakedSingle } from '../nakedSingle'
// import { isValidNakedSingle } from '../nakedSingle'
// import { isValidNakedSingle } from '../nakedSingle'

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
