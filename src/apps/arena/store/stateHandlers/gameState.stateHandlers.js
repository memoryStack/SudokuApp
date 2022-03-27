const stateHandlers = {
    setGameState: (state, { payload }) => {
        state.gameState = payload
    }
};

export default stateHandlers;
