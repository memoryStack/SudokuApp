import _map from '@lodash/map'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'

import { GAME_STATE } from '@resources/constants'

import _cloneDeep from '@lodash/cloneDeep'
import { consoleLog } from '../../../utils/util'

import { getRawHints, getTransformedRawHints } from '../utils/smartHints'

import { HINTS_IDS, HINTS_MENU_ITEMS } from '../utils/smartHints/constants'
import { generateSinglesMap } from '../utils/smartHints/util'

const onInit = async ({ setState, getState, params: { mainNumbers, notes } }) => {
    let availableHintsCount = 0
    const availableRawHints = {}
    let nakedSinglesMap = {}
    await rawHintsPromise(HINTS_IDS.NAKED_SINGLE, mainNumbers, notes)
        .then(({ id, data: allNakedSingles }) => {
            availableRawHints[id] = !_isEmpty(allNakedSingles) ? [allNakedSingles[0]] : allNakedSingles
            if (!_isEmpty(allNakedSingles)) availableHintsCount++
            nakedSinglesMap = generateSinglesMap(allNakedSingles)
            const puzzleSingles = { nakedSingles: nakedSinglesMap }
            return rawHintsPromise(HINTS_IDS.HIDDEN_SINGLE, mainNumbers, notes, puzzleSingles)
        }).then(({ id: hiddenSingleHintId, data: allHiddenSingles }) => {
            availableRawHints[hiddenSingleHintId] = !_isEmpty(allHiddenSingles) ? [allHiddenSingles[0]] : allHiddenSingles
            if (!_isEmpty(allHiddenSingles)) availableHintsCount++
            const hintsExceptSingles = HINTS_MENU_ITEMS.filter(({ id: hintId }) => hintId !== HINTS_IDS.NAKED_SINGLE && hintId !== HINTS_IDS.HIDDEN_SINGLE)
            const puzzleSingles = {
                nakedSingles: nakedSinglesMap,
                hiddenSingles: generateSinglesMap(allHiddenSingles),
            }
            const allHintsPromises = _map(hintsExceptSingles, ({ id: hintId }) => rawHintsPromise(hintId, mainNumbers, notes, puzzleSingles))
            return Promise.all(allHintsPromises)
                .then(rawHints => {
                    _forEach(rawHints, ({ id, data } = {}) => {
                        availableRawHints[id] = data
                        if (!_isEmpty(data)) availableHintsCount++
                    })
                })
        })

    const { unmounting } = getState()
    !unmounting && setState({ availableRawHints, availableHintsCount, hintsAnalyzed: true })
}

// TODO: analyze the asynchronous behaviour of this handler
// i really need to brush up asynchronous in js
const rawHintsPromise = (hintId, mainNumbers, notes, singles) => new Promise(resolve => {
    setTimeout(() => {
        getRawHints(hintId, mainNumbers, notes, singles)
            .then(rawHint => resolve({ id: hintId, data: rawHint }))
            .catch(error => {
                consoleLog(hintId, error)
                resolve({ id: hintId, data: [] })
            })
    })
})

const handleMenuItemPress = ({
    getState, params: {
        id, mainNumbers, notes, smartHintsColorSystem, dependencies,
    },
}) => {
    const { availableRawHints } = getState()

    const hints = getTransformedRawHints(id, availableRawHints[id], mainNumbers, notes, smartHintsColorSystem)
    const hintData = {
        mainNumbers: hints[0].hasTryOut ? _cloneDeep(mainNumbers) : null,
        notes: hints[0].hasTryOut ? _cloneDeep(notes) : null,
        hints,
    }

    const { gameStateRepository, smartHintRepository, boardControllerRepository } = dependencies
    smartHintRepository.setHints(hintData)
    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
    boardControllerRepository.setHintsMenuVisibility(false)
}

const handleOverlayPress = ({ params: { dependencies } }) => {
    const { gameStateRepository, boardControllerRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
    boardControllerRepository.setHintsMenuVisibility(false)
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
