import { invokeDispatch } from '../../../../redux/dispatch.helpers'

import { gameStateActions } from '../reducers/gameState.reducers'

const { setGameState } = gameStateActions

export const updateGameState = newState => {
    invokeDispatch(setGameState(newState))
}
