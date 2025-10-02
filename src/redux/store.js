import { combineReducers, configureStore } from '@reduxjs/toolkit'

import smartHintHCReducers from '../apps/arena/store/reducers/smartHintHC.reducers'
import refreeReducers from '../apps/arena/store/reducers/refree.reducers'
import gameStateReducers from '../apps/arena/store/reducers/gameState.reducers'
import boardControllerReducers from '../apps/arena/store/reducers/boardController.reducers'
import boardReducers from '../apps/arena/store/reducers/board.reducers'
import inputPanelReducers from '../apps/arena/store/reducers/inputPanel.reducers'

import { initDispatch, initGetState } from './dispatch.helpers'

const staticReducers = {
    smartHintHC: smartHintHCReducers,
    refree: refreeReducers,
    gameState: gameStateReducers,
    boardController: boardControllerReducers,
    board: boardReducers,
    inputPanel: inputPanelReducers
}

const store = configureStore({
    reducer: staticReducers
})

initDispatch(store.dispatch)
initGetState(store.getState)

export const injectReducer = (key, reducer) => {
    if (!key || store.asyncReducers?.[key]) return

    store.asyncReducers = { ...store.asyncReducers, [key]: reducer }
    store.replaceReducer(
        combineReducers({
            ...staticReducers,
            ...store.asyncReducers,
        })
    )
}

export const removeReducer = (key) => {
    if (!store.asyncReducers?.[key]) return

    const newAsyncReducers = { ...store.asyncReducers }
    delete newAsyncReducers[key]

    store.asyncReducers = newAsyncReducers
    store.replaceReducer(
        combineReducers({
            ...staticReducers,
            ...newAsyncReducers,
        })
    )
}

export default store

/*
store initial state structure for reference
    {
    "smartHintHC": {
        "show": false,
        "currentHintNum": -1,
        "hints": [],
        "tryOut": {}
    },
    "refree": {
        "maxMistakesLimit": 3,
        "mistakes": 0,
        "difficultyLevel": "",
        "time": {
        "hours": 0,
        "minutes": 0,
        "seconds": 0
        }
    },
    "gameState": {
        "gameState": "GAME_SELECT"
    },
    "boardController": {
        "pencilState": "INACTIVE",
        "hintsLeft": 3,
        "showHintsMenu": false
    },
    "board": {
        "mainNumbers": [],
        "selectedCell": {
        "row": 0,
        "col": 0
        },
        "notes": [],
        "moves": []
    }
    }

*/
