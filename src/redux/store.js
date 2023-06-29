import { configureStore } from '@reduxjs/toolkit'

import smartHintHCReducers from '../apps/arena/store/reducers/smartHintHC.reducers'
import refreeReducers from '../apps/arena/store/reducers/refree.reducers'
import gameStateReducers from '../apps/arena/store/reducers/gameState.reducers'
import boardControllerReducers from '../apps/arena/store/reducers/boardController.reducers'
import boardReducers from '../apps/arena/store/reducers/board.reducers'

import { initDispatch, initGetState } from './dispatch.helpers'

const store = configureStore({
    reducer: {
        smartHintHC: smartHintHCReducers,
        refree: refreeReducers,
        gameState: gameStateReducers,
        boardController: boardControllerReducers,
        board: boardReducers,
    },
});
(function () {
    initDispatch(store.dispatch)
    initGetState(store.getState)
}())

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
        "possibleNotes": [],
        "moves": []
    }
    }

*/
