import { createContext } from 'react'

import { BoardControllerRepository } from '@application/adapterInterfaces/stateManagers/boardControllerRepository'
import { RefreeRepository } from '@application/adapterInterfaces/stateManagers/refreeRepository'
import { GameStateRepository } from '@application/adapterInterfaces/stateManagers/gameStateRepository'
import { SmartHintRepository } from '../interfaces/smartHintRepository'
import { BoardRepository } from '@application/adapterInterfaces/stateManagers/boardRepository'
import { SnackBarAdapter } from '@application/adapterInterfaces/snackbar'

// TODO: organise these dependencies into relevant hierarchy
export type Dependencies = {
    gameStateRepository: GameStateRepository
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardControllerRepository: BoardControllerRepository
    boardRepository: BoardRepository
    snackBarAdapter: SnackBarAdapter
};

const DependencyContext = createContext<Dependencies | undefined>(undefined)

export default DependencyContext
