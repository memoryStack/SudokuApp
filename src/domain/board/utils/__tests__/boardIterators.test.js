import { BoardIterators } from '../boardIterators'

describe('BoardIterators.forCellEachNote()', () => {
    test('calls the callback 9 times, once for each note', () => {
        const mockCallback = jest.fn()
        BoardIterators.forCellEachNote(mockCallback)
        expect(mockCallback.mock.calls.length).toBe(9)
    })
})

describe('BoardIterators.forBoardEachCell()', () => {
    test('calls the callback 81 times, oncefor each cell', () => {
        const mockCallback = jest.fn()
        BoardIterators.forBoardEachCell(mockCallback)
        expect(mockCallback.mock.calls.length).toBe(81)
    })
})
