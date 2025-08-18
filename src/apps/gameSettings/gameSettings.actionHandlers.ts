import {
    ACTION_HANDLERS as PUZZLE_BOARD_ACTION_HANDLERS,
    ACTION_TYPES as PUZZLE_BOARD_ACTION_TYPES
} from '../arena/PuzzleBoard/actionHandlers'

import {
    ACTION_HANDLERS as BOARD_CONTROLLER_ACTION_HANDLERS,
    ACTION_TYPES as BOARD_CONTROLLER_ACTION_TYPES
} from '../arena/cellActions/actionHandlers'

import {
    ACTION_HANDLERS as INPUT_PANEL_ACTION_HANDLERS
} from '../arena/GameInputPanel/actionHandlers'

import {
    ACTION_TYPES as INPUT_PANEL_ACTION_TYPES
} from '../arena/inputPanel/constants'
import _noop from '@lodash/noop'

const ACTION_TYPES = {
    ...PUZZLE_BOARD_ACTION_TYPES,
    ...INPUT_PANEL_ACTION_TYPES,
    ...BOARD_CONTROLLER_ACTION_TYPES,
    ON_INIT: 'ON_INIT',
}

const onInit = async ({ setState, params: dependencies }) => {
    setState({
        dependencies
    })
}

const handlePencilClick = ({ getState, setState, params }) => {
    const { dependencies } = getState()
    BOARD_CONTROLLER_ACTION_HANDLERS[ACTION_TYPES.ON_PENCIL_CLICK]?.({
        getState,
        setState,
        params: { ...params, dependencies }
    })
}

const handleFastPencilClick = ({ getState, setState, params }) => {
    const { dependencies } = getState()
    BOARD_CONTROLLER_ACTION_HANDLERS[ACTION_TYPES.ON_FAST_PENCIL_CLICK]?.({
        getState,
        setState,
        params: { ...params, dependencies }
    })
}

const handleUndoClick = ({ getState, setState, params }) => {
    const { dependencies } = getState()
    BOARD_CONTROLLER_ACTION_HANDLERS[ACTION_TYPES.ON_UNDO_CLICK]?.({
        getState,
        setState,
        params: { ...params, dependencies }
    })
}

const ACTION_HANDLERS = {
    ...PUZZLE_BOARD_ACTION_HANDLERS,
    ...INPUT_PANEL_ACTION_HANDLERS,
    [ACTION_TYPES.ON_INIT]: onInit,
    [ACTION_TYPES.ON_PENCIL_CLICK]: handlePencilClick,
    [ACTION_TYPES.ON_FAST_PENCIL_CLICK]: handleFastPencilClick,
    [ACTION_TYPES.ON_UNDO_CLICK]: handleUndoClick,
    [ACTION_TYPES.ON_HINT_CLICK]: _noop,
}

export { ACTION_TYPES, ACTION_HANDLERS }
