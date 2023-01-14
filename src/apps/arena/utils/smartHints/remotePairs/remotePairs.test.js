import { mainNumbers, notes, possibleNotes } from './testData'

import { getAllValidCellsWithPairs, getHostCellsForEachNotesPair, deleteInvalidNotesPairsKeys } from './remotePairs'

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

describe('getHostCellsForEachNotesPair()', () => {
    test('returns all host cells for each set of notes pair', () => {
        const cellsWithPairs = [
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
        const expectedResult = {
            57: [{ row: 0, col: 0 }],
            17: [{ row: 0, col: 7 }, { row: 1, col: 4 }, { row: 3, col: 4 }, { row: 5, col: 2 }, { row: 5, col: 3 }],
            67: [{ row: 2, col: 3 }],
            69: [{ row: 2, col: 8 }],
            37: [{ row: 1, col: 2 }, { row: 3, col: 6 }, { row: 4, col: 0 }],
            19: [{ row: 4, col: 8 }],
        }
        expect(getHostCellsForEachNotesPair(cellsWithPairs, notes)).toStrictEqual(expectedResult)
    })
})

describe('deleteInvalidNotesPairsKeys()', () => {
    test('deletes notes pairs keys which has less than 4 host cells', () => {
        const notesPairHostCells = {
            57: [{ row: 0, col: 0 }],
            17: [{ row: 0, col: 7 }, { row: 1, col: 4 }, { row: 3, col: 4 }, { row: 5, col: 2 }, { row: 5, col: 3 }],
            67: [{ row: 2, col: 3 }],
            69: [{ row: 2, col: 8 }],
            37: [{ row: 1, col: 2 }, { row: 3, col: 6 }, { row: 4, col: 0 }],
            19: [{ row: 4, col: 8 }],
        }
        const expectedResult = {
            17: [{ row: 0, col: 7 }, { row: 1, col: 4 }, { row: 3, col: 4 }, { row: 5, col: 2 }, { row: 5, col: 3 }],
        }
        deleteInvalidNotesPairsKeys(notesPairHostCells)
        expect(notesPairHostCells).toStrictEqual(expectedResult)
    })
})
