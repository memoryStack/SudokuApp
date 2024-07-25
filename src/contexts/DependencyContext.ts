import { createContext } from 'react'

import { BoardControllerRepository } from '@application/adapterInterfaces/stateManagers/boardControllerRepository'
import { RefreeRepository } from '@application/adapterInterfaces/stateManagers/refreeRepository'
import { GameStateRepository } from '../apps/arena/refree/useCases/timerClickUseCase'
import { SmartHintRepository } from '../interfaces/smartHintRepository'
import { BoardRepository } from '@application/adapterInterfaces/stateManagers/boardRepository'

export type Dependencies = {
    gameStateRepository: GameStateRepository
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardControllerRepository: BoardControllerRepository
    boardRepository: BoardRepository
};

const DependencyContext = createContext<Dependencies | undefined>(undefined)

export default DependencyContext
