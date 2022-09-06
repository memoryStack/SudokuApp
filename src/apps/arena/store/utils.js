import { getStoreState } from '../../../redux/dispatch.helpers'
import { GameState } from '../utils/classes/gameState'
import { getGameState } from './selectors/gameState.selectors'

// TODO: remove this function in immediate future
export const isGameActive = () => {
    return new GameState(getGameState(getStoreState())).isGameActive()
}
