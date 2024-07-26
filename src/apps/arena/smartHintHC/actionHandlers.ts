import { GAME_STATE } from '@resources/constants'

import { StatePropsHandlers } from '@utils/hocs/withActions/types'
import { Dependencies } from '@contexts/DependencyContext'
import _isEmpty from '@lodash/isEmpty'
import { ACTION_TYPES as INPUT_PANEL_ACTION_TYPES } from '../inputPanel/constants'
import { ACTION_TYPES as BOARD_GENERIC_ACTION_TYPES } from '../gameBoard/actionTypes'

import { SMART_HINT_CHANGES_APPLY_DELAY } from './constants'
import { ApplyHint, SelectCellOnClose } from '../utils/smartHints/types'
import { InputNumber } from '../inputPanel'
import { Hint } from '../store/selectors/smartHintHC.selectors'
import { cellHasTryOutInput } from './helpers'
import { applyHintUseCase } from '@application/usecases/board'
import { eraseTryOutNumberUseCase, inputTryOutNumberUseCase } from '@application/usecases/smartHint/smartHint'

type StateMaintainedByWithActionHOC = {
    focusedCells: Hint['focusedCells']
    styles: {
        snackBar: object
    }
}

const handleOnInit = ({ setState, params: { focusedCells, styles } }: StatePropsHandlers & { params: StateMaintainedByWithActionHOC }) => {
    setState({ focusedCells, styles })
}

const handleOnClose = ({ params: { newCellToSelect, dependencies } }: {
    params: { newCellToSelect: SelectCellOnClose, dependencies: Dependencies }
}) => {
    const { gameStateRepository, smartHintRepository, boardRepository } = dependencies
    if (newCellToSelect) boardRepository.setSelectedCell(newCellToSelect)
    smartHintRepository.removeHints()
    gameStateRepository.setGameState(GAME_STATE.ACTIVE)
}

const handleNextClick = ({ params: { dependencies } }: { params: { dependencies: Dependencies } }) => {
    const { smartHintRepository } = dependencies

    const currentStep = smartHintRepository.getHintStepNumber()
    smartHintRepository.setHintStepNumber(currentStep + 1)
}

const handlePrevClick = ({ params: { dependencies } }: { params: { dependencies: Dependencies } }) => {
    const { smartHintRepository } = dependencies

    const currentStep = smartHintRepository.getHintStepNumber()
    smartHintRepository.setHintStepNumber(currentStep - 1)
}

const handleCellClick = ({ params: { cell, dependencies } }: { params: { cell: Cell, dependencies: Dependencies } }) => {
    const { smartHintRepository } = dependencies
    smartHintRepository.setTryOutSelectedCell(cell)
}

const handleNumberClick = ({
    getState,
    setState,
    params: { number, selectedCell, dependencies },
}: StatePropsHandlers & { params: { number: InputNumber, selectedCell: Cell, dependencies: Dependencies } }) => {
    const { focusedCells, styles } = getState() as StateMaintainedByWithActionHOC

    const { smartHintRepository, boardRepository } = dependencies
    const isCellFilledInTryOut = cellHasTryOutInput(selectedCell, {
        tryOutMainNumbers: smartHintRepository.getTryOutMainNumbers() as MainNumbers,
        actualMainNumbers: boardRepository.getMainNumbers(),
    })
    if (isCellFilledInTryOut) {
        handleEraserClick({ getState, setState, params: { dependencies } })
    }

    inputTryOutNumberUseCase(number, focusedCells, styles.snackBar, dependencies)
}

const handleEraserClick = ({
    getState, params: { dependencies },
}: StatePropsHandlers & { params: { dependencies: Dependencies } }) => {
    const { focusedCells, styles } = getState() as StateMaintainedByWithActionHOC
    eraseTryOutNumberUseCase(focusedCells, styles.snackBar, dependencies)
}

const handleApplyHintClick = ({ params: { applyHintChanges, dependencies } }: { params: { applyHintChanges: ApplyHint, dependencies: Dependencies } }) => {
    setTimeout(() => {
        applyHintUseCase(applyHintChanges, dependencies)

        const { boardControllerRepository } = dependencies
        const availableHints = boardControllerRepository.getHintsLeftCount()
        boardControllerRepository.setHintsLeftCount(availableHints - 1)
    }, SMART_HINT_CHANGES_APPLY_DELAY)
}

const ACTION_TYPES = {
    ON_INIT: 'ON_INIT',
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
    [ACTION_TYPES.ON_CELL_PRESS]: handleCellClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_APPLY_HINT_CLICK]: handleApplyHintClick,
}

export { ACTION_TYPES, ACTION_HANDLERS }
