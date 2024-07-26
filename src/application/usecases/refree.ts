import { GameState } from "../utils/gameState"

import { GAME_STATE } from "../constants"

import type { GameStateRepository } from '../adapterInterfaces/stateManagers/gameStateRepository'

export const timerClickUseCase = (repository: GameStateRepository): void => {
    const gameState = repository.getGameState()

    const gameStateObj = new GameState(gameState)
    if (!(gameStateObj.isGameActive() || gameStateObj.isGameInactive())) return

    const newGameState = gameStateObj.isGameActive() ? GAME_STATE.INACTIVE : GAME_STATE.ACTIVE
    repository.setGameState(newGameState)
}
