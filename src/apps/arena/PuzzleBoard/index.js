import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SCREEN_NAME } from '../../../resources/constants'
import withActions from '../../../utils/hocs/withActions'
import { consoleLog } from '../../../utils/util'
import { Board } from '../gameBoard'
import { useCacheGameState } from '../hooks/useCacheGameState'
import { getMoves } from '../store/selectors/board.selectors'
import { getGameState } from '../store/selectors/gameState.selectors'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { ACTION_TYPES, ACTION_HANDLERS } from './actionHandlers'
import { ACTION_HANDLERS as SMART_HINT_ACTION_HANDLERS } from '../smartHintHC/actionHandlers'
import { useCellFocus, useIsHintTryOutStep } from '../utils/smartHints/hooks'
import { useGameBoardInputs } from '../hooks/useGameBoardInputs'

const PuzzleBoard_ = ({ onAction, ...restProps }) => {

    const isHintTryOut = useIsHintTryOutStep()
    const isCellFocusedInSmartHint = useCellFocus()

    const { mainNumbers, selectedCell, notesInfo } = useGameBoardInputs()
    const gameState = useSelector(getGameState)
    const moves = useSelector(getMoves)

    const smartHintTryOutOnAction = restProps['smartHintTryOutOnAction']

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

    const onCellClick = useCallback((cell) => {
        if (isHintTryOut && !isCellFocusedInSmartHint(cell)) return
        
        const actionHandler = isHintTryOut ? smartHintTryOutOnAction : onAction
        actionHandler({ type: ACTION_TYPES.ON_CELL_PRESS, payload: cell })
    }, [onAction, isHintTryOut])

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

// TODO: seperate it out
const ACTION_HANDLERS_CONFIG = [
    {
        actionHandlers: ACTION_HANDLERS
    },
    {
        onActionPropAlias: 'smartHintTryOutOnAction', // TODO: make it as as constant
        actionHandlers: SMART_HINT_ACTION_HANDLERS,
    }
]

export const PuzzleBoard = React.memo(withActions({ actionHandlers: ACTION_HANDLERS_CONFIG })(PuzzleBoard_))
