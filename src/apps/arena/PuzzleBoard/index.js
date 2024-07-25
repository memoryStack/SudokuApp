import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { GAME_STATE } from '@resources/constants'

import { emit } from '@utils/GlobalEventBus'

import _get from '@lodash/get'
import { useStyles } from '@utils/customHooks/useStyles'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import _isNil from '@lodash/isNil'
import _includes from '@lodash/includes'
import { useDependency } from '../../../hooks/useDependency'
import { EVENTS } from '../../../constants/events'
import withActions from '../../../utils/hocs/withActions'

import { Board } from '../gameBoard'
import { getGameState } from '../store/selectors/gameState.selectors'
import { useGameBoardInputs, useSavePuzzleState } from '../hooks/useGameBoardInputs'
import {
    getCellToFocusData, getShowSmartHint, getSvgPropsData,
} from '../store/selectors/smartHintHC.selectors'
import { cellHasTryOutInput, removableNoteFilledInCell } from '../smartHintHC/helpers'
import { GameState } from '../utils/classes/gameState'
import { useHintHasTryOutStep, useIsHintTryOutStep } from '../hooks/smartHints'
import {
    areCommonHouseCells, areSameCells, isCellExists, sameValueInCells,
} from '../utils/util'
import { isCellFocusedInSmartHint } from '../utils/smartHints/util'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

import { ACTION_TYPES } from './actionHandlers'
import { ACTION_HANDLERS_CONFIG } from './actionHandlers.config'
import { SMART_HINT_TRY_OUT_ACTION_PROP_NAME } from './constants'
import { getStyles } from './puzzleBoard.styles'
import { convertBoardCellToNum } from '@domain/board/utils/cellsTransformers'

