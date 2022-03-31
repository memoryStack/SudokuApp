import { updateSelectedCell } from '../store/actions/board.actions'
import { clearHints, showNextHint, showPrevHint } from '../store/actions/smartHintHC.actions'

const handleOnClose = ({ params: newCellToSelect }) => {
    if (newCellToSelect) updateSelectedCell(newCellToSelect)
    clearHints()
}

const handleNextClick = () => {
    showNextHint()
}

const handlePrevClick = () => showPrevHint()

const ACTION_TYPES = {
    ON_CLOSE: 'ON_CLOSE',
    ON_NEXT_CLICK: 'ON_NEXT_CLICK',
    ON_PREV_CLICK: 'ON_PREV_CLICK',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_CLOSE]: handleOnClose,
    [ACTION_TYPES.ON_NEXT_CLICK]: handleNextClick,
    [ACTION_TYPES.ON_PREV_CLICK]: handlePrevClick,
}

export { ACTION_TYPES, ACTION_HANDLERS }
