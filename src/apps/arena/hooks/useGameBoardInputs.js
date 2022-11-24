import { useSelector } from 'react-redux'

import { getTryOutMainNumbers, getTryOutNotes } from '../store/selectors/smartHintHC.selectors'
import { getMainNumbers, getNotesInfo, getSelectedCell } from '../store/selectors/board.selectors'

import { useIsHintTryOutStep } from '../utils/smartHints/hooks'

export const useGameBoardInputs = () => {
    const isHintTryOut = useIsHintTryOutStep()

    const mainNumbersSelector = isHintTryOut ? getTryOutMainNumbers : getMainNumbers
    const notesSelector = isHintTryOut ? getTryOutNotes : getNotesInfo

    const selectedCell = useSelector(getSelectedCell)
    const mainNumbers = useSelector(mainNumbersSelector)
    const notesInfo = useSelector(notesSelector)

    return {
        selectedCell,
        mainNumbers,
        notesInfo,
    }
}
