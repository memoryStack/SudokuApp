import _map from '@lodash/map'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'

import { GAME_STATE } from '@resources/constants'

import _cloneDeep from '@lodash/cloneDeep'
import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'
import _includes from '@lodash/includes'
import { consoleLog } from '../../../utils/util'

import { getRawHints, getTransformedRawHints } from '../utils/smartHints'

import { HINTS_IDS, HINTS_MENU_ITEMS } from '../utils/smartHints/constants'
import { generateSinglesMap } from '../utils/smartHints/util'
import { BoardIterators } from '../utils/classes/boardIterators'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'

const getPuzzleString = mainNumbers => {
    const result = []
    BoardIterators.forBoardEachCell(cell => {
        result.push(MainNumbersRecord.getCellMainValue(mainNumbers, cell))
    })
    return result.join('')
}

const getNativeRawHints = async (mainNumbers, notes) => {
    const hints = await RNSudokuPuzzle.getRawHints(getPuzzleString(mainNumbers), notes)

    const result = {}

    const hintsIds = Object.keys(hints)
    hintsIds.forEach(hintId => {
        result[hintId] = [
            hints[hintId],
        ]
    })

    return result
}

const onInit = async ({ setState, getState, params: { mainNumbers, notes } }) => {
    let availableHintsCount = 0
    const availableRawHints = {}
    let nakedSinglesMap = {}

    // const hints = await RNSudokuPuzzle.getRawHints('sdfs', notes)
    // consoleLog('@@@@@@ hints', hints)

    const nativeHints = await getNativeRawHints(mainNumbers, notes)
    consoleLog('@@@@@@ native hints', JSON.stringify(nativeHints))

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

            const hintsToExclude = [
                HINTS_IDS.NAKED_SINGLE,
                HINTS_IDS.HIDDEN_SINGLE,
                HINTS_IDS.NAKED_DOUBLE,
                HINTS_IDS.NAKED_TRIPPLE,
                HINTS_IDS.HIDDEN_DOUBLE,
                HINTS_IDS.HIDDEN_TRIPPLE,
                HINTS_IDS.Y_WING,
            ]

            const hintsExceptSingles = HINTS_MENU_ITEMS.filter(({ id: hintId }) => !_includes(hintsToExclude, hintId))
            const puzzleSingles = {
                nakedSingles: nakedSinglesMap,
                hiddenSingles: generateSinglesMap(allHiddenSingles),
            }

            console.log('@@@@ singles', JSON.stringify(puzzleSingles))

            const allHintsPromises = _map(hintsExceptSingles, ({ id: hintId }) => rawHintsPromise(hintId, mainNumbers, notes, puzzleSingles))
            return Promise.all(allHintsPromises)
                .then(rawHints => {
                    _forEach(rawHints, ({ id, data } = {}) => {
                        availableRawHints[id] = data
                        if (!_isEmpty(data)) availableHintsCount++
                    })
                })
        })

    console.log('@@@@ js hints ywing', JSON.stringify(availableRawHints.X_WING))


    const { unmounting } = getState()
    !unmounting && setState({ availableRawHints: { ...availableRawHints, ...nativeHints }, availableHintsCount, hintsAnalyzed: true })
    // !unmounting && setState({ availableRawHints, availableHintsCount, hintsAnalyzed: true })
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
