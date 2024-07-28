import { GAME_STATE } from "../constants";
import { Dependencies } from "../type";
import { GameState } from "../utils/gameState";

export const resumeGame = (dependencies: Dependencies) => {
    const { gameStateRepository } = dependencies
    const currentGameState = gameStateRepository.getGameState()
    if (!new GameState(currentGameState).isGameInactive()) return
    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
}
