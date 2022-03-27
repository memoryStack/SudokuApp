import { getStoreState } from "../../../redux/dispatch.helpers"
import { EVENTS, GAME_STATE, SCREEN_NAME } from "../../../resources/constants"
import { emit } from "../../../utils/GlobalEventBus"
import { getGameState } from "../store/selectors/gameState.selectors"

// TODO: make it global for everyone to use
const isGameActive = () => {
    const gameState = getGameState(getStoreState())
    return gameState === GAME_STATE.ACTIVE
}

const handleErase = ({ getState }) => {
    if (!isGameActive()) return
    const { eventsPrefix = '' } = getState()
    emit(eventsPrefix + EVENTS.ERASER_CLICKED)
}

const handleInsertNumber = ({ getState, params: number }) => {
    const { screenName = '', eventsPrefix = '' } = getState()
    if (!(screenName === SCREEN_NAME.CUSTOM_PUZZLE || isGameActive()) ) return
    emit(eventsPrefix + EVENTS.INPUT_NUMBER_CLICKED, { number })
}

const ACTION_TYPES = {
    ON_ERASE_CLICK: 'ON_ERASE_CLICK',
    ON_NUMBER_CLICK: 'ON_NUMBER_CLICK',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_ERASE_CLICK]: handleErase,
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleInsertNumber,
}

export {
    ACTION_TYPES,
    ACTION_HANDLERS,
}