const PuzzleBoard_ = ({ onAction, [SMART_HINT_TRY_OUT_ACTION_PROP_NAME]: smartHintTryOutOnAction }) => {
    const dependencies = useDependency()
    const hasTryOut = useHintHasTryOutStep()
    const isHintTryOut = useIsHintTryOutStep(true)

    const styles = useStyles(getStyles)

    const { mainNumbers, selectedCell, notes } = useGameBoardInputs()
    const gameState = useSelector(getGameState)

    useSavePuzzleState()

    const showSmartHint = useSelector(getShowSmartHint)
    const cellsToFocusData = useSelector(getCellToFocusData)
    const svgProps = useSelector(getSvgPropsData)

    useEffect(() => () => {
        onAction({ type: ACTION_TYPES.ON_UNMOUNT })
    }, [onAction])

    useEffect(() => {
        onAction({
            type: ACTION_TYPES.ON_MAIN_NUMBERS_UPDATE,
            payload: { mainNumbers, dependencies },
        })
    }, [onAction, mainNumbers, dependencies])

    const onCellClick = useCallback(cell => {
        const isCellClickable = () => {
            if (showSmartHint) {
                if (isHintTryOut) {
                    const { smartHintRepository } = dependencies
                    const isCellClickableInTryOut = isCellExists(cell, smartHintRepository.getTryOutClickableCells())
                    if (!isCellClickableInTryOut) {
                        emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
                            msg: smartHintRepository.getUnclickableCellClickInTryOutMsg(),
                            visibleTime: 7000,
                        })
                    }
                    return isCellClickableInTryOut
                }
                if (hasTryOut) {
                    emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
                        msg: 'click on Next button and go to last step to select cell',
                        visibleTime: 5000,
                    })
                }
                return false
            }
            return new GameState(gameState).isGameActive()
        }
        if (!isCellClickable()) return

        const handler = isHintTryOut ? smartHintTryOutOnAction : onAction
        handler({ type: ACTION_TYPES.ON_CELL_PRESS, payload: { cell, dependencies } })
    }, [onAction, gameState, smartHintTryOutOnAction, showSmartHint, isHintTryOut, hasTryOut, dependencies])

    const showCellContent = [GAME_STATE.ACTIVE, GAME_STATE.DISPLAY_HINT, GAME_STATE.OVER_SOLVED, GAME_STATE.OVER_UNSOLVED]
        .includes(gameState)

    const getSmartHintActiveBgColor = cell => {
        if (isHintTryOut && areSameCells(cell, selectedCell) && isCellFocusedInSmartHint(cell, cellsToFocusData)) { return styles.selectedCellBGColor }
        return _get(cellsToFocusData, [cell.row, cell.col, 'bgColor'], styles.smartHintOutOfFocusBGColor)
    }

    const getActiveGameBoardCellBgCell = cell => {
        if (MainNumbersRecord.isCellFilled(mainNumbers, cell) && !MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) {
            return styles.sameHouseSameValueBGColor
        }

        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor
        if (areCommonHouseCells(cell, selectedCell)) return styles.sameHouseCellBGColor

        if (sameValueInCells(cell, selectedCell, mainNumbers)) return styles.diffHouseSameValueBGColor
        return styles.defaultCellBGColor
    }

    const getCellBGColor = cell => {
        if (!showCellContent) return null
        if (showSmartHint) return getSmartHintActiveBgColor(cell)
        return getActiveGameBoardCellBgCell(cell)
    }

    const getCellMainNumberFontColor = cell => {
        const { smartHintRepository, boardRepository } = dependencies
        const actualMainNumbers = boardRepository.getMainNumbers()
        if (isHintTryOut && cellHasTryOutInput(cell, { tryOutMainNumbers: mainNumbers, actualMainNumbers })) {
            const removableNotes = smartHintRepository.getRemovableNotes()

            const tryOutInputsColors = smartHintRepository.getTryOutInputsColors()
            const cellNum = convertBoardCellToNum(cell)
            const cellMainValue = MainNumbersRecord.getCellMainValue(mainNumbers, cell)
            const fontColor = _get(tryOutInputsColors, [cellNum, cellMainValue])
            if (!_isNil(fontColor)) {
                return { color: fontColor }
            }

            return removableNoteFilledInCell(cell, removableNotes, mainNumbers) ? styles.removableNoteTryOutInputColor
                : styles.tryOutInputColor
        }

        if (showSmartHint) return styles.clueNumColor
        if (!MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) return styles.wronglyFilledNumColor
        if (!MainNumbersRecord.isClueCell(mainNumbers, cell)) return styles.userFilledNumColor

        return styles.clueNumColor
    }

    const selectedCellMainNumber = MainNumbersRecord.getCellMainValue(mainNumbers, selectedCell)

    const getNoteStyles = useCallback(({ noteValue, show }, cell) => {
        if (!show) return null
        if (showSmartHint) {
            const noteColor = _get(cellsToFocusData, [cell.row, cell.col, 'notesToHighlightData', noteValue, 'fontColor'], null)
            if (!noteColor) return null
            return {
                color: noteColor,
                fontWeight: FONT_WEIGHTS.HEAVY,
            }
        }

        if (noteValue === selectedCellMainNumber) return styles.selectedMainNumberNote

        return null
    }, [showSmartHint, cellsToFocusData, selectedCellMainNumber])

    return (
        <Board
            mainNumbers={mainNumbers}
            notes={notes}
            onCellClick={onCellClick}
            isHintTryOut={isHintTryOut}
            cellsHighlightData={cellsToFocusData}
            svgProps={svgProps}
            showCellContent={showCellContent}
            getCellBGColor={getCellBGColor}
            getCellMainNumberFontColor={getCellMainNumberFontColor}
            axisTextStyles={showSmartHint ? styles.smartHintAxisText : null}
            boardContainerStyles={showSmartHint ? styles.smartHintBoardContainer : null}
            getNoteStyles={getNoteStyles}
            showHintsSVGView={!_isNil(svgProps) && _includes([GAME_STATE.ACTIVE, GAME_STATE.DISPLAY_HINT], gameState)}
        />
    )
}

export const PuzzleBoard = React.memo(withActions({ actionHandlers: ACTION_HANDLERS_CONFIG })(PuzzleBoard_))

PuzzleBoard_.propTypes = {
    onAction: PropTypes.func,
    [SMART_HINT_TRY_OUT_ACTION_PROP_NAME]: PropTypes.func,
}

PuzzleBoard_.defaultProps = {
    onAction: _noop,
    [SMART_HINT_TRY_OUT_ACTION_PROP_NAME]: _noop,
}
