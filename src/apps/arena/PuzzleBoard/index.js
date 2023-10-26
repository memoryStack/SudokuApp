import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { SCREEN_NAME } from '@resources/constants'

import { emit } from '@utils/GlobalEventBus'

import { EVENTS } from '../../../constants/events'
import withActions from '../../../utils/hocs/withActions'

import { Board } from '../gameBoard'
import { getGameState } from '../store/selectors/gameState.selectors'
import { isCellFocusedInSmartHint } from '../utils/smartHints/util'
import { useGameBoardInputs, useSavePuzzleState } from '../hooks/useGameBoardInputs'
import { isCellTryOutClickable } from '../smartHintHC/helpers'
import { getHintHCInfo } from '../store/selectors/smartHintHC.selectors'
import { GameState } from '../utils/classes/gameState'
import { useHintHasTryOutStep, useIsHintTryOutStep } from '../hooks/smartHints'

import { ACTION_TYPES } from './actionHandlers'
import { ACTION_HANDLERS_CONFIG } from './actionHandlers.config'
import { SMART_HINT_TRY_OUT_ACTION_PROP_NAME } from './constants'

const PuzzleBoard_ = ({ onAction, [SMART_HINT_TRY_OUT_ACTION_PROP_NAME]: smartHintTryOutOnAction }) => {
    const hasTryOut = useHintHasTryOutStep()
    const isHintTryOut = useIsHintTryOutStep()

    const { mainNumbers, selectedCell, notes } = useGameBoardInputs()
    const gameState = useSelector(getGameState)

    useSavePuzzleState()

    const { show: showSmartHint, hint: { cellsToFocusData = {}, svgProps } = {} } = useSelector(getHintHCInfo)

    useEffect(() => () => {
        onAction({ type: ACTION_TYPES.ON_UNMOUNT })
    }, [onAction])

    useEffect(() => {
        onAction({
            type: ACTION_TYPES.ON_MAIN_NUMBERS_UPDATE,
            payload: mainNumbers,
        })
    }, [onAction, mainNumbers])

    const onCellClick = useCallback(cell => {
        const isCellClickable = () => {
            if (showSmartHint) {
                if (isHintTryOut) {
                    // TODO: show snack bar here
                    return isCellFocusedInSmartHint(cell) && isCellTryOutClickable(cell)
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
        handler({ type: ACTION_TYPES.ON_CELL_PRESS, payload: cell })
    }, [onAction, gameState, smartHintTryOutOnAction, showSmartHint, isHintTryOut, hasTryOut])

    return (
        <Board
            sreenName={SCREEN_NAME.ARENA}
            gameState={gameState}
            mainNumbers={mainNumbers}
            notes={notes}
            selectedCell={selectedCell}
            onCellClick={onCellClick}
            isHintTryOut={isHintTryOut}
            showSmartHint={showSmartHint}
            cellsHighlightData={cellsToFocusData}
            svgProps={svgProps}
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
