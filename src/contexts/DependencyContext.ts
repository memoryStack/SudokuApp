import { createContext } from 'react'

import { RefreeRepository } from '../interfaces/refreeRepository'
import { GameStateRepository } from '../apps/arena/refree/useCases/timerClickUseCase'

type DependencyContextValues = {
    gameStateRepository: GameStateRepository
    refreeRepository: RefreeRepository
};

const DependencyContext = createContext<DependencyContextValues | undefined>(undefined)

export default DependencyContext
