import _map from '@lodash/map'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'

import { GAME_STATE } from '@resources/constants'

import _cloneDeep from '@lodash/cloneDeep'
import _includes from '@lodash/includes'

import { getTransformedRawHints } from '../utils/smartHints'

import { Puzzle } from '@adapters/puzzle'

import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { BoardIterators } from '../utils/classes/boardIterators'

const onInit = async ({ setState, getState, params: { mainNumbers, notes } }) => {
    const puzzleMainNumbers = []
    BoardIterators.forBoardEachCell(cell => {
        puzzleMainNumbers.push(MainNumbersRecord.getCellMainValue(mainNumbers, cell))
    })
    const puzzle = puzzleMainNumbers.join('')

    const rawHints = await Puzzle.getRawHints(puzzle, notes)

    const availableRawHints = {}
    const hintsIds = Object.keys(rawHints)
    hintsIds.forEach(hintId => {
        availableRawHints[hintId] = [
            rawHints[hintId],
        ]
    })

    const { unmounting } = getState()
    !unmounting && setState({ availableRawHints, availableHintsCount: hintsIds.length, hintsAnalyzed: true })
}

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
