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
