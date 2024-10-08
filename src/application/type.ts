import type { RefreeRepository } from './adapterInterfaces/stateManagers/refreeRepository'
import type { SmartHintRepository } from './adapterInterfaces/stateManagers/smartHintHCRepository'
import type { BoardRepository } from './adapterInterfaces/stateManagers/boardRepository'
import type { GameStateRepository } from './adapterInterfaces/stateManagers/gameStateRepository'
import type { BoardControllerRepository } from './adapterInterfaces/stateManagers/boardControllerRepository'
import type { PuzzleAdapter } from './adapterInterfaces/puzzleGenerator'
import type { SnackBarAdapter } from './adapterInterfaces/snackbar'
import type { GamePersistenceAdapter } from './adapterInterfaces/'
import type { CustomPuzzleInputToggler } from './adapterInterfaces/customPuzzle'
import type { GameLevelsAdapter } from './adapterInterfaces/gameLevels'

export type Dependencies = {
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardRepository: BoardRepository
    gameStateRepository: GameStateRepository
    snackBarAdapter: SnackBarAdapter
    boardControllerRepository: BoardControllerRepository
    puzzle: PuzzleAdapter
    gamePersistenceAdapter: GamePersistenceAdapter
    customPuzzleInputToggler: CustomPuzzleInputToggler
    gameLevelsAdapter: GameLevelsAdapter
}
