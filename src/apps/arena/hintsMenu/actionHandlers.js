import { GAME_STATE } from '@resources/constants'
import { consoleLog } from '../../../utils/util'

import { hintsMenuVisibilityAction } from '../store/actions/boardController.actions'
import { updateGameState } from '../store/actions/gameState.actions'
import { showHintAction } from '../store/actions/smartHintHC.actions'
import { getRawHints } from '../utils/smartHints'

import { HINTS_MENU_ITEMS } from '../utils/smartHints/constants'

const onInit = async ({ setState, params: { mainNumbers, notes } }) => {
    const availableRawHints = {}
    for (let i = 0; i < HINTS_MENU_ITEMS.length; i++) {
        const { id: hintId } = HINTS_MENU_ITEMS[i]
        availableRawHints[hintId] = await rawHintsPromise(hintId, mainNumbers, notes)
    }
    setState({ availableRawHints })
}

// TODO: analyze the asynchronous behaviour of this handler
// i really need to brush up asynchronous in js
const rawHintsPromise = (hintId, mainNumbers, notes) => new Promise(resolve => {
    setTimeout(() => {
        getRawHints(hintId, mainNumbers, notes)
            .then(resolve)
            .catch(error => {
                consoleLog(hintId, error)
                resolve(null)
            })
    })
})

const handleCloseHintsMenu = () => {
    hintsMenuVisibilityAction(false)
}

const handleMenuItemPress = ({ getState, params: { id, mainNumbers, notes } }) => {
    handleCloseHintsMenu()
    const { availableRawHints } = getState()

    showHintAction(id, availableRawHints[id], mainNumbers, notes)

    updateGameState(GAME_STATE.ACTIVE)
}

const handleOverlayPress = () => {
    handleCloseHintsMenu()
    updateGameState(GAME_STATE.ACTIVE)
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
