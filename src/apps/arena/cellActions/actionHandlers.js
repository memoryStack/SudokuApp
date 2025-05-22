import _isEmpty from '@lodash/isEmpty'
import { GAME_STATE, PENCIL_STATE } from '@resources/constants'

import { isGameActive } from '../utils/util'
import { fastPencilUseCase, undoUseCase } from '@application/usecases/board'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { Puzzle } from '@adapters/puzzle'
import { emit } from '@utils/GlobalEventBus'
import { EVENTS } from 'src/constants/events'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { convertBoardCellToNum } from '@domain/board/utils/cellsTransformers'
import { HINTS_IDS } from '../utils/smartHints/constants'
import _isNil from '@lodash/isNil'
import { showHintHCUseCase } from '../hintsMenu/actionHandlers'

const handleUndoClick = ({ params: { dependencies } }) => {
    const { gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return
    undoUseCase(dependencies)
}

const getNewPencilState = currentState => {
    if (!currentState) return PENCIL_STATE.INACTIVE
    return currentState === PENCIL_STATE.ACTIVE ? PENCIL_STATE.INACTIVE : PENCIL_STATE.ACTIVE
}

const handlePencilClick = ({ params: { dependencies } }) => {
    const { boardControllerRepository, gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    const currentState = boardControllerRepository.getPencil()
    const pencilNewState = getNewPencilState(currentState)
    boardControllerRepository.setPencil(pencilNewState)
    dependencies?.analytics?.sendPencilClickEvent?.({
        statusAfterClick: pencilNewState
    })
}

const handleFastPencilClick = ({ params: { dependencies } }) => {
    const { gameStateRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return
    fastPencilUseCase(dependencies)
}

const getEasiestHintData = (allHints) => {
    const hintsPriorities = [
        HINTS_IDS.NAKED_SINGLE,
        HINTS_IDS.HIDDEN_SINGLE,
        HINTS_IDS.OMISSION,
        HINTS_IDS.NAKED_DOUBLE,
        HINTS_IDS.NAKED_TRIPPLE,
        HINTS_IDS.HIDDEN_DOUBLE,
        HINTS_IDS.HIDDEN_TRIPPLE,
        HINTS_IDS.X_WING,
        HINTS_IDS.Y_WING,
        HINTS_IDS.XYZ_WING,
        HINTS_IDS.EMPTY_RECTANGLE,
        HINTS_IDS.W_WING,
        HINTS_IDS.REMOTE_PAIRS,
        HINTS_IDS.X_CHAIN,
        HINTS_IDS.XY_CHAIN,
        HINTS_IDS.UNIQUE_RECTANGLE,
    ]

    const easiestHintId = hintsPriorities.find((hintId) => {
        return !_isNil(allHints[hintId])
    })

    return {
        id: easiestHintId,
        hint: [allHints[easiestHintId]]
    }
}

const handleHintClick = async ({ params: { dependencies, smartHintsColorSystem } }) => {
    const { gameStateRepository, boardControllerRepository, boardRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    const showAllHints = false

    if (showAllHints) {
        gameStateRepository.setGameState(GAME_STATE.DISPLAY_HINT)
        boardControllerRepository.setHintsMenuVisibility(true)
    } else {
        const mainNumbers = boardRepository.getMainNumbers()
        const notes = boardRepository.getNotes()
        const puzzle = MainNumbersRecord.getPuzzleCurrentMainNumbers(mainNumbers).join('')

        const disabledHints = []
        const rawHints = await Puzzle.getRawHints(puzzle, notes, disabledHints)

        const hintsIds = Object.keys(rawHints)
        if (hintsIds.length) {
            const easiestHint = getEasiestHintData(rawHints)
            showHintHCUseCase({
                mainNumbers,
                notes,
                hintDetails: easiestHint,
                smartHintsColorSystem,
                dependencies
            })
        } else {
            // no hints found
            emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
                msg: 'Oops! no hints are found\nPlease check if all the cells are filled with all the guesses properly. Use Fast Pencil if not done already.',
                visibleTime: 5000,
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

export { ACTION_TYPES, ACTION_HANDLERS }
