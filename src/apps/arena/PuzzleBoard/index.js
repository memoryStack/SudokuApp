import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SCREEN_NAME } from '../../../resources/constants'
import withActions from '../../../utils/hocs/withActions'
import { Board } from '../gameBoard'
import { useCacheGameState } from '../hooks/useCacheGameState'
import {
    getMainNumbers,
    getMoves,
    getNotesInfo,
    getPossibleNotes,
    getSelectedCell,
} from '../store/selectors/board.selectors'
import { getGameState } from '../store/selectors/gameState.selectors'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { ACTION_TYPES, ACTION_HANDLERS } from './actionHandlers'

const PuzzleBoard_ = ({ onAction }) => {
    const gameState = useSelector(getGameState)
    const mainNumbers = useSelector(getMainNumbers)
    const notesInfo = useSelector(getNotesInfo)
    const selectedCell = useSelector(getSelectedCell)
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
            onAction={onAction}
        />
    )
}

export const PuzzleBoard = React.memo(withActions(ACTION_HANDLERS)(PuzzleBoard_))
