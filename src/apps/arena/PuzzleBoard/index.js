import React from "react"
import { useSelector } from 'react-redux'
import { SCREEN_NAME } from "../../../resources/constants"
import withActions from "../../../utils/hocs/withActions"
import { Board } from "../gameBoard"
import { getMainNumbers, getNotesInfo, getSelectedCell } from "../store/selectors/board.selectors"
import { getGameState } from "../store/selectors/gameState.selectors"
import { ACTION_HANDLERS } from "./actionHandlers"

const PuzzleBoard_ = ({
    onAction
}) => {

    const gameState = useSelector(getGameState)
    const mainNumbers = useSelector(getMainNumbers)
    const notesInfo = useSelector(getNotesInfo)
    const selectedCell = useSelector(getSelectedCell)

    return (
        <Board
            sreenName={ SCREEN_NAME.ARENA }
            gameState={gameState}
            mainNumbers={mainNumbers}
            notesInfo={notesInfo}
            selectedCell={selectedCell}
            onAction={onAction}
        />
    )
}

export const PuzzleBoard = React.memo(withActions(ACTION_HANDLERS) (PuzzleBoard_))
