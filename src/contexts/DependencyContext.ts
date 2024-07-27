import { createContext } from 'react'

import type { BoardControllerRepository } from '@application/adapterInterfaces/stateManagers/boardControllerRepository'
import type { RefreeRepository } from '@application/adapterInterfaces/stateManagers/refreeRepository'
import type { GameStateRepository } from '@application/adapterInterfaces/stateManagers/gameStateRepository'
import type { SmartHintRepository } from '../interfaces/smartHintRepository'
import type { BoardRepository } from '@application/adapterInterfaces/stateManagers/boardRepository'
import type { SnackBarAdapter } from '@application/adapterInterfaces/snackbar'
import type { NewPuzzleGenerator } from '@application/adapterInterfaces/puzzleGenerator'
import type { GetPausedGameData } from '@application/adapterInterfaces/pausedGameDataGetter'

// TODO: organise these dependencies into relevant hierarchy
export type Dependencies = {
    gameStateRepository: GameStateRepository
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardControllerRepository: BoardControllerRepository
    boardRepository: BoardRepository
    snackBarAdapter: SnackBarAdapter
    newPuzzleGenerator: NewPuzzleGenerator
    getPausedGameData: GetPausedGameData
};

const DependencyContext = createContext<Dependencies | undefined>(undefined)

export default DependencyContext
