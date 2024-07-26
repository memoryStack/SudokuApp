import { GAME_STATE } from '../constants'

export class GameState {
    private state: GAME_STATE

    constructor(value: GAME_STATE) {
        this.state = value
    }

    get getGameState() {
        return this.state
    }

    isGameActive() {
        return this.state === GAME_STATE.ACTIVE
    }

    isGameInactive() {
        return this.state === GAME_STATE.INACTIVE
    }

    isGameSolved() {
        return this.state === GAME_STATE.OVER_SOLVED
    }

    isGameUnsolved() {
        return this.state === GAME_STATE.OVER_UNSOLVED
    }

    isGameSelecting() {
        return this.state === GAME_STATE.GAME_SELECT
    }

    isGameOver() {
        return [GAME_STATE.OVER_SOLVED, GAME_STATE.OVER_UNSOLVED].includes(this.state)
    }
}
