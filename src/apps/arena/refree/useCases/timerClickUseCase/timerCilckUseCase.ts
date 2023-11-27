import { GAME_STATE } from '@resources/constants'

import { GameState } from '../../../utils/classes/gameState'

import { GameStateRepository } from './types'

export const TimerClickUseCase = (repository: GameStateRepository): void => {
    const gameState = repository.getGameState()

    const gameStateObj = new GameState(gameState)
    if (!(gameStateObj.isGameActive() || gameStateObj.isGameInactive())) return

    const newGameState = gameStateObj.isGameActive() ? GAME_STATE.INACTIVE : GAME_STATE.ACTIVE
    repository.setGameState(newGameState)
}
