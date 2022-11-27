import { GRID_TRAVERSALS } from "../../../../constants"

import { getNextNeighbourBlock } from "./hiddenSingle"

describe('getNextNeighbourBlock()', () => {
    test('takes two arguments ', () => {
        getNextNeighbourBlock(
            1, // current block number in [0..n] format
            GRID_TRAVERSALS.ROW, // direction to search in for next block
        )
    })

    test('returns next block in right to the current block when passed direction is row', () => {
        expect(getNextNeighbourBlock(1, GRID_TRAVERSALS.ROW)).toBe(2)
    })

    test('returns next block in bottom to the current block when passed direction is column', () => {
        expect(getNextNeighbourBlock(1, GRID_TRAVERSALS.COL)).toBe(4)
    })

    test('returns next block in a cyclic manner', () => {
        expect(getNextNeighbourBlock(2, GRID_TRAVERSALS.ROW)).toBe(0)
        expect(getNextNeighbourBlock(7, GRID_TRAVERSALS.COL)).toBe(1)
    })
})