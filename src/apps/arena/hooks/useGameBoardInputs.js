import { useSelector } from 'react-redux'

import { getTryOutSelectedCell, getTryOutMainNumbers, getTryOutNotes } from '../store/selectors/smartHintHC.selectors'
import {
    getMainNumbers, getMoves, getNotesInfo, getSelectedCell,
} from '../store/selectors/board.selectors'
import { useIsHintTryOutStep } from './smartHints'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { useCacheGameState } from './useCacheGameState'

export const useGameBoardInputs = () => {
    const isHintTryOut = useIsHintTryOutStep()
    const selectedCellSelector = isHintTryOut ? getTryOutSelectedCell : getSelectedCell
    const mainNumbersSelector = isHintTryOut ? getTryOutMainNumbers : getMainNumbers
    const notesSelector = isHintTryOut ? getTryOutNotes : getNotesInfo

    const selectedCell = useSelector(selectedCellSelector)
    const mainNumbers = useSelector(mainNumbersSelector)
    const notes = useSelector(notesSelector)

    return {
        selectedCell,
        mainNumbers,
        notes,
    }
}

export const useSavePuzzleState = () => {
    const selectedCell = useSelector(getSelectedCell)
    const mainNumbers = useSelector(getMainNumbers)
    const notes = useSelector(getNotesInfo)
    const moves = useSelector(getMoves)

    useCacheGameState(GAME_DATA_KEYS.BOARD_DATA, {
        mainNumbers,
        notes,
        moves,
        selectedCell,
    })

    // const {
    //     selectedCell,
    //     mainNumbers,
    //     notes,
    // } = useGameBoardInputs()

    // // const selectedCell = useSelector(getSelectedCell)
    // // const mainNumbers = useSelector(getMainNumbers)
    // // const notes = useSelector(getNotesInfo)
    // const moves = useSelector(getMoves)

    // useCacheGameState(GAME_DATA_KEYS.BOARD_DATA, {
    //     mainNumbers,
    //     notes,
    //     moves,
    //     selectedCell,
    // })
}
