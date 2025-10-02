import { createContext } from 'react'

import type { BoardControllerRepository } from '@application/adapterInterfaces/stateManagers/boardControllerRepository'
import type { RefreeRepository } from '@application/adapterInterfaces/stateManagers/refreeRepository'
import type { GameStateRepository } from '@application/adapterInterfaces/stateManagers/gameStateRepository'
import type { SmartHintRepository } from '../interfaces/smartHintRepository'
import type { BoardRepository } from '@application/adapterInterfaces/stateManagers/boardRepository'
import type { InputPanelRepository } from '@application/adapterInterfaces/stateManagers/inputPanelRepository'
import type { SnackBarAdapter } from '@application/adapterInterfaces/snackbar'
import type { PuzzleAdapter } from '@application/adapterInterfaces/puzzleGenerator'
import type { GamePersistenceAdapter } from '@application/adapterInterfaces/gamePersistenceAdapter'
import { GameLevelsAdapter } from '@application/adapterInterfaces/gameLevels'
import type { AllAnalyticsHandlers } from '@application/adapterInterfaces/analytics'
import { SoundAdapter } from 'src/interfaces/soundAdapter'
import type { CoachMarksAdapterUIInterface } from 'src/interfaces/coachMarksToursAdapter'
import { ArenaServiceAdapterInterface } from 'src/interfaces/arenaServiceAdapter'
import { UserDetailsAdapter } from 'src/interfaces/userDetailsAdapter'
import { AppVersionsServiceAdapter } from 'src/interfaces/appVersionsServiceAdapter'
import { GameSettingsAdapter } from '@interfaces/gameSettingsAdapter'

// TODO: organise these dependencies into relevant hierarchy
export type Dependencies = {
    state: {
        gameSettingsInitialized: boolean
    },
    gameStateRepository: GameStateRepository
    refreeRepository: RefreeRepository
    smartHintRepository: SmartHintRepository
    boardControllerRepository: BoardControllerRepository
    inputPanelRepository: InputPanelRepository
    boardRepository: BoardRepository
    snackBarAdapter: SnackBarAdapter
    puzzle: PuzzleAdapter
    gamePersistenceAdapter: GamePersistenceAdapter
    gameLevelsAdapter: GameLevelsAdapter
    analytics: AllAnalyticsHandlers
    soundAdapter: SoundAdapter
    coachMarksAdapter: CoachMarksAdapterUIInterface
    userDetailsAdapter: UserDetailsAdapter
    services: {
        arena: ArenaServiceAdapterInterface
        appVersion: AppVersionsServiceAdapter
    }
    gameSettingsAdapter: GameSettingsAdapter
};

const DependencyContext = createContext<Dependencies | undefined>(undefined)

export default DependencyContext
