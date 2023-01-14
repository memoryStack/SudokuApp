import { mainNumbers, notes, possibleNotes } from './testData'

import { getAllValidCellsWithPairs } from './remotePairs'

jest.mock('../../../../../redux/dispatch.helpers')
jest.mock('../../../store/selectors/board.selectors')

const mockBoardSelectors = () => {
    const { getPossibleNotes } = require('../../../store/selectors/board.selectors')
    const { getStoreState } = require('../../../../../redux/dispatch.helpers')
    getPossibleNotes.mockReturnValue(possibleNotes)
    getStoreState.mockReturnValue({})
}

// TODO: fix these linting errors for test files
describe('getAllValidCellsWithPairs()', () => {
    mockBoardSelectors()
    test('returns all the cells which have only 2 notes in them', () => {
        const expectedResult = [
            { row: 0, col: 0 },
            { row: 0, col: 7 },
            { row: 1, col: 2 },
            { row: 1, col: 4 },
            { row: 2, col: 3 },
            { row: 2, col: 8 },
            { row: 3, col: 4 },
            { row: 3, col: 6 },
            { row: 4, col: 0 },
            { row: 4, col: 8 },
            { row: 5, col: 2 },
            { row: 5, col: 3 },
        ]
        expect(getAllValidCellsWithPairs(mainNumbers, notes)).toStrictEqual(expectedResult)
    })
})
