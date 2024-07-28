import { GameState } from "../utils/gameState"

import { pauseGame } from "./pauseGame"
import { resumeGame } from "./resumeGame"
import { Dependencies } from "../type"

export const timerClickUseCase = (dependencies: Dependencies): void => {
    const { gameStateRepository } = dependencies
    const gameState = gameStateRepository.getGameState()
    const gameStateObj = new GameState(gameState)
    if (!(gameStateObj.isGameActive() || gameStateObj.isGameInactive())) return

    if (gameStateObj.isGameActive()) pauseGame(gameState, dependencies)
    else resumeGame(dependencies)
}
