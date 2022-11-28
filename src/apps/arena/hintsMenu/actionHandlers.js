import { GAME_STATE } from '../../../resources/constants'
import { consoleLog } from '../../../utils/util'
import { hintsMenuVisibilityAction } from '../store/actions/boardController.actions'
import { updateGameState } from '../store/actions/gameState.actions'
import { showHints, checkHintAvailability } from '../store/actions/smartHintHC.actions'
import { HINTS_IDS, HINTS_MENU_ITEMS } from '../utils/smartHints/constants'

const handleCloseHintsMenu = () => {
    hintsMenuVisibilityAction(false)
}

const handleMenuItemPress = async ({ params: id }) => {
    handleCloseHintsMenu()
    const hintAvailable = await showHints(id)
    if (!hintAvailable) updateGameState(GAME_STATE.ACTIVE)
}

const handleOverlayPress = () => {
    handleCloseHintsMenu()
    updateGameState(GAME_STATE.ACTIVE)
}

const onInit = async ({ setState }) => {
    const hintsAvailable = {}

    for (let i = 0; i < HINTS_MENU_ITEMS.length; i++) {
        const { id: hintId } = HINTS_MENU_ITEMS[i]
        hintsAvailable[hintId] = await checkHintAvailability(hintId)
    }

    setState({ hintsAvailable })
}

const ACTION_TYPES = {
    ON_INIT: 'ON_INIT',
    ON_OVERLAY_CONTAINER_PRESS: 'ON_OVERLAY_CONTAINER_PRESS',
    ON_MENU_ITEM_PRESS: 'ON_MENU_ITEM_PRESS',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_INIT]: onInit,
    [ACTION_TYPES.ON_OVERLAY_CONTAINER_PRESS]: handleOverlayPress,
    [ACTION_TYPES.ON_MENU_ITEM_PRESS]: handleMenuItemPress,
}

export { ACTION_TYPES, ACTION_HANDLERS }
