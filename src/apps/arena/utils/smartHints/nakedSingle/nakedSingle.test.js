import { getNakedSinglesRawInfo } from './nakedSingle'
import { NAKED_SINGLE_TYPES } from '../constants'

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

test('naked singles', () => {
    const { mainNumbersTestOne, notesDataTestOne } = require('./nakedSingleTestData')

    mockBoardSelectors(notesDataTestOne)

    // TODO: order of records is coupled with the algorithm implementation
    // how to decouple this in any way ??
    // TODO: another test case would be better with a mix of types. here all type are MIX
    const nakedSinglesData = [
        { cell: { row: 1, col: 0 }, mainNumber: 8, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 2, col: 4 }, mainNumber: 1, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 6, col: 1 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 7, col: 7 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 8, col: 4 }, mainNumber: 5, type: NAKED_SINGLE_TYPES.MIX },
        { cell: { row: 8, col: 5 }, mainNumber: 6, type: NAKED_SINGLE_TYPES.MIX },
    ]
    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getNakedSinglesRawInfo(mainNumbersTestOne, notesDataTestOne, maxHintsThreshold)).toStrictEqual(
        nakedSinglesData,
    )
})
