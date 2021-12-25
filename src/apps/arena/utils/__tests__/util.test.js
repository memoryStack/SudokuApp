import { getTimeComponentString, isGameOver } from '../util'
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
