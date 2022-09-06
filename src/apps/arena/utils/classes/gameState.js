import { GAME_STATE } from '../../../../resources/constants'

export class GameState {
    #state
    constructor(value) {
        if (GameState.isValidValue(value)) {
            this.#state = value
        } else {
            throw new Error(`<${value}> is invalid value for Game State`)
        }
    }

    static isValidValue(value) {
        const validValues = [
            GAME_STATE.ACTIVE,
            GAME_STATE.INACTIVE,
            GAME_STATE.DISPLAY_HINT,
            GAME_STATE.GAME_SELECT,
            GAME_STATE.OVER.SOLVED,
            GAME_STATE.OVER.UNSOLVED,
        ]
        return validValues.includes(value)
    }

    get getGameState() {
        return this.#state
    }

    isGameActive() {
        return this.#state === GAME_STATE.ACTIVE
    }

    isGameInactive() {
        return this.#state === GAME_STATE.INACTIVE
    }

    isGameSolved() {
        return this.#state === GAME_STATE.OVER.SOLVED
    }

    isGameUnsolved() {
        return this.#state === GAME_STATE.OVER.UNSOLVED
    }

    isGameSelecting() {
        return this.#state === GAME_STATE.GAME_SELECT
    }

    isGameOver() {
        return [GAME_STATE.OVER.SOLVED, GAME_STATE.OVER.UNSOLVED].includes(this.#state)
    }
}
