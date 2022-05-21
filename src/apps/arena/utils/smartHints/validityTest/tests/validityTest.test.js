import { isValidNakedSingle } from '../nakedSingle'
// import { isValidNakedSingle } from '../hiddenSingle'
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
    test('returns true for only one possible note in given cell', () => {
        const { notesInfo } = require('./testData')
        expect(isValidNakedSingle({ cell: { row: 8, col: 2 } }, notesInfo, notesInfo)).toBe(true)
    })

    test('returns false for multiple possible notes in given cell', () => {
        const { notesInfo } = require('./testData')
        expect(isValidNakedSingle({ cell: { row: 5, col: 3 } }, notesInfo, notesInfo)).toBe(false)
    })

})
