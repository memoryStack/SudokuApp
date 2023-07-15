/* eslint-disable global-require */
import { HOUSE_TYPE } from '../constants'
import { getHiddenGroupRawHints, validCandidatesInHouseAndTheirLocations } from './hiddenGroup'

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

test('hidden doubles valid candidates test 1', () => {
    const { mainNumbers, notesData } = require('./testData')
    mockBoardSelectors(notesData)

    const expectedResult = [
        {
            candidate: 5,
            hostCells: [
                { row: 5, col: 3 },
                { row: 5, col: 5 },
            ],
        },
    ]
    expect(
        validCandidatesInHouseAndTheirLocations({ type: HOUSE_TYPE.BLOCK, num: 4 }, 2, mainNumbers, notesData),
    ).toStrictEqual(expectedResult)
})

test('hidden doubles valid candidates test 2', () => {
    const { mainNumbers, notesData } = require('./testData')
    mockBoardSelectors(notesData)
    const expectedResult = [
        {
            candidate: 4,
            hostCells: [
                { row: 3, col: 1 },
                { row: 5, col: 1 },
            ],
        },
        {
            candidate: 6,
            hostCells: [
                { row: 4, col: 2 },
                { row: 5, col: 1 },
            ],
        },
    ]
    expect(
        validCandidatesInHouseAndTheirLocations({ type: HOUSE_TYPE.BLOCK, num: 3 }, 2, mainNumbers, notesData),
    ).toStrictEqual(expectedResult)
})

test('hidden doubles', () => {
    // TODO: doesn't look like the notesData is related to the mainNumbers in the file
    // the notesData here is actually from this hiddenTrippleTestData file
    const { mainNumbers, notesData } = require('./testData')
    mockBoardSelectors(notesData)
    // TODO: order of records is coupled with the algorithm implementation
    // how to decouple this in any way ??
    const expectedResult = [
        {
            house: { type: HOUSE_TYPE.ROW, num: 2 },
            groupCandidates: [3, 2],
            groupCells: [
                { row: 2, col: 7 },
                { row: 2, col: 8 },
            ],
        },
    ]
    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getHiddenGroupRawHints(2, notesData, mainNumbers, maxHintsThreshold)).toStrictEqual(expectedResult)
})

test('hidden tripples', () => {
    const { mainNumbers, notesData } = require('./hiddenTripple.testData')
    mockBoardSelectors(notesData)
    // TODO: order of records is coupled with the algorithm implementation
    // how to decouple this in any way ??

    // TODO: order is messed up in these hints. can't use array for the inputs.
    // for now just using the returned order by the algorithm
    const expectedResult = [
        {
            house: { type: HOUSE_TYPE.COL, num: 2 },
            groupCandidates: [8, 3, 1],
            groupCells: [
                { row: 0, col: 2 },
                { row: 2, col: 2 },
                { row: 6, col: 2 },
            ],
        },
    ]
    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getHiddenGroupRawHints(3, notesData, mainNumbers, maxHintsThreshold)).toStrictEqual(expectedResult)
})

test('hidden tripples duplicate houses with same group cells', () => {
    // TODO: break down this test data file
    const { mainNumbers, multipleHousesHiddenGroupNotesData } = require('./hiddenTripple.testData')
    mockBoardSelectors(multipleHousesHiddenGroupNotesData)
    // TODO: order of records is coupled with the algorithm implementation
    // DANGER: violating the rule of TDD
    // how to decouple this in any way ??

    // TODO: order is messed up in these hints. can't use array for the inputs.
    // for now just using the returned order by the algorithm.
    const expectedResult = [
        {
            house: { type: HOUSE_TYPE.BLOCK, num: 4 },
            groupCandidates: [8, 6, 4],
            groupCells: [
                { row: 4, col: 3 },
                { row: 4, col: 5 },
                { row: 4, col: 4 },
            ],
        },
        {
            house: { type: HOUSE_TYPE.COL, num: 2 },
            groupCandidates: [8, 3, 1],
            groupCells: [
                { row: 0, col: 2 },
                { row: 2, col: 2 },
                { row: 6, col: 2 },
            ],
        },
        {
            house: { type: HOUSE_TYPE.COL, num: 4 },
            groupCandidates: [9, 6, 4],
            groupCells: [
                { row: 0, col: 4 },
                { row: 7, col: 4 },
                { row: 4, col: 4 },
            ],
        },
    ]
    const maxHintsThreshold = Number.POSITIVE_INFINITY
    expect(getHiddenGroupRawHints(3, multipleHousesHiddenGroupNotesData, mainNumbers, maxHintsThreshold)).toStrictEqual(
        expectedResult,
    )
})
