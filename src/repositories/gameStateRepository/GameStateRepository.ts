import { GAME_STATE } from '@resources/constants'

import type { GameStateRepository as GameStateRepositoryInterface } from '../../apps/arena/refree/useCases/timerClickUseCase'
import { gameStateActions } from '../../apps/arena/store/reducers/gameState.reducers'
import { getGameState } from '../../apps/arena/store/selectors/gameState.selectors'
import { getStoreState, invokeDispatch } from '../../redux/dispatch.helpers'

const { setGameState } = gameStateActions

export const GameStateRepository: GameStateRepositoryInterface = {
    getGameState: () => getGameState(getStoreState()),
    setGameState: (state: GAME_STATE) => invokeDispatch(setGameState(state)),
}
