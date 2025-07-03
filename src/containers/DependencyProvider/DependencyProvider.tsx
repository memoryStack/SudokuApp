import React, { useMemo } from 'react'

import DependencyContext from '@contexts/DependencyContext'

import { GameStateRepository } from '../../repositories/gameStateRepository'
import { RefreeRepository } from '../../repositories/refreeRepository'
import { SmartHintRepository } from '../../repositories/smartHintRepository'
import { BoardControllerRepository } from '../../repositories/boardControllerRepository'
import { BoardRepository } from '../../repositories/boardRepository'
import { snackBarAdapter } from '@adapters/snackbar'
import { Puzzle } from '@adapters/puzzle'
import { gamePersistenceAdapter } from '@adapters/gamePersistenceAdapter'
import { gameLevelsAdapter } from '@adapters/gameLevelsAdapter'
import { AnalyticsHandlers } from '@adapters/analytics'
import { soundAdapter } from '@adapters/soundAdapter'
import { coachMarksAdapter } from '@adapters/coachMarksToursAdapter'
import { ArenaServiceAdapter } from '@adapters/services/arenaServiceAdapter'
import { userDetailsAdapter } from '@adapters/userDetails'
import { AppVersionsAdapter } from '@adapters/services/appVersionsServiceAdapter'
import { gameSettingsAdapter } from '@adapters/gameSettings'

type Props = {
    children: React.ReactNode
}

const DependencyProvider: React.FC<Props> = ({ children }) => {
    const contextValues = useMemo(() => ({
        gameStateRepository: GameStateRepository,
        refreeRepository: RefreeRepository,
        smartHintRepository: SmartHintRepository,
        boardControllerRepository: BoardControllerRepository,
        boardRepository: BoardRepository,
        snackBarAdapter,
        puzzle: Puzzle,
        gamePersistenceAdapter,
        gameLevelsAdapter,
        analytics: AnalyticsHandlers,
        soundAdapter,
        coachMarksAdapter,
        userDetailsAdapter: userDetailsAdapter,
        services: {
            arena: ArenaServiceAdapter,
            appVersion: AppVersionsAdapter
        },
        gameSettingsAdapter
    }), [])

    return (
        <DependencyContext.Provider value={contextValues}>
            {children}
        </DependencyContext.Provider>
    )
}

export default React.memo(DependencyProvider)
