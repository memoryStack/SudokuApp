import { GameState } from "../../utils/classes/gameState"

const stateHandlers = {
    setGameState: (state, { payload }) => {
        state.gameState = payload
        state.gameStateObj = new GameState(payload)
    },
}

export default stateHandlers
