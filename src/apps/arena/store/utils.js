import { getStoreState } from "../../../redux/dispatch.helpers"
import { GAME_STATE } from "../../../resources/constants"
import { getGameState } from "./selectors/gameState.selectors"

export const isGameActive = () => {
    const gameState = getGameState(getStoreState())
    return gameState === GAME_STATE.ACTIVE
}
