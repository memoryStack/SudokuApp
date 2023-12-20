import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { getChainCellsNumbers, getRemovableNotesHostCellsByChain } from './chainUtils'

describe('getChainCellsNumbers()', () => {
    // this function expects a chain whose length is odd and which contains alternate STRONG and WEAK links
    test('returns list of cells which make chain from start to end of chain', () => {
        const chain = [
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: true,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 61, type: 'STRONG', isTerminal: false,
            },
            {
                start: 61, end: 56, type: 'WEAK', isTerminal: false,
            },
            {
                start: 56, end: 29, type: 'STRONG', isTerminal: true,
            },
        ]

        expect(getChainCellsNumbers(chain)).toEqual([1, 8, 16, 61, 56, 29])
    })
})

describe('getRemovableNotesHostCellsByChain()', () => {
    test('will return number of notes the given valid chain can remove', () => {
        const chain = [
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: true,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 61, type: 'STRONG', isTerminal: false,
            },
            {
                start: 61, end: 56, type: 'WEAK', isTerminal: false,
            },
            {
                start: 56, end: 29, type: 'STRONG', isTerminal: true,
            },
        ]
        const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const expectedResult = [{ row: 3, col: 1 }]
        expect(getRemovableNotesHostCellsByChain(7, chain, notes)).toEqual(expectedResult)
    })

    test('return 0 if no notes can be removed', () => {
        const chain = [
            {
                start: 1, end: 8, type: 'STRONG', isTerminal: true,
            },
            {
                start: 8, end: 16, type: 'WEAK', isTerminal: false,
            },
            {
                start: 16, end: 61, type: 'STRONG', isTerminal: true,
            },
        ]
        const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)
        expect(getRemovableNotesHostCellsByChain(7, chain, notes)).toEqual([])
    })
})
