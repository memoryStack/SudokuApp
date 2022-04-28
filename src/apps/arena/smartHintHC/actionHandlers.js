import { GAME_STATE } from '../../../resources/constants'
import { updateSelectedCell } from '../store/actions/board.actions'
import { updateGameState } from '../store/actions/gameState.actions'
import { clearHints, showNextHint, showPrevHint, resetStoreState } from '../store/actions/smartHintHC.actions'

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

const ACTION_TYPES = {
    ON_CLOSE: 'ON_CLOSE',
    ON_NEXT_CLICK: 'ON_NEXT_CLICK',
    ON_PREV_CLICK: 'ON_PREV_CLICK',
    ON_UNMOUNT: 'ON_UNMOUNT',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_CLOSE]: handleOnClose,
    [ACTION_TYPES.ON_NEXT_CLICK]: handleNextClick,
    [ACTION_TYPES.ON_PREV_CLICK]: handlePrevClick,
    [ACTION_TYPES.ON_UNMOUNT]: handleResetStoreState,
}

export { ACTION_TYPES, ACTION_HANDLERS }
