import { getStoreState } from '../../../redux/dispatch.helpers'
import { GameState } from '../utils/classes/gameState'
import { getGameState } from './selectors/gameState.selectors'

// TODO: remove this function in immediate future
// TODO: think over this way of using redux data
export const isGameActive = () => new GameState(getGameState(getStoreState())).isGameActive()
