
// TODO: think over where to define this StartGameData interface ??
import type { StartGameData } from '../usecases/startGameUseCase'
import { GAME_STATE, PENCIL_STATE } from '../constants'
import { NEW_GAME_IDS } from '@application/usecases/newGameMenu/constants'
import { Time } from './stateManagers/refreeRepository'
import { Move } from './stateManagers/boardRepository'
import { INPUT_TYPE } from './stateManagers/inputPanelRepository'

export type PausedGameData = Omit<StartGameData, 'dependencies'> & {
    gameState: GAME_STATE
}

export type GameDataToPersist = {
    state: GAME_STATE,
    referee: {
        difficultyLevel: NEW_GAME_IDS,
        levelNum: number,
        mistakes: number,
        time: Time,
        lastActivityTime: Time,
    },
    boardData: {
        mainNumbers: MainNumbers,
        notes: Notes,
        moves: Move[],
        selectedCell: Cell,
    },
    cellActionsData: {
        pencilState: PENCIL_STATE,
        hints: number // these are hints left if there is a limit
        hintsUsed: number
    },
    inputPanel: {
        lockedNumber: {
            number: number,
            type: INPUT_TYPE
        }
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
