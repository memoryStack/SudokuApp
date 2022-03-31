import { hintsMenuVisibilityAction } from '../store/actions/boardController.actions'
import { showHints } from '../store/actions/smartHintHC.actions'

const handleCloseHintsMenu = () => {
    hintsMenuVisibilityAction(false)
}

const handleMenuItemPress = ({ params: id }) => {
    handleCloseHintsMenu()
    showHints(id)
}

const ACTION_TYPES = {
    ON_OVERLAY_CONTAINER_PRESS: 'ON_OVERLAY_CONTAINER_PRESS',
    ON_MENU_ITEM_PRESS: 'ON_MENU_ITEM_PRESS',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_OVERLAY_CONTAINER_PRESS]: handleCloseHintsMenu,
    [ACTION_TYPES.ON_MENU_ITEM_PRESS]: handleMenuItemPress,
}

export { ACTION_TYPES, ACTION_HANDLERS }
