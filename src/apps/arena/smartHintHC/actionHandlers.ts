import { GAME_STATE } from '@resources/constants'

import { StatePropsHandlers } from '@utils/hocs/withActions/types'
import { Dependencies } from '@contexts/DependencyContext'
import { applyHintAction, updateSelectedCell } from '../store/actions/board.actions'
import {
    clearHints,
    showNextHint,
    showPrevHint,
    resetStoreState,
    updateTryOutSelectedCell,
    inputTryOutNumber,
    eraseTryOutNumber,
} from '../store/actions/smartHintHC.actions'
import { decreaseAvailableHintsCount } from '../store/actions/boardController.actions'
import { ACTION_TYPES as INPUT_PANEL_ACTION_TYPES } from '../inputPanel/constants'
import { ACTION_TYPES as BOARD_GENERIC_ACTION_TYPES } from '../gameBoard/actionTypes'

import { SMART_HINT_CHANGES_APPLY_DELAY } from './constants'
import { ApplyHint, SelectCellOnClose } from '../utils/smartHints/types'
import { InputNumber } from '../inputPanel'
import { Hint } from '../store/selectors/smartHintHC.selectors'
import { cellHasTryOutInput } from './helpers'

type StateMaintainedByWithActionHOC = {
    focusedCells: Hint['focusedCells']
    styles: {
        snackBar: object
    }
}

const handleOnInit = ({ setState, params: { focusedCells, styles } } : StatePropsHandlers & { params: StateMaintainedByWithActionHOC }) => {
    setState({ focusedCells, styles })
}

const handleOnClose = ({ params: { newCellToSelect, dependencies } }: {
        params: { newCellToSelect: SelectCellOnClose, dependencies: Dependencies }
    }) => {
    if (newCellToSelect) updateSelectedCell(newCellToSelect)
    clearHints()

    const { gameStateRepository } = dependencies
    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
}

const handleNextClick = () => {
    showNextHint()
}

const handlePrevClick = () => showPrevHint()

const handleResetStoreState = () => {
    resetStoreState()
}

const handleCellClick = ({ params: cell } : { params: Cell }) => {
    updateTryOutSelectedCell(cell)
}

const handleNumberClick = ({ getState, params: { number, selectedCell } }: StatePropsHandlers & { params: { number: InputNumber, selectedCell: Cell } }) => {
    const { focusedCells, styles } = getState() as StateMaintainedByWithActionHOC

    const isCellFilledInTryOut = cellHasTryOutInput(selectedCell)
    if (isCellFilledInTryOut) {
        handleEraserClick({ getState } as StatePropsHandlers)
    }
    inputTryOutNumber(number, focusedCells, styles.snackBar)
}

const handleEraserClick = ({ getState } : StatePropsHandlers) => {
    const { focusedCells, styles } = getState() as StateMaintainedByWithActionHOC
    eraseTryOutNumber(focusedCells, styles.snackBar)
}

const handleApplyHintClick = ({ params: applyHintChanges } : { params: ApplyHint }) => {
    setTimeout(() => {
        applyHintAction(applyHintChanges)
        decreaseAvailableHintsCount()
    }, SMART_HINT_CHANGES_APPLY_DELAY)
}

const ACTION_TYPES = {
    ON_INIT: 'ON_INIT',
    ON_UNMOUNT: 'ON_UNMOUNT',
    ON_CLOSE: 'ON_CLOSE',
    ON_NEXT_CLICK: 'ON_NEXT_CLICK',
    ON_PREV_CLICK: 'ON_PREV_CLICK',
    ON_APPLY_HINT_CLICK: 'ON_APPLY_HINT_CLICK',
    ...INPUT_PANEL_ACTION_TYPES,
    ...BOARD_GENERIC_ACTION_TYPES,
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_INIT]: handleOnInit,
    [ACTION_TYPES.ON_CLOSE]: handleOnClose,
    [ACTION_TYPES.ON_NEXT_CLICK]: handleNextClick,
    [ACTION_TYPES.ON_PREV_CLICK]: handlePrevClick,
    [ACTION_TYPES.ON_UNMOUNT]: handleResetStoreState,
    [ACTION_TYPES.ON_CELL_PRESS]: handleCellClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_APPLY_HINT_CLICK]: handleApplyHintClick,
}

export { ACTION_TYPES, ACTION_HANDLERS }
