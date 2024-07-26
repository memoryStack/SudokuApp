import type { RefreeRepository } from './adapterInterfaces/stateManagers/refreeRepository'
import type { SmartHintRepository } from './adapterInterfaces/stateManagers/smartHintHCRepository'
import type { BoardRepository } from './adapterInterfaces/stateManagers/boardRepository'
import type { SnackBarAdapter } from './adapterInterfaces/snackbar'

export type Dependencies = {
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardRepository: BoardRepository
    snackBarAdapter: SnackBarAdapter
}
