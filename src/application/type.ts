import type { RefreeRepository } from './adapterInterfaces/stateManagers/refreeRepository'
import type { SmartHintRepository } from './adapterInterfaces/stateManagers/smartHintHCRepository'
import type { BoardRepository } from './adapterInterfaces/stateManagers/boardRepository'
import type { GameStateRepository } from './adapterInterfaces/stateManagers/gameStateRepository'
import type { BoardControllerRepository } from './adapterInterfaces/stateManagers/boardControllerRepository'
import type { NewPuzzleGenerator } from './adapterInterfaces/puzzleGenerator'
import type { SnackBarAdapter } from './adapterInterfaces/snackbar'
import type { PausedGameAdapter } from './adapterInterfaces/pausedGame'
import type { CustomPuzzleInputToggler } from './adapterInterfaces/customPuzzle'

export type Dependencies = {
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardRepository: BoardRepository
    gameStateRepository: GameStateRepository
    snackBarAdapter: SnackBarAdapter
    boardControllerRepository: BoardControllerRepository
    newPuzzleGenerator: NewPuzzleGenerator
    pausedGameAdapter: PausedGameAdapter
    customPuzzleInputToggler: CustomPuzzleInputToggler
}
