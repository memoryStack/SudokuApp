import { GAME_STATE } from '@resources/constants'

import { StatePropsHandlers } from '@utils/hocs/withActions/types'
import _isEmpty from '@lodash/isEmpty'
import { ACTION_TYPES as INPUT_PANEL_ACTION_TYPES } from '../inputPanel/constants'
import { ACTION_TYPES as BOARD_GENERIC_ACTION_TYPES } from '../gameBoard/actionTypes'

import { SMART_HINT_CHANGES_APPLY_DELAY } from './constants'
import { ApplyHint, SelectCellOnClose } from '../utils/smartHints/types'
import { InputNumber } from '../inputPanel'
import { Hint } from '../store/selectors/smartHintHC.selectors'
import { cellHasTryOutInput } from './helpers'
import { applyHintUseCase, updateUserActivityTime } from '@application/usecases/board'
import { eraseTryOutNumberUseCase, inputTryOutNumberUseCase, isValidInputNumberClick } from '@application/usecases/smartHint/smartHint'
import { ArenaAnalyticsHandler, HintVisibleEventData, ScreenAnalyticsHandlers } from '@application/adapterInterfaces/analytics'
import type { Dependencies } from '@contexts/DependencyContext'
import { areSameCells } from '@domain/board/utils/housesAndCells'
import { SOUNDS } from 'src/interfaces/soundAdapter'
import _noop from '@lodash/noop'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

type StateMaintainedByWithActionHOC = {
    focusedCells: Hint['focusedCells']
    styles: {
        snackBar: object
    }
    analyticsData: HintVisibleEventData
    // analytics: ScreenAnalyticsHandlers
    analytics: ArenaAnalyticsHandler
    sentHintTryoutEvent: boolean
    dependencies: Dependencies
}

const handleOnInit = ({ setState, params: { focusedCells, styles, dependencies, analytics, analyticsData } }: StatePropsHandlers & {
    params: StateMaintainedByWithActionHOC
}) => {
    setState({ focusedCells, styles })
    analytics?.sendSmartHintVisibleEvent?.(analyticsData)
    dependencies?.smartHintRepository?.setUserSawAHint()
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

    if (areSameCells(cell, smartHintRepository.getTryOutSelectedCell() as Cell)) return
    smartHintRepository.setTryOutSelectedCell(cell)
    dependencies?.soundAdapter?.play(SOUNDS.CELL_CLICK)
}

const sendTryoutUsedEvent = ({
    getState,
    setState,
    dependencies,
    hintId
}: StatePropsHandlers & { dependencies: Dependencies, hintId: string }) => {
    const { sentHintTryoutEvent = false } = getState() as StateMaintainedByWithActionHOC
    if (!sentHintTryoutEvent) {
        (dependencies?.analytics as ArenaAnalyticsHandler).sendHintTryoutUsedEvent({ hint: hintId })
        setState({ sentHintTryoutEvent: true })
    }
}

const handleNumberClick = ({
    getState,
    setState,
    params: { number, selectedCell, dependencies, hintId },
}: StatePropsHandlers & { params: { number: InputNumber, selectedCell: Cell, dependencies: Dependencies, hintId: string } }) => {
    const { focusedCells, styles } = getState() as StateMaintainedByWithActionHOC

    const { smartHintRepository, boardRepository } = dependencies
    const tryOutMainNumbers = smartHintRepository.getTryOutMainNumbers()
    const filledNumberInCell = MainNumbersRecord.getCellMainValue(tryOutMainNumbers as MainNumbers, selectedCell)
    if (filledNumberInCell === number) return

    const isCellFilledInTryOut = cellHasTryOutInput(selectedCell, {
        tryOutMainNumbers: tryOutMainNumbers as MainNumbers,
        actualMainNumbers: boardRepository.getMainNumbers(),
    })

    const numberWillBeInserted = isValidInputNumberClick(number, smartHintRepository)
    if (numberWillBeInserted && isCellFilledInTryOut) {
        handleEraserClick({ getState, setState, params: { dependencies, hintId, avoidEraseSound: true } })
    }
    inputTryOutNumberUseCase(number, focusedCells, styles.snackBar, {
        ...dependencies,
        sound: {
            play: () => dependencies?.soundAdapter?.play?.(SOUNDS.NUMBER_INPUT)
        }
    })

    sendTryoutUsedEvent({
        getState,
        setState,
        dependencies,
        hintId
    })
}

const handleEraserClick = ({
    getState, setState, params: { dependencies, hintId, avoidEraseSound },
}: StatePropsHandlers & { params: { dependencies: Dependencies, hintId: string, avoidEraseSound?: boolean } }) => {
    const { focusedCells, styles } = getState() as StateMaintainedByWithActionHOC
    eraseTryOutNumberUseCase(focusedCells, styles.snackBar, {
        ...dependencies,
        sound: {
            play: avoidEraseSound ? _noop : () => dependencies?.soundAdapter?.play?.(SOUNDS.ERASER_CLICK)
        }
    })
    sendTryoutUsedEvent({
        getState,
        setState,
        dependencies,
        hintId
    })
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
