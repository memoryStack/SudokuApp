import { createContext } from 'react'

import type { BoardControllerRepository } from '@application/adapterInterfaces/stateManagers/boardControllerRepository'
import type { RefreeRepository } from '@application/adapterInterfaces/stateManagers/refreeRepository'
import type { GameStateRepository } from '@application/adapterInterfaces/stateManagers/gameStateRepository'
import type { SmartHintRepository } from '../interfaces/smartHintRepository'
import type { BoardRepository } from '@application/adapterInterfaces/stateManagers/boardRepository'
import type { SnackBarAdapter } from '@application/adapterInterfaces/snackbar'
import type { PuzzleAdapter } from '@application/adapterInterfaces/puzzleGenerator'
import type { GamePersistenceAdapter } from '@application/adapterInterfaces/gamePersistenceAdapter'
import { GameLevelsAdapter } from '@application/adapterInterfaces/gameLevels'
import type { AllAnalyticsHandlers } from '@application/analyticsInterfaces/types'

// TODO: organise these dependencies into relevant hierarchy
export type Dependencies = {
    gameStateRepository: GameStateRepository
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardControllerRepository: BoardControllerRepository
    boardRepository: BoardRepository
    snackBarAdapter: SnackBarAdapter
    puzzle: PuzzleAdapter
    gamePersistenceAdapter: GamePersistenceAdapter
    gameLevelsAdapter: GameLevelsAdapter
    analytics: AllAnalyticsHandlers
};

const DependencyContext = createContext<Dependencies | undefined>(undefined)

export default DependencyContext
