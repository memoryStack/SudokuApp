import {
    getTimeComponentString,
    isGameOver,
    shouldSaveGameState,
    areSameCells,
    areSameBlockCells,
    areSameRowCells,
    areSameColCells,
} from '../util'
import { GAME_STATE } from '../../../../resources/constants'

describe('time component value formatter', () => {
    test('getTimeComponentString test 1', () => {
        expect(getTimeComponentString(0)).toBe('00')
    })

    test('getTimeComponentString test 2', () => {
        expect(getTimeComponentString(11)).toBe('11')
    })

    test('getTimeComponentString test 3', () => {
        expect(getTimeComponentString(1)).toBe('01')
    })
})

describe('is game over', () => {
    test('isGameOver test 1', () => {
        expect(isGameOver(GAME_STATE.ACTIVE)).toBe(false)
    })

    test('isGameOver test 2', () => {
        expect(isGameOver(GAME_STATE.INACTIVE)).toBe(false)
    })

    test('isGameOver test 3', () => {
        expect(isGameOver(GAME_STATE.OVER.SOLVED)).toBe(true)
    })

    test('isGameOver test 4', () => {
        expect(isGameOver(GAME_STATE.OVER.UNSOLVED)).toBe(true)
    })
})

describe('should cache game data', () => {
    // if game is over then it will always save the state
    test('shouldSaveGameState test 1', () => {
        expect(shouldSaveGameState(GAME_STATE.OVER.SOLVED)).toBe(true)
    })

    test('shouldSaveGameState test 2', () => {
        expect(shouldSaveGameState(GAME_STATE.OVER.UNSOLVED)).toBe(true)
    })

    test('shouldSaveGameState test 3', () => {
        expect(shouldSaveGameState(GAME_STATE.ACTIVE, GAME_STATE.INACTIVE)).toBe(false)
    })

    test('shouldSaveGameState test 4', () => {
        expect(shouldSaveGameState(GAME_STATE.INACTIVE, GAME_STATE.ACTIVE)).toBe(true)
    })
})

describe('are same cells', () => {
    test('areSameCells test 1', () => {
        const cellA = { row: 2, col: 2 }
        const cellB = { row: 2, col: 2 }
        expect(areSameCells(cellA, cellB)).toBe(true)
    })

    test('areSameCells test 2', () => {
        const cellA = { row: 2, col: 2 }
        const cellB = { row: 2, col: 3 }
        expect(areSameCells(cellA, cellB)).toBe(false)
    })

    test('areSameCells test 3', () => {
        const cellA = { row: 1, col: 2 }
        const cellB = { row: 3, col: 4 }
        expect(areSameCells(cellA, cellB)).toBe(false)
    })

    test('areSameCells test 4', () => {
        const cellA = { row: 5, col: 8 }
        const cellB = { row: 8, col: 8 }
        expect(areSameCells(cellA, cellB)).toBe(false)
    })
})

describe('are same block cells', () => {
    test('areSameBlockCells test 1', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 2, col: 0 },
        ]
        expect(areSameBlockCells(cells)).toBe(true)
    })

    test('areSameBlockCells test 2', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 2, col: 5 },
        ]
        expect(areSameBlockCells(cells)).toBe(false)
    })

    test('areSameBlockCells test 3', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 3, col: 3 },
            { row: 7, col: 7 },
        ]
        expect(areSameBlockCells(cells)).toBe(false)
    })
})

describe('are same row cells', () => {
    test('areSameRowCells test 1', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
        ]
        expect(areSameRowCells(cells)).toBe(true)
    })

    test('areSameRowCells test 2', () => {
        const cells = [
            { row: 0, col: 0 },
            { row: 0, col: 3 },
            { row: 0, col: 7 },
        ]
        expect(areSameRowCells(cells)).toBe(true)
    })

    test('areSameRowCells test 3', () => {
        const cells = [
            { row: 3, col: 5 },
            { row: 3, col: 3 },
            { row: 4, col: 7 },
        ]
        expect(areSameRowCells(cells)).toBe(false)
    })
})

describe('are same col cells', () => {
    test('areSameColCells test 1', () => {
        const cells = [
            { row: 0, col: 3 },
            { row: 4, col: 3 },
            { row: 8, col: 3 },
        ]
        expect(areSameColCells(cells)).toBe(true)
    })

    test('areSameColCells test 2', () => {
        const cells = [
            { row: 4, col: 4 },
            { row: 6, col: 4 },
            { row: 8, col: 4 },
        ]
        expect(areSameColCells(cells)).toBe(true)
    })

    test('areSameColCells test 3', () => {
        const cells = [
            { row: 3, col: 6 },
            { row: 3, col: 7 },
            { row: 4, col: 7 },
        ]
        expect(areSameColCells(cells)).toBe(false)
    })
})

describe('two arrays same values', () => {
    test('test 1', () => {
        const arrayA = [1, 2]
        const arrayB = [1]
        expect(arrayA.sameArrays(arrayB)).toBe(false)
    })

    test('test 2', () => {
        const arrayA = [1, 2]
        const arrayB = [1, 3]
        expect(arrayA.sameArrays(arrayB)).toBe(false)
    })

    test('test 2', () => {
        const arrayA = [1, 2]
        const arrayB = [1, 2]
        expect(arrayA.sameArrays(arrayB)).toBe(true)
    })
})
