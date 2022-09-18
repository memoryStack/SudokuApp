import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import { SCREEN_NAME } from '../../../resources/constants'
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

const PuzzleBoard_ = ({ onAction, [SMART_HINT_TRY_OUT_ACTION_PROP_NAME]: smartHintTryOutOnAction }) => {
    const isHintTryOut = useIsHintTryOutStep()

    const { mainNumbers, selectedCell, notesInfo } = useGameBoardInputs()
    const gameState = useSelector(getGameState)
    const moves = useSelector(getMoves)

    useEffect(() => {
        return () => {
            onAction({ type: ACTION_TYPES.ON_UNMOUNT })
        }
    }, [])

    useEffect(() => {
        onAction({
            type: ACTION_TYPES.ON_MAIN_NUMBERS_UPDATE,
            payload: mainNumbers,
        })
    }, [mainNumbers])

    const isCellClickable = (cell) => {
        return isHintTryOut && !(isCellFocusedInSmartHint(cell) && isCellTryOutClickable(cell))
    }

    const onCellClick = useCallback(
        cell => {
            if (!isCellClickable(cell)) {
                // TODO: snow a snackBar to communicate the user about what is happening
                return
            }

            const handler = isHintTryOut ? smartHintTryOutOnAction : onAction
            handler({ type: ACTION_TYPES.ON_CELL_PRESS, payload: cell })
        },
        [onAction, isHintTryOut],
    )

    const dataToCache = {
        mainNumbers,
        notesInfo,
        moves,
        selectedCell,
    }
    useCacheGameState(GAME_DATA_KEYS.BOARD_DATA, dataToCache)

    return (
        <Board
            sreenName={SCREEN_NAME.ARENA}
            gameState={gameState}
            mainNumbers={mainNumbers}
            notesInfo={notesInfo}
            selectedCell={selectedCell}
            onCellClick={onCellClick}
            isHintTryOut={isHintTryOut}
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
