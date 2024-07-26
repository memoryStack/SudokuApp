import { GAME_STATE } from "../../constants"

export interface GameStateRepository {
    getGameState: () => GAME_STATE
    setGameState: (gameState: GAME_STATE) => void
}
