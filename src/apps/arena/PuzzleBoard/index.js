import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SCREEN_NAME } from '../../../resources/constants'
import withActions from '../../../utils/hocs/withActions'
import { consoleLog } from '../../../utils/util'
import { Board } from '../gameBoard'
import { useCacheGameState } from '../hooks/useCacheGameState'
import { getMainNumbers, getMoves, getNotesInfo, getSelectedCell } from '../store/selectors/board.selectors'
import { getGameState } from '../store/selectors/gameState.selectors'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { ACTION_TYPES, ACTION_HANDLERS } from './actionHandlers'
import { ACTION_HANDLERS as SMART_HINT_ACTION_HANDLERS } from '../smartHintHC/actionHandlers'

const useGameBoardData = (isHintTryOut) => {
    
    const mainNumbers = useSelector(getMainNumbers)
    const selectedCell = useSelector(getSelectedCell)

    return {
        mainNumbers,
        selectedCell,
    }
}

const PuzzleBoard_ = ({ onAction, ...rest }) => {

    const isHintTryOut = false

    const { mainNumbers, selectedCell } = useGameBoardData(isHintTryOut)
    const gameState = useSelector(getGameState)
    const notesInfo = useSelector(getNotesInfo)
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

    const onCellClick = useCallback((cell) => {
        onAction({ type: ACTION_TYPES.ON_CELL_PRESS, payload: cell })
    }, [onAction])

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
        />
    )
}

const ACTION_HANDLERS_CONFIG = [
    {
        actionHandlers: ACTION_HANDLERS
    },
    {
        onActionPropAlias: 'smartHintTryOutOnAction',
        actionHandlers: SMART_HINT_ACTION_HANDLERS,
    }
]

export const PuzzleBoard = React.memo(
    withActions({ actionHandlers: ACTION_HANDLERS_CONFIG })
    (PuzzleBoard_)
)
