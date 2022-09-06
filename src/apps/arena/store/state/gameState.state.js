import { GAME_STATE } from '../../../../resources/constants'
import { GameState } from '../../utils/classes/gameState'

export const INITIAL_STATE = {
    gameState: GAME_STATE.GAME_SELECT,
    gameStateObj: new GameState(GAME_STATE.GAME_SELECT),
}
