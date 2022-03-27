
import { getStoreState } from "../../../redux/dispatch.helpers"
import { EVENTS, GAME_STATE } from "../../../resources/constants"
import { emit } from "../../../utils/GlobalEventBus"
import { updatePencil } from "../store/actions/boardController.actions"
import { getGameState } from "../store/selectors/gameState.selectors"

const isGameActive = () => {
    const gameState = getGameState(getStoreState())
    return gameState === GAME_STATE.ACTIVE
}

const handleUndoClick = () => {
    if (!isGameActive()) return
    emit(EVENTS.UNDO_CLICKED)
}

const handlePencilClick = () => {
    if (!isGameActive()) return
    updatePencil()
}

const handleFastPencilClick = () => {
    if (!isGameActive()) return
    emit(EVENTS.FAST_PENCIL_CLICKED)
}

const handleHintClick = () => {
    if (!isGameActive()) return
    emit(EVENTS.HINT_CLICKED)
}

const ACTION_TYPES = {
    ON_UNDO_CLICK: 'ON_UNDO_CLICK',
    ON_PENCIL_CLICK: 'ON_PENCIL_CLICK',
    ON_FAST_PENCIL_CLICK: 'ON_FAST_PENCIL_CLICK',
    ON_HINT_CLICK: 'ON_HINT_CLICK',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_UNDO_CLICK]: handleUndoClick,
    [ACTION_TYPES.ON_PENCIL_CLICK]: handlePencilClick,
    [ACTION_TYPES.ON_FAST_PENCIL_CLICK]: handleFastPencilClick,
    [ACTION_TYPES.ON_HINT_CLICK]: handleHintClick,
}

export {
    ACTION_TYPES,
    ACTION_HANDLERS,
}
