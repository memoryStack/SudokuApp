/* eslint-disable no-param-reassign */
const stateHandlers = {
    setGameState: (state, { payload: newGameState }) => {
        state.gameState = newGameState
    },
}

export default stateHandlers
