import { useRef, useEffect } from 'react'
import { EVENTS } from '../../../resources/constants'
import { addListener, removeListener } from '../../../utils/GlobalEventBus'
import { cacheGameData, GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { useSelector } from 'react-redux'
import {
    updateMainNumbers,
    updateSelectedCell,
    updateNotes,
} from '../store/actions/board.actions'
import { getMainNumbers, getNotesInfo, getSelectedCell } from '../store/selectors/board.selectors'

const initBoardData = () => {
    const movesStack = []
    return {
        movesStack,
    }
}

const isPuzzleSolved = mainNumbers => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (!mainNumbers[row][col].value) return false
        }
    }
    return true
}

const useGameBoard = () => {
    const { movesStack: initialmovesStack } = useRef(initBoardData()).current

    const movesStack = useRef(initialmovesStack)

    const mainNumbers = useSelector(getMainNumbers)
    const selectedCell = useSelector(getSelectedCell)
    const notesInfo = useSelector(getNotesInfo)

    const setBoardData = ({ mainNumbers, notesInfo, selectedCell, movesStack: moves }) => {
        movesStack.current = moves
        updateMainNumbers(mainNumbers)
        updateNotes(notesInfo)
        updateSelectedCell(selectedCell)
    }

    useEffect(() => {
        const handler = previousGameData => {
            setBoardData(previousGameData[GAME_DATA_KEYS.BOARD_DATA])
        }
        addListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
        return () => removeListener(EVENTS.RESUME_PREVIOUS_GAME, handler)
    }, [])

    useEffect(() => {
        let componentUnmounted = false
        const handler = () => {
            const mainNumbersClone = [...mainNumbers]
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (!mainNumbersClone[row][col].isClue) mainNumbersClone[row][col].value = 0
                }
            }
            if (!componentUnmounted) setBoardData({ ...initBoardData(), mainNumbers: mainNumbersClone })
        }
        addListener(EVENTS.RESTART_GAME, handler)
        return () => {
            removeListener(EVENTS.RESTART_GAME, handler)
            componentUnmounted = true
        }
    }, [mainNumbers])

    useEffect(() => {
        const handler = ({ mainNumbers }) => {
            setBoardData({ ...initBoardData(), mainNumbers })
        }
        addListener(EVENTS.START_NEW_GAME, handler)
        return () => {
            removeListener(EVENTS.START_NEW_GAME, handler)
        }
    }, [])

    useEffect(() => {
        const handler = () => {
            const boardData = {
                mainNumbers,
                notesInfo,
                movesStack: movesStack.current,
                selectedCell,
            }
            cacheGameData(GAME_DATA_KEYS.BOARD_DATA, boardData)
        }

        addListener(EVENTS.CACHE_GAME_DATA, handler)
        return () => removeListener(EVENTS.CACHE_GAME_DATA, handler)
    }, [mainNumbers, notesInfo, movesStack, selectedCell])
}

export { useGameBoard }
