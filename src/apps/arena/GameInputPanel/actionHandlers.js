import { ACTION_TYPES } from '../inputPanel/constants'
import { eraseAction, inputNumberAction } from '../store/actions/board.actions'
import { isGameActive } from '../store/utils'

const handleNumberClick = ({ getState, params: number }) => {
    if (!isGameActive()) return
    const { dependencies } = getState()
    inputNumberAction(number, dependencies)
}

const handleEraserClick = ({ getState }) => {
    if (!isGameActive()) return
    const { dependencies } = getState()
    eraseAction(dependencies.boardRepository)
}

export const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
}
