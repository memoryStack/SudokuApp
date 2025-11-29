import { LockNumber } from "@application/adapterInterfaces/stateManagers/inputPanelRepository"
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

const getMaxMistakesLimit = state => state[GAME_SETTINGS_STATE.REFREE]?.maxMistakesLimit

const getMistakes = state => state[GAME_SETTINGS_STATE.REFREE]?.mistakes

const getDifficultyLevel = state => state[GAME_SETTINGS_STATE.REFREE]?.difficultyLevel

const getLevelNumber = state => state[GAME_SETTINGS_STATE.REFREE]?.levelNumber

const getTime = state => state[GAME_SETTINGS_STATE.REFREE]?.time

const getLastActivityTime = state => state[GAME_SETTINGS_STATE.REFREE]?.lastActivityTime

const getIsNumberLocked = state => state[GAME_SETTINGS_STATE.INPUT_PANEL]?.lockedNumber.isLocked

const getLockedNumber = (state): LockNumber => state[GAME_SETTINGS_STATE.INPUT_PANEL]?.lockedNumber

export const refreeSelectors = {
    getMaxMistakesLimit,
    getMistakes,
    getDifficultyLevel,
    getLevelNumber,
    getTime,
    getLastActivityTime
}

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

export const inputPanelSelectors = {
    getIsNumberLocked,
    getLockedNumber
}
