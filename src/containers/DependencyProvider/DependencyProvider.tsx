import React, { useMemo } from 'react'

import DependencyContext from '@contexts/DependencyContext'

import { GameStateRepository } from '../../repositories/gameStateRepository'
import { RefreeRepository } from '../../repositories/refreeRepository'
import { SmartHintRepository } from '../../repositories/smartHintRepository'

type Props = {
    children: React.ReactNode
}

const DependencyProvider: React.FC<Props> = ({ children }) => {
    const contextValues = useMemo(() => ({
        gameStateRepository: GameStateRepository,
        refreeRepository: RefreeRepository,
        smartHintRepository: SmartHintRepository,
    }), [])

    return (
        <DependencyContext.Provider value={contextValues}>
            {children}
        </DependencyContext.Provider>
    )
}

export default React.memo(DependencyProvider)
