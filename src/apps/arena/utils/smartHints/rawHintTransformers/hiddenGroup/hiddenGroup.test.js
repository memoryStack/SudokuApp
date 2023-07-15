/* eslint-disable global-require */
import { getRemovableCandidates } from './hiddenGroup'

describe('getRemovableCandidates()', () => {
    test('returns the notes which will be removed because of hidden tripple in the host cells', () => {
        const { notesData } = require('../../hiddenGroup/hiddenTripple.testData')
        const hostCells = [
            { row: 0, col: 2 },
            { row: 2, col: 2 },
            { row: 6, col: 2 },
        ]
        const groupCandidates = [1, 3, 8]
        const expectedResult = [2, 6, 7]
        expect(getRemovableCandidates(hostCells, groupCandidates, notesData)).toStrictEqual(expectedResult)
    })
})
