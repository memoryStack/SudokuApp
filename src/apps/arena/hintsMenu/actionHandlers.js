import _map from '@lodash/map'
import _forEach from '@lodash/forEach'
import _isEmpty from '@lodash/isEmpty'

import { GAME_STATE } from '@resources/constants'

import _cloneDeep from '@lodash/cloneDeep'
import _includes from '@lodash/includes'

import { getTransformedRawHints } from '../utils/smartHints'

import { Puzzle } from '@adapters/puzzle'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { emit } from '@utils/GlobalEventBus'
import { EVENTS } from 'src/constants/events'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { convertBoardCellToNum } from '@domain/board/utils/cellsTransformers'
import { showHowToGetHintsCoachMarksUseCase } from '@application/usecases/smartHint/smartHint'

const onInit = async ({ setState, getState, params: { mainNumbers, notes, dependencies } }) => {
    const puzzle = MainNumbersRecord.getPuzzleCurrentMainNumbers(mainNumbers).join('')
    const disabledHints = []
    const rawHints = await Puzzle.getRawHints(puzzle, notes, disabledHints)

    const availableRawHints = {}
    const hintsIds = Object.keys(rawHints)
    hintsIds.forEach(hintId => {
        availableRawHints[hintId] = [
            rawHints[hintId],
        ]
    })

    const availableHintsCount = hintsIds.length
    const { unmounting } = getState()
    !unmounting && setState({ availableRawHints, availableHintsCount, hintsAnalyzed: true })

    if (availableHintsCount === 0) {
        emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
            msg: 'Oops! no hints are found\nFill some guesses in puzzle and then click "Hint"',
            visibleTime: 3000,
            customStyles: {
                bottom: 50,
            },
        })

        const boardNotes = {}
        BoardIterators.forBoardEachCell((cell) => {
            const cellNotes = NotesRecord.getCellVisibleNotesList(notes, cell)
            if (cellNotes.length) boardNotes[convertBoardCellToNum(cell)] = cellNotes.join('')
        })
        dependencies?.analytics.sendNoHintsFoundEvent?.({
            originalPuzzle: MainNumbersRecord.getOriginalPuzzleMainNumbers(mainNumbers).join(''),
            puzzleCurrentState: {
                mainNumbers: puzzle,
                notes: boardNotes
            }
        })
    }
}

const onUnmount = async ({ getState, params: { dependencies } }) => {
    return
    const {
        availableHintsCount
    } = getState()

    const showCoachMarks = await showHowToGetHintsCoachMarksUseCase(
        availableHintsCount,
        dependencies
    )

    if (showCoachMarks) {
        setTimeout(() => {
            emit(EVENTS.LOCAL.COACHMARKS.HOW_TO_GET_HINTS)
        }, 1000)
    }
}

export const showHintHCUseCase = ({
    mainNumbers,
    notes,
    hintDetails,
    smartHintsColorSystem,
    dependencies
}) => {
    const { id, hint } = hintDetails
    const hints = getTransformedRawHints(id, hint, mainNumbers, notes, smartHintsColorSystem)
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

const handleMenuItemPress = ({
    getState, params: {
        id, mainNumbers, notes, smartHintsColorSystem, dependencies,
    },
}) => {
    const { availableRawHints } = getState()

    showHintHCUseCase({
        mainNumbers, notes, smartHintsColorSystem, hintDetails: { id, hint: availableRawHints[id] }, dependencies
    })

    // const hints = getTransformedRawHints(id, availableRawHints[id], mainNumbers, notes, smartHintsColorSystem)
    // const hintData = {
    //     mainNumbers: hints[0].hasTryOut ? _cloneDeep(mainNumbers) : null,
    //     notes: hints[0].hasTryOut ? _cloneDeep(notes) : null,
    //     hints,
    // }

    // const { gameStateRepository, smartHintRepository, boardControllerRepository } = dependencies
    // smartHintRepository.setHints(hintData)
    // gameStateRepository.setGameState(GAME_STATE.ACTIVE)
    // boardControllerRepository.setHintsMenuVisibility(false)
}

const handleOverlayPress = ({ params: { dependencies } }) => {
    const { gameStateRepository, boardControllerRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
    boardControllerRepository.setHintsMenuVisibility(false)
}

const ACTION_TYPES = {
    ON_INIT: 'ON_INIT',
    ON_UNMOUNT: 'ON_UNMOUNT',
    ON_OVERLAY_CONTAINER_PRESS: 'ON_OVERLAY_CONTAINER_PRESS',
    ON_MENU_ITEM_PRESS: 'ON_MENU_ITEM_PRESS',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_INIT]: onInit,
    [ACTION_TYPES.ON_UNMOUNT]: onUnmount,
    [ACTION_TYPES.ON_OVERLAY_CONTAINER_PRESS]: handleOverlayPress,
    [ACTION_TYPES.ON_MENU_ITEM_PRESS]: handleMenuItemPress,
}

export { ACTION_TYPES, ACTION_HANDLERS }
