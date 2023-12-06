import { createContext } from 'react'

import { RefreeRepository } from '../interfaces/refreeRepository'
import { GameStateRepository } from '../apps/arena/refree/useCases/timerClickUseCase'

export type Dependencies = {
    gameStateRepository: GameStateRepository
    refreeRepository: RefreeRepository
};

const DependencyContext = createContext<Dependencies | undefined>(undefined)

export default DependencyContext
