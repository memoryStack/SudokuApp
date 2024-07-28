
// TODO: think over where to define this StartGameData interface ??
import type { StartGameData } from '../usecases/startGameUseCase'
import { GAME_STATE } from '../constants'

export type PausedGameData = Omit<StartGameData, 'dependencies'> & {
    gameState: GAME_STATE
}

type GetPausedGameData = () => Promise<PausedGameData | null>

type RemovePausedGameData = () => Promise<void>

export type PausedGameAdapter = {
    getPausedGameData: GetPausedGameData,
    removePausedGameData: RemovePausedGameData
}
