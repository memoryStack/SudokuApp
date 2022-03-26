import { configureStore } from "@reduxjs/toolkit";
import { initDispatch, initGetState } from './dispatch.helpers'

import smartHintHCReducers from "../apps/arena/store/reducers/smartHintHC.reducers";
import refreeReducers from "../apps/arena/store/reducers/refree.reducers";

const store = configureStore({
    reducer: {
        smartHintHC: smartHintHCReducers,
        refree: refreeReducers,
    }
});

(function(){
    initDispatch(store.dispatch)
    initGetState(store.getState)
}())

export default store;