import { getPuzzleDataFromPuzzleString } from '@domain/board/testingUtils/puzzleDataGenerator'

import { getRemovableCandidates } from './hiddenGroup'

describe('getRemovableCandidates()', () => {
    test('returns the notes which will be removed because of hidden tripple in the host cells', () => {
        const puzzle = '000000260009080043500030090000215000350000109180379004800054900004000000005023410'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const hostCells = [
            { row: 0, col: 2 },
            { row: 2, col: 2 },
            { row: 6, col: 2 },
        ]
        const groupCandidates = [1, 3, 8]
        const expectedResult = [2, 6, 7]
        expect(getRemovableCandidates(hostCells, groupCandidates, notes)).toStrictEqual(expectedResult)
    })
})
