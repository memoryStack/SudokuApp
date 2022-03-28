import { configureStore } from "@reduxjs/toolkit";
import { initDispatch, initGetState } from './dispatch.helpers'

import smartHintHCReducers from "../apps/arena/store/reducers/smartHintHC.reducers";
import refreeReducers from "../apps/arena/store/reducers/refree.reducers";
import gameStateReducers from "../apps/arena/store/reducers/gameState.reducers";
import boardControllerReducers from "../apps/arena/store/reducers/boardController.reducers";
import boardReducers from "../apps/arena/store/reducers/board.reducers";

const store = configureStore({
    reducer: {
        smartHintHC: smartHintHCReducers,
        refree: refreeReducers,
        gameState: gameStateReducers,
        boardController: boardControllerReducers,
        board: boardReducers,
    }
});

(function(){
    initDispatch(store.dispatch)
    initGetState(store.getState)
}())

export default store;
