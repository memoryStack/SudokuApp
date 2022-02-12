import { HOUSE_TYPE } from '../../smartHint'
import { getAllHiddenGroups, validCandidatesInHouseAndTheirLocations } from './hiddenGroup'

test('hidden doubles valid candidates test 1', () => {
    const { mainNumbers, notesData } = require('./testData')
    const expectedResult = [
        {
            candidate: 5,
            hostCells: [
                { row: 5, col: 3 },
                { row: 5, col: 5 },
            ],
        },
    ]
    expect(validCandidatesInHouseAndTheirLocations(HOUSE_TYPE.BLOCK, 4, 2, mainNumbers, notesData)).toStrictEqual(
        expectedResult,
    )
})

test('hidden doubles valid candidates test 2', () => {
    const { mainNumbers, notesData } = require('./testData')
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
    expect(validCandidatesInHouseAndTheirLocations(HOUSE_TYPE.BLOCK, 3, 2, mainNumbers, notesData)).toStrictEqual(
        expectedResult,
    )
})

test('hidden doubles', () => {
    const { mainNumbers, notesData } = require('./testData')
    // TODO: order of records is coupled with the algorithm implementation
    // how to decouple this in any way ??
    const expectedResult = [
        {
            house: { type: HOUSE_TYPE.ROW, num: 0 },
            groupCandidates: [8, 5],
            groupCells: [
                { row: 0, col: 1 },
                { row: 0, col: 2 },
            ],
        },
        {
            house: { type: HOUSE_TYPE.ROW, num: 2 },
            groupCandidates: [3, 2],
            groupCells: [
                { row: 2, col: 7 },
                { row: 2, col: 8 },
            ],
        },
    ]
    expect(getAllHiddenGroups(2, notesData, mainNumbers)).toStrictEqual(expectedResult)
})
