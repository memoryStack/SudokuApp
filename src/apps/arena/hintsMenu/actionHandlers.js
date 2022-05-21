import { GAME_STATE } from '../../../resources/constants'
import { hintsMenuVisibilityAction } from '../store/actions/boardController.actions'
import { updateGameState } from '../store/actions/gameState.actions'
import { showHints } from '../store/actions/smartHintHC.actions'

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

const ACTION_TYPES = {
    ON_OVERLAY_CONTAINER_PRESS: 'ON_OVERLAY_CONTAINER_PRESS',
    ON_MENU_ITEM_PRESS: 'ON_MENU_ITEM_PRESS',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_OVERLAY_CONTAINER_PRESS]: handleOverlayPress,
    [ACTION_TYPES.ON_MENU_ITEM_PRESS]: handleMenuItemPress,
}

export { ACTION_TYPES, ACTION_HANDLERS }
