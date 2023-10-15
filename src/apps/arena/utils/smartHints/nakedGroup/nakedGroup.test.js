import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'

import { makeTestStore } from '../../../../../utils/testing/testingBoilerplate/makeReduxStore'
import boardReducers, { boardActions } from '../../../store/reducers/board.reducers'
import { HOUSE_TYPE } from '../constants'
import {
    filterNakedGroupEligibleCellsInHouse,
    getNakedGroupRawHints,
    getCellsVisibleNotesInstancesCount,
    selectedCellsMakeGroup,
    isHintRemovesNotesFromCells,
} from './nakedGroup'

const { setPossibleNotes } = boardActions

describe('getNakedGroupRawHints()', () => {
    const store = makeTestStore({ board: boardReducers })
    const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
    const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle)

    store.dispatch(setPossibleNotes(notes))
    test('returns selected cells of naked group in an array', () => {
        const expectedResult = [
            {
                groupCells: [
                    { row: 0, col: 2 },
                    { row: 0, col: 1 },
                ],
            },
        ]
        expect(getNakedGroupRawHints(2, notes, mainNumbers)).toStrictEqual(expectedResult)
    })
})

describe('filterNakedGroupEligibleCellsInHouse()', () => {
    test('returns valid cells in first row for Naked Double', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle)

        const house = { type: HOUSE_TYPE.ROW, num: 0 }
        const expectedValidCells = [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
        ]
        const groupCandidatesCount = 2
        expect(filterNakedGroupEligibleCellsInHouse(house, groupCandidatesCount, mainNumbers, notes)).toStrictEqual(
            expectedValidCells,
        )
    })

    test('returns empty array if there are no valid cells in house', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(puzzle)

        const house = { type: HOUSE_TYPE.ROW, num: 2 }
        const groupCandidatesCount = 2
        expect(filterNakedGroupEligibleCellsInHouse(house, groupCandidatesCount, mainNumbers, notes)).toStrictEqual(
            [],
        )
    })
})

describe('getCellsVisibleNotesInstancesCount()', () => {
    test('returns map of note with its instances count in row cells', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 0, col: 1 },
            { row: 3, col: 1 },
        ]
        const expectedResult = { 5: 1, 4: 1, 8: 2 }
        expect(getCellsVisibleNotesInstancesCount(cells, notes)).toStrictEqual(expectedResult)
    })

    test('returns map of note with its instances count in block cells', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 5, col: 3 },
            { row: 3, col: 4 },
        ]
        const expectedResult = {
            2: 1, 4: 2, 5: 1, 6: 1, 8: 2, 9: 1,
        }
        expect(getCellsVisibleNotesInstancesCount(cells, notes)).toStrictEqual(expectedResult)
    })

    test('returns empty object if there are no notes in any cell', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 0, col: 3 },
            { row: 0, col: 4 },
        ]
        expect(getCellsVisibleNotesInstancesCount(cells, notes)).toStrictEqual({})
    })
})

describe('selectedCellsMakeGroup()', () => {
    test('returns true when passed cells have Naked Group', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 1, col: 8 },
            { row: 2, col: 8 },
            { row: 2, col: 7 },
        ]
        expect(selectedCellsMakeGroup(cells, notes, 3)).toBeTruthy()
    })

    test('returns false when passed cells doesnt have Naked Group', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 7, col: 4 },
            { row: 7, col: 5 },
            { row: 8, col: 5 },
        ]
        expect(selectedCellsMakeGroup(cells, notes, 3)).toBeFalsy()
    })
})

describe('isHintRemovesNotesFromCells()', () => {
    test('returns true when Valid Naked Group removes some notes in house', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
        ]
        expect(isHintRemovesNotesFromCells(cells, notes)).toBeTruthy()
    })

    test('returns true when Valid Naked Group doesnt removes notes in house', () => {
        const puzzle = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'
        const { notes } = getPuzzleDataFromPuzzleString(puzzle)

        const cells = [
            { row: 1, col: 8 },
            { row: 2, col: 8 },
            { row: 2, col: 7 },
        ]
        expect(isHintRemovesNotesFromCells(cells, notes)).toBeFalsy()
    })
})
