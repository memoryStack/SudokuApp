import { GAME_SETTINGS_STATE } from "./constants"

const getMainNumbers = state => state[GAME_SETTINGS_STATE.BOARD]?.mainNumbers

const getSelectedCell = state => state[GAME_SETTINGS_STATE.BOARD]?.selectedCell

const getNotesInfo = state => state[GAME_SETTINGS_STATE.BOARD]?.notes

const getMoves = state => state[GAME_SETTINGS_STATE.BOARD]?.moves

const getPencilStatus = state => state[GAME_SETTINGS_STATE.BOARD_CONTROLLER]?.pencilState

const getAvailableHintsCount = state => state[GAME_SETTINGS_STATE.BOARD_CONTROLLER]?.hintsLeft

const getHintsMenuVisibilityStatus = state => state[GAME_SETTINGS_STATE.BOARD_CONTROLLER]?.showHintsMenu

const getHintsUsed = state => state[GAME_SETTINGS_STATE.BOARD_CONTROLLER]?.hintsUsed

const getGameState = state => state[GAME_SETTINGS_STATE.GAME_STATE]?.gameState

export const boardStateSelectors = {
    getMainNumbers,
    getSelectedCell,
    getNotesInfo,
    getMoves
}

export const boardControllerSelectors = {
    getPencilStatus,
    getAvailableHintsCount,
    getHintsMenuVisibilityStatus,
    getHintsUsed
}

export const gameStateSelectors = {
    getGameState
}
