import { GAME_STATE } from '@resources/constants'

export interface GameStateRepository {
    getGameState: () => GAME_STATE
    setGameState: (gameState: GAME_STATE) => void
}
