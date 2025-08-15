import { GAME_STATE } from '@resources/constants'

import type { GameStateRepository as GameStateRepositoryInterface } from '@application/adapterInterfaces/stateManagers/gameStateRepository'

import { gameStateActions } from '../../apps/arena/store/reducers/gameState.reducers'
import { getGameState } from '../../apps/arena/store/selectors/gameState.selectors'
import { getStoreState, invokeDispatch } from '../../redux/dispatch.helpers'

export const createGameStateRepositoryHandlers = (actions, stateReaders: StateReaders): GameStateRepositoryInterface => {
    const {
        setGameState
    } = actions

    const {
        getGameState
    } = stateReaders

    return {
        getGameState: () => getGameState(getStoreState()),
        setGameState: (state: GAME_STATE) => {
            invokeDispatch(setGameState(state))
        }
    }
}

export const GameStateRepository = createGameStateRepositoryHandlers(gameStateActions, { getGameState })
