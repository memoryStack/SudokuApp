import { areSameCellsSets } from "../util";
import { getDisjointSets } from "./outlinePath";

describe('getDisjointSets()', () => {
    test('returns set as it is when only one disjoint set is present', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
        ]
        expect(areSameCellsSets(cells, getDisjointSets(cells))).toBeTruthy()
    })
})