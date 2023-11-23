/*
    PS: look if any util can be used or not

    done
    get all the cells which have only two notes in them

    done
    prepare the DS about which note is where in which house

    generate chain

    identify it's removable candidates host cells

*/

//
import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { getAllValidCellsWithPairs, getNotesVSHostCellsMap } from './xyChain'

describe('getAllValidCellsWithPairs()', () => {
    const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
    const { mainNumbers, notes, possibleNotes } = getPuzzleDataFromPuzzleString(puzzle)

    test('returns all the cells which have only 2 notes in them', () => {
        const expectedResult = [
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 2, col: 4 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
            { row: 3, col: 6 },
            { row: 3, col: 8 },
            { row: 4, col: 3 },
            { row: 4, col: 4 },
            { row: 4, col: 5 },
            { row: 6, col: 3 },
            { row: 6, col: 4 },
            { row: 6, col: 5 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
        ]

        expect(getAllValidCellsWithPairs(mainNumbers, notes, possibleNotes)).toStrictEqual(expectedResult)
    })
})

describe('getNotesVSHostCellsMap()', () => {
    const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'
    const { notes } = getPuzzleDataFromPuzzleString(puzzle)

    test('returns a map of notes present in passed cells and their host cells', () => {
        const cells = [
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 2, col: 4 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
            { row: 3, col: 6 },
            { row: 3, col: 8 },
            { row: 4, col: 3 },
            { row: 4, col: 4 },
            { row: 4, col: 5 },
            { row: 6, col: 3 },
            { row: 6, col: 4 },
            { row: 6, col: 5 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
        ]

        const expectedResult = {
            1: [{ row: 1, col: 3 }, { row: 2, col: 6 }, { row: 3, col: 6 }, { row: 3, col: 8 }],
            2: [{ row: 1, col: 4 }, { row: 1, col: 5 }, { row: 4, col: 4 }, { row: 4, col: 5 }],
            3: [{ row: 1, col: 3 }, { row: 1, col: 5 }, { row: 2, col: 7 }, { row: 6, col: 3 }, { row: 6, col: 5 }, { row: 7, col: 7 }, { row: 7, col: 8 }],
            5: [{ row: 2, col: 4 }, { row: 6, col: 4 }, { row: 6, col: 5 }],
            6: [{ row: 1, col: 4 }, { row: 2, col: 4 }, { row: 2, col: 6 }, { row: 2, col: 7 }, { row: 3, col: 6 }, { row: 3, col: 8 }, { row: 7, col: 7 }, { row: 7, col: 8 }],
            8: [{ row: 4, col: 3 }, { row: 4, col: 5 }],
            9: [{ row: 4, col: 3 }, { row: 4, col: 4 }, { row: 6, col: 3 }, { row: 6, col: 4 }],
        }

        expect(getNotesVSHostCellsMap(cells, notes)).toStrictEqual(expectedResult)
    })
})
