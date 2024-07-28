
// TODO: think over where to define this StartGameData interface ??
import type { StartGameData } from '../usecases/startGameUseCase'
import { GAME_STATE, PENCIL_STATE } from '../constants'
import { NEW_GAME_IDS } from '@application/usecases/newGameMenu/constants'
import { Time } from './stateManagers/refreeRepository'
import { Move } from './stateManagers/boardRepository'

export type PausedGameData = Omit<StartGameData, 'dependencies'> & {
    gameState: GAME_STATE
}

export type GameDataToPersist = {
    state: GAME_STATE,
    referee: {
        difficultyLevel: NEW_GAME_IDS,
        mistakes: number,
        time: Time,
    },
    boardData: {
        mainNumbers: MainNumbers,
        notes: Notes,
        moves: Move[],
        selectedCell: Cell,
    },
    cellActionsData: {
        pencilState: PENCIL_STATE,
        hints: number
    }
}

type GetPausedGameData = () => Promise<PausedGameData | null>

type RemovePausedGameData = () => Promise<void>

type PersistGameData = (data: GameDataToPersist) => Promise<void>

export type GamePersistenceAdapter = {
    getPausedGameData: GetPausedGameData,
    removePausedGameData: RemovePausedGameData,
    persistGameData: PersistGameData,
}
