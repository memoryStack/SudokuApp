import { getTimeComponentString, isGameOver, shouldSaveGameState } from '../util'
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
        expect(isGameOver(GAME_STATE.OVER_SOLVED)).toBe(true)
    })

    test('isGameOver test 4', () => {
        expect(isGameOver(GAME_STATE.OVER_UNSOLVED)).toBe(true)
    })
})

describe('should cache game data', () => {
    // if game is over then it will always save the state
    test('shouldSaveGameState test 1', () => {
        expect(shouldSaveGameState(GAME_STATE.OVER_SOLVED)).toBe(true)
    })

    test('shouldSaveGameState test 2', () => {
        expect(shouldSaveGameState(GAME_STATE.OVER_UNSOLVED)).toBe(true)
    })

    test('shouldSaveGameState test 3', () => {
        expect(shouldSaveGameState(GAME_STATE.ACTIVE, GAME_STATE.INACTIVE)).toBe(false)
    })

    test('shouldSaveGameState test 4', () => {
        expect(shouldSaveGameState(GAME_STATE.INACTIVE, GAME_STATE.ACTIVE)).toBe(true)
    })
})
