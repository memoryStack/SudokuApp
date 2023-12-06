import { createContext } from 'react'

import { BoardControllerRepository } from '../interfaces/boardControllerRepository'
import { RefreeRepository } from '../interfaces/refreeRepository'
import { GameStateRepository } from '../apps/arena/refree/useCases/timerClickUseCase'
import { SmartHintRepository } from '../interfaces/smartHintRepository'

export type Dependencies = {
    gameStateRepository: GameStateRepository
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardControllerRepository: BoardControllerRepository
};

const DependencyContext = createContext<Dependencies | undefined>(undefined)

export default DependencyContext
