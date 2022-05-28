import { GAME_STATE } from '../../../resources/constants'
import { updateSelectedCell } from '../store/actions/board.actions'
import { updateGameState } from '../store/actions/gameState.actions'
import { clearHints, showNextHint, showPrevHint, resetStoreState } from '../store/actions/smartHintHC.actions'
import { ACTION_TYPES as INPUT_PANEL_ACTION_TYPES } from '../inputPanel/constants'
import { ACTION_TYPES as BOARD_GENERIC_ACTION_TYPES } from '../gameBoard/actionTypes'
import { consoleLog } from '../../../utils/util'

const handleOnClose = ({ params: newCellToSelect }) => {
    if (newCellToSelect) updateSelectedCell(newCellToSelect)
    clearHints()
    updateGameState(GAME_STATE.ACTIVE)
}

const handleNextClick = () => {
    showNextHint()
}

const handlePrevClick = () => showPrevHint()

const handleResetStoreState = () => {
    resetStoreState()
}

const handleCellClick = ({ params: cell }) => {
    consoleLog('@@@@ cell clicked', cell)
}

const handleNumberClick = ({ params: number }) => {
    consoleLog('@@@@ number clicked', number)
}

const handleEraserClick = () => {
    consoleLog('@@@@ eraser clicked')
}

const ACTION_TYPES = {
    ON_CLOSE: 'ON_CLOSE',
    ON_NEXT_CLICK: 'ON_NEXT_CLICK',
    ON_PREV_CLICK: 'ON_PREV_CLICK',
    ON_UNMOUNT: 'ON_UNMOUNT',
    ...INPUT_PANEL_ACTION_TYPES,
    ...BOARD_GENERIC_ACTION_TYPES,
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_CLOSE]: handleOnClose,
    [ACTION_TYPES.ON_NEXT_CLICK]: handleNextClick,
    [ACTION_TYPES.ON_PREV_CLICK]: handlePrevClick,
    [ACTION_TYPES.ON_UNMOUNT]: handleResetStoreState,
    [ACTION_TYPES.ON_CELL_PRESS]: handleCellClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
}

export { ACTION_TYPES, ACTION_HANDLERS }

/*
    try-out store
        make a sub-tree in smartHintHC store only
    try-out actionHandler 
        keep it in this file only
*/