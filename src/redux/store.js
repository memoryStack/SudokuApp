import { configureStore } from "@reduxjs/toolkit";
import { initDispatch, initGetState } from './dispatch.helpers'

// reducers for each state-chunk
import counterReducer from '../apps/home/reducers';

import smartHintHCReducers from "../apps/arena/store/reducers/smartHintHC.reducers";

const store = configureStore({
    reducer: {
        smartHintHC: smartHintHCReducers,
    }
});

(function(){
    initDispatch(store.dispatch)
    initGetState(store.getState)
}())

export default store;