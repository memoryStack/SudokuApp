import { GRID_TRAVERSALS } from '../../../constants'
import { HIDDEN_SINGLE_TYPES } from '../constants'
import { getHiddenSinglesRawInfo } from './hiddenSingle'
import { getNextNeighbourBlock } from './uiHighlightData'

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

test('hidden singles', () => {
    const { mainNumbers, notesData } = require('./testData')

    mockBoardSelectors(notesData)

    const hiddenSingles = [
        { cell: { row: 0, col: 3 }, mainNumber: 8, type: HIDDEN_SINGLE_TYPES.ROW },
        { cell: { row: 0, col: 8 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.ROW },
        { cell: { row: 1, col: 6 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.ROW },
        { cell: { row: 2, col: 2 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 2, col: 3 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 3, col: 0 }, mainNumber: 1, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 3, col: 1 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 4, col: 4 }, mainNumber: 4, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 4, col: 5 }, mainNumber: 7, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 4, col: 7 }, mainNumber: 6, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 5, col: 1 }, mainNumber: 9, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 5, col: 8 }, mainNumber: 3, type: HIDDEN_SINGLE_TYPES.COL },
        { cell: { row: 6, col: 8 }, mainNumber: 4, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 7, col: 2 }, mainNumber: 1, type: HIDDEN_SINGLE_TYPES.BLOCK },
        { cell: { row: 7, col: 6 }, mainNumber: 3, type: HIDDEN_SINGLE_TYPES.BLOCK },
    ]
    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getHiddenSinglesRawInfo(mainNumbers, notesData, maxHintsThreshold)).toStrictEqual(hiddenSingles)
})

describe('getNextNeighbourBlock()', () => {
    test('takes two arguments ', () => {
        getNextNeighbourBlock(
            1, // current block number in [0..n] format
            GRID_TRAVERSALS.ROW, // direction to search in for next block
        )
    })

    test('returns next block in right to the current block when passed direction is row', () => {
        expect(getNextNeighbourBlock(1, GRID_TRAVERSALS.ROW)).toBe(2)
    })

    test('returns next block in bottom to the current block when passed direction is column', () => {
        expect(getNextNeighbourBlock(1, GRID_TRAVERSALS.COL)).toBe(4)
    })

    test('returns next block in a cyclic manner', () => {
        expect(getNextNeighbourBlock(2, GRID_TRAVERSALS.ROW)).toBe(0)
        expect(getNextNeighbourBlock(7, GRID_TRAVERSALS.COL)).toBe(1)
    })
})
