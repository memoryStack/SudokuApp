
// TODO: think over where to define this StartGameData interface ??
import type { StartGameData } from '../usecases/startGameUseCase'

export type PausedGameData = Omit<StartGameData, 'dependencies'>

export type GetPausedGameData = () => Promise<PausedGameData>
