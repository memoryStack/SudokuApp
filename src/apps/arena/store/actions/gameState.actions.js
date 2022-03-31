import { invokeDispatch } from '../../../../redux/dispatch.helpers'

import { setGameState } from '../reducers/gameState.reducers'

export const updateGameState = newState => {
    invokeDispatch(setGameState(newState))
}
