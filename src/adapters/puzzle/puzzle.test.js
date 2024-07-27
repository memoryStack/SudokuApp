import { transformNativeGeneratedPuzzle } from './nativeGeneratedPuzzleTransformer'
import { Puzzle } from './puzzle'

jest.mock('./puzzle')

test('Puzzle.validatePuzzle()', () => {
    const puzzle = '615030700000790010040005030000523090520000008400068000306080970200479006974356281'

    const expectedResult = {
        count: 1,
        solution: [4, 6, 9, 3, 2, 5, 7, 8, 1, 3, 2, 5, 7, 1, 8, 4, 6, 9, 7, 8, 1, 4, 6, 9, 3, 2, 5, 6, 4, 3, 9, 5, 2, 8, 1, 7, 9, 5, 2, 8, 7, 1, 6, 4, 3, 8, 1, 7, 6, 4, 3, 9, 5, 2, 2, 9, 4, 5, 3, 6, 1, 7, 8, 5, 3, 6, 1, 8, 7, 2, 9, 4, 1, 7, 8, 2, 9, 4, 5, 3, 6],
    }

    return expect(Puzzle.validatePuzzle(puzzle)).resolves.toEqual(expectedResult)
})

// TODO: this test-case is tapping into implementation details
test('Puzzle.getSudokuPuzzle()', () => {
    const minClues = 30

    const expectedResult = transformNativeGeneratedPuzzle({
        clues: [9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 7, 0, 6, 1, 0, 2, 7, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 1, 0, 0, 9, 0, 6, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 5, 0, 1, 4, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2],
        solution: [9, 2, 7, 5, 3, 8, 4, 6, 1, 5, 3, 8, 1, 6, 4, 9, 2, 7, 4, 6, 1, 9, 2, 7, 5, 3, 8, 2, 9, 5, 7, 8, 3, 6, 1, 4, 7, 8, 3, 4, 1, 6, 2, 9, 5, 6, 1, 4, 2, 9, 5, 7, 8, 3, 3, 7, 9, 8, 5, 2, 1, 4, 6, 8, 5, 2, 6, 4, 1, 3, 7, 9, 1, 4, 6, 3, 7, 9, 8, 5, 2],
    })

    return expect(Puzzle.getSudokuPuzzle(minClues)).resolves.toEqual(expectedResult)
})
