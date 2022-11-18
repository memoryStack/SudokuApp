import { GAME_STATE } from '../../../../../resources/constants'
import { GameState } from '../gameState'

describe('GameState class', () => {
    test('creates a valid gameState object', () => {
        expect(new GameState(GAME_STATE.ACTIVE)).toBeInstanceOf(GameState)
    })

    // TODO: why this exception throw test is skipped ??
    test.skip('throws exception when initialized with invalid value', () => {
        expect(() => new GameState('sleeping')).toThrow(Error)
    })

    test('isValidValue static method checks validity of passed value to initialize', () => {
        expect(GameState.isValidValue('invalid')).toBeFalsy()
        expect(GameState.isValidValue('')).toBeFalsy()
        expect(GameState.isValidValue(null)).toBeFalsy()
        expect(GameState.isValidValue(undefined)).toBeFalsy()
        expect(GameState.isValidValue()).toBeFalsy()
        expect(GameState.isValidValue(GAME_STATE.ACTIVE)).toBeTruthy()
    })

    test('getGameState getter returns state with which object was initialised', () => {
        const gameState = new GameState(GAME_STATE.ACTIVE)
        expect(gameState.getGameState).toBe(GAME_STATE.ACTIVE)
    })

    test('isGameActive method returns true when game is active', () => {
        expect(new GameState(GAME_STATE.ACTIVE).isGameActive()).toBeTruthy()
        expect(new GameState(GAME_STATE.GAME_SELECT).isGameActive()).toBeFalsy()
    })

    test('isGameInactive method returns true when game is inActive or paused', () => {
        expect(new GameState(GAME_STATE.INACTIVE).isGameInactive()).toBeTruthy()
        expect(new GameState(GAME_STATE.ACTIVE).isGameInactive()).toBeFalsy()
    })

    test('isGameSolved method returns true when game is over and is solved', () => {
        expect(new GameState(GAME_STATE.OVER.SOLVED).isGameSolved()).toBeTruthy()
        expect(new GameState(GAME_STATE.ACTIVE).isGameSolved()).toBeFalsy()
    })

    test('isGameUnsolved method returns true when game is over and is unsolved', () => {
        expect(new GameState(GAME_STATE.OVER.UNSOLVED).isGameUnsolved()).toBeTruthy()
        expect(new GameState(GAME_STATE.OVER.SOLVED).isGameUnsolved()).toBeFalsy()
    })

    test('isGameSelecting method returns true when use is choosing game', () => {
        expect(new GameState(GAME_STATE.GAME_SELECT).isGameSelecting()).toBeTruthy()
        expect(new GameState(GAME_STATE.INACTIVE).isGameSelecting()).toBeFalsy()
    })

    test('isGameOver method returns true when game is over', () => {
        expect(new GameState(GAME_STATE.OVER.UNSOLVED).isGameOver()).toBeTruthy()
        expect(new GameState(GAME_STATE.OVER.SOLVED).isGameOver()).toBeTruthy()
        expect(new GameState(GAME_STATE.INACTIVE).isGameOver()).toBeFalsy()
    })
})
