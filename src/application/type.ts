import type { RefreeRepository } from './adapterInterfaces/stateManagers/refreeRepository'
import type { SmartHintRepository } from './adapterInterfaces/stateManagers/smartHintHCRepository'
import type { BoardRepository } from './adapterInterfaces/stateManagers/boardRepository'
import type { GameStateRepository } from './adapterInterfaces/stateManagers/gameStateRepository'
import type { SnackBarAdapter } from './adapterInterfaces/snackbar'

export type Dependencies = {
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardRepository: BoardRepository
    gameStateRepository: GameStateRepository
    snackBarAdapter: SnackBarAdapter
}
