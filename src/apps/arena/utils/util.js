
import { GAME_STATE } from '../../../resources/constants'

const gameOverStates = [GAME_STATE.OVER_SOLVED, GAME_STATE.OVER_UNSOLVED]

export const isGameOver = gameState => {
    return gameOverStates.indexOf(gameState) !== -1
}

export const getTimeComponentString = value => {
    if(value > 9) return `${value}`
    else return `0${value}`
}