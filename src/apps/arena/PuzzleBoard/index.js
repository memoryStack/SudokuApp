import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { SCREEN_NAME } from '@resources/constants'
import withActions from '../../../utils/hocs/withActions'
import { Board } from '../gameBoard'
import { useCacheGameState } from '../hooks/useCacheGameState'
import { getMoves } from '../store/selectors/board.selectors'
import { getGameState } from '../store/selectors/gameState.selectors'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { ACTION_TYPES } from './actionHandlers'
import { useIsHintTryOutStep } from '../utils/smartHints/hooks'
import { isCellFocusedInSmartHint } from '../utils/smartHints/util'
import { useGameBoardInputs } from '../hooks/useGameBoardInputs'
import { ACTION_HANDLERS_CONFIG } from './actionHandlers.config'
import { SMART_HINT_TRY_OUT_ACTION_PROP_NAME } from './constants'
import { isCellTryOutClickable } from '../smartHintHC/helpers'
import { getHintHCInfo, getTryOutClickableCells } from '../store/selectors/smartHintHC.selectors'
import { GameState } from '../utils/classes/gameState'

const PuzzleBoard_ = ({ onAction, [SMART_HINT_TRY_OUT_ACTION_PROP_NAME]: smartHintTryOutOnAction }) => {
    const isHintTryOut = useIsHintTryOutStep()

    const { mainNumbers, selectedCell, notes } = useGameBoardInputs()
    const gameState = useSelector(getGameState)
    const moves = useSelector(getMoves)

    const tryOutClickableCells = useSelector(getTryOutClickableCells)

    const { show: showSmartHint, hint: { cellsToFocusData, svgProps } = {} } = useSelector(getHintHCInfo)

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
            if (showSmartHint) return isHintTryOut ? isCellFocusedInSmartHint(cell, cellsToFocusData) && isCellTryOutClickable(cell, tryOutClickableCells) : false
            return new GameState(gameState).isGameActive()
        }
        if (!isCellClickable()) return

        const handler = isHintTryOut ? smartHintTryOutOnAction : onAction
        handler({ type: ACTION_TYPES.ON_CELL_PRESS, payload: cell })
    }, [onAction, gameState, smartHintTryOutOnAction, showSmartHint, isHintTryOut, tryOutClickableCells, cellsToFocusData])

    const dataToCache = {
        mainNumbers,
        notes,
        moves,
        selectedCell,
    }
    useCacheGameState(GAME_DATA_KEYS.BOARD_DATA, dataToCache)

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
