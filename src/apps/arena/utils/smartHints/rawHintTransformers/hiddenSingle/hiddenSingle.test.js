/* eslint-disable global-require */
import { GRID_TRAVERSALS } from '../../../../constants'
import { HOUSE_TYPE } from '../../constants'

import {
    getNextNeighbourBlock,
    shouldHighlightWinnerCandidateInstanceInBlock,
    getCellFilledWithNumberInHouse,
} from './hiddenSingle'

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

describe('shouldHighlightWinnerCandidateInstanceInBlock()', () => {
    test('returns true if host house and block house have some empty common cells', () => {
        const { mainNumbers } = require('./hiddenSingle.testData')
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 6 }
        const hostHouse = { type: HOUSE_TYPE.COL, num: 0 }

        expect(shouldHighlightWinnerCandidateInstanceInBlock(hostHouse, blockHouse, mainNumbers)).toBeTruthy()
    })

    test('returns false if host house and block house have no empty empty common cells', () => {
        const { mainNumbers } = require('./hiddenSingle.testData')
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 1 }
        const hostHouse = { type: HOUSE_TYPE.ROW, num: 0 }

        expect(shouldHighlightWinnerCandidateInstanceInBlock(hostHouse, blockHouse, mainNumbers)).toBeFalsy()
    })
})

describe('getCellFilledWithNumberInHouse()', () => {
    test('returns true if host house and block house have some empty common cells', () => {
        const { mainNumbers } = require('./hiddenSingle.testData')
        const number = 8
        const blockHouse = { type: HOUSE_TYPE.BLOCK, num: 6 }
        expect(getCellFilledWithNumberInHouse(number, blockHouse, mainNumbers)).toEqual({ row: 6, col: 2 })
    })
})
