import { createContext } from 'react'
import { GameStateRepository } from '../apps/arena/refree/useCases/timerClickUseCase'

type DependencyContextValues = {
    gameStateRepository: GameStateRepository
};

const DependencyContext = createContext<DependencyContextValues | undefined>(undefined)

export default DependencyContext
